const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const filesDir = path.join(__dirname, 'files');
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}

// Initialize Groq SDK
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Fetch all files
app.get('/files', (req, res) => {
  fs.readdir(filesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch files.' });
    }
    const fileDetails = files.map((file) => ({
      name: file,
      language: file.split('.').pop(),
    }));
    res.json({ files: fileDetails });
  });
});

// Fetch file content
app.get('/file/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(filesDir, filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read file.' });
    }
    res.json({ code: data });
  });
});

// Create a new file
app.post('/create-file', (req, res) => {
  const { filename, code = '' } = req.body;
  const filePath = path.join(filesDir, filename);

  fs.writeFile(filePath, code, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create file.' });
    }
    res.json({ message: 'File created successfully.' });
  });
});

// Delete a file
app.delete('/delete-file/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(filesDir, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete file.' });
    }
    res.json({ message: 'File deleted successfully.' });
  });
});

// Rename a file
app.put('/rename-file', (req, res) => {
  const { oldFilename, newFilename } = req.body;
  const oldFilePath = path.join(filesDir, oldFilename);
  const newFilePath = path.join(filesDir, newFilename);

  fs.rename(oldFilePath, newFilePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to rename file.' });
    }
    res.json({ message: 'File renamed successfully.' });
  });
});

// Execute code
app.post('/execute', (req, res) => {
  const { filename, code, language, userInput } = req.body;

  if (!filename || !code || !language) {
    return res.status(400).json({ error: 'Missing required fields: filename, code, or language.' });
  }

  const filePath = path.join(filesDir, filename);

  // Write the provided code to the file
  fs.writeFile(filePath, code, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to write file.' });
    }

    let command = '';
    if (language === 'python') {
      command = `python3 ${filePath}`;
    } else if (language === 'javascript') {
      command = `node ${filePath}`;
    } else if (language === 'cpp') {
      const outputFilePath = filePath.replace('.cpp', '');
      command = `g++ ${filePath} -o ${outputFilePath} && ${outputFilePath}`;
    } else {
      return res.status(400).json({ error: 'Unsupported language.' });
    }

    // Execute the command
    const child = exec(command);
    let stdout = '';
    let stderr = '';
    let responseSent = false; // Flag to track if a response has been sent

    child.stdout.on('data', (data) => {
      stdout += data;

      // Check if the program is waiting for input
      if (data.includes('Enter') && !responseSent) {
        responseSent = true; // Mark response as sent
        res.json({ output: stdout });
        child.kill(); // Stop the process to wait for input
      }
    });

    child.stderr.on('data', (data) => {
      stderr += data;
    });

    child.on('close', (code) => {
      if (!responseSent) {
        responseSent = true; // Mark response as sent
        if (code !== 0) {
          return res.json({ output: stderr });
        }
        res.json({ output: stdout });
      }
    });

    // Pass user input to the program
    if (userInput) {
      child.stdin.write(userInput + '\n');
      child.stdin.end();
    }
  });
});

// Validate code syntax
app.post('/validate', (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Missing required fields: code or language.' });
  }

  const tempDir = path.join(__dirname, 'temp');
  const tempFilePath = path.join(tempDir, `temp.${language}`);

  // Ensure the temp directory exists
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Write the code to a temporary file
  fs.writeFile(tempFilePath, code, (err) => {
    if (err) {
      console.error('Failed to write temporary file:', err);
      return res.status(500).json({ error: 'Failed to write temporary file.' });
    }

    let command = '';
    if (language === 'python') {
      command = `python3 -m py_compile ${tempFilePath}`; // Check syntax for Python
    } else if (language === 'javascript') {
      command = `node --check ${tempFilePath}`; // Check syntax for JavaScript
    } else if (language === 'cpp') {
      command = `g++ -fsyntax-only ${tempFilePath}`; // Check syntax for C++
    } else {
      return res.status(400).json({ error: 'Unsupported language.' });
    }

    // Execute the syntax check command
    exec(command, (error, stdout, stderr) => {
      // Clean up the temporary file
      fs.unlink(tempFilePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Failed to delete temporary file:', unlinkErr);
        }
      });

      if (error) {
        console.error('Syntax validation error:', stderr);

        // Parse the error message to extract line numbers and messages
        const errors = [];
        const lines = stderr.split('\n');
        lines.forEach((line) => {
          const match = line.match(/.*:(\d+):(\d+): (.*)/); // Extract line and column numbers
          if (match) {
            errors.push({
              line: parseInt(match[1], 10),
              column: parseInt(match[2], 10),
              message: match[3],
            });
          }
        });

        return res.json({ errors });
      }

      res.json({ errors: [] }); // No errors
    });
  });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // Call Groq API for chat completion
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'llama-3.3-70b-versatile', // Replace with the desired model
    });

    // Extract the response content
    const responseContent = chatCompletion.choices[0]?.message?.content || 'No response from the model.';

    // Send the response back to the frontend
    res.json({ response: responseContent });
  } catch (error) {
    console.error('Error with Groq API:', error.message || error);
    res.status(500).json({ error: 'Failed to process the request.' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});