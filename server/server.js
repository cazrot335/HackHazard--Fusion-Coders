const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { exec, spawn } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');
const axios = require('axios');

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

// Spawn the Python process for the model server
const pythonProcess = spawn('python3', ['server.py']); // Use 'python' or 'python3' depending on your system

pythonProcess.stdout.on('data', (data) => {
  console.log(`Python Server: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
  console.error(`Python Server Error: ${data}`);
});

pythonProcess.on('close', (code) => {
  console.log(`Python server exited with code ${code}`);
});

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

      // If the program requests input, send the response and wait for input
      if (data.includes('Enter') && !responseSent) {
        responseSent = true; // Mark response as sent
        res.json({ output: stdout, waitingForInput: true });
      }
    });

    child.stderr.on('data', (data) => {
      stderr += data;
    });

    child.on('close', (code) => {
      if (!responseSent) {
        responseSent = true; // Mark response as sent
        if (code !== 0) {
          return res.json({ output: stderr, waitingForInput: false });
        }
        res.json({ output: stdout + '\nExecution completed successfully.', waitingForInput: false });
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
    // Check if the user is asking about files
    if (message.toLowerCase().includes('list files')) {
      const files = fs.readdirSync(path.join(__dirname, 'files'));
      return res.json({ response: `Here are the files in your project:\n${files.join('\n')}` });
    }

    // Check if the user is asking for the content or explanation of a specific file
    const fileMatch = message.match(/(?:contents of|explain|what is there in) (.+?) in brief/i);
    if (fileMatch) {
      const filename = fileMatch[1].trim();
      const filePath = path.join(__dirname, 'files', filename);

      if (!fs.existsSync(filePath)) {
        return res.json({ response: `The file "${filename}" does not exist.` });
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // Generate a brief explanation of the file's content
      const explanation = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a helpful assistant that explains code files briefly.' },
          { role: 'user', content: `Explain the following code in brief:\n\n${fileContent}` },
        ],
        model: 'llama-3.3-70b-versatile',
      });

      const explanationContent = explanation.choices[0]?.message?.content || 'No explanation available.';
      return res.json({
        response: `Here is the content of "${filename}":\n\n${fileContent}\n\nBrief Explanation:\n${explanationContent}`,
      });
    }

    // Default chatbot response using Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      model: 'llama-3.3-70b-versatile',
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || 'No response from the model.';
    res.json({ response: responseContent });
  } catch (error) {
    console.error('Error in /chat endpoint:', error.message || error);
    res.status(500).json({ error: 'Failed to process the request.' });
  }
});

// Code completion endpoint
app.post('/code-completion', async (req, res) => {
  const { code, cursorPosition } = req.body;

  try {
    // Forward the request to the Python server
    const response = await axios.post('http://localhost:5001/code-completion', {
      code,
    });

    res.json({ completion: response.data.completion });
  } catch (error) {
    console.error('Error fetching code completion:', error.message || error);
    res.status(500).json({ error: 'Failed to fetch code completion.' });
  }
});

// Voice to code endpoint
app.post('/voice-to-code', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant that generates code from voice inputs.' },
        { role: 'user', content: message },
      ],
      model: 'llama-3.3-70b-versatile',
    });

    const generatedCode = response.choices[0]?.message?.content || 'No code generated.';
    res.json({ response: generatedCode });
  } catch (error) {
    console.error('Error in voice-to-code:', error.message || error);
    res.status(500).json({ error: 'Failed to process the voice input.' });
  }
});

// Image to text endpoint
app.post('/image-to-text', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant that processes text extracted from images.' },
        { role: 'user', content: text },
      ],
      model: 'llama-3.3-70b-versatile',
    });

    const generatedResponse = response.choices[0]?.message?.content || 'No response generated.';
    res.json({ response: generatedResponse });
  } catch (error) {
    console.error('Error in image-to-text:', error.message || error);
    res.status(500).json({ error: 'Failed to process the image text.' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Node.js server running on http://localhost:${PORT}`);
});

// Handle process exit to clean up the Python process
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  pythonProcess.kill();
  process.exit();
});