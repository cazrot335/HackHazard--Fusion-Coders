const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const filesDir = path.join(__dirname, 'files');
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}

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
  const { filename, code, language } = req.body;

  if (!filename || !code || !language) {
    return res.status(400).json({ error: 'Missing required fields: filename, code, or language.' });
  }

  const filePath = path.join(filesDir, filename);

  // Validate if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(400).json({ error: `File ${filename} does not exist.` });
  }

  // Write the provided code to the file
  fs.writeFile(filePath, code, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to write file.' });
    }

    let command = '';
    if (language === 'python') {
      command = `python3 ${filePath}`; // Use python3 for Python execution
    } else if (language === 'javascript') {
      command = `node ${filePath}`;
    } else if (language === 'cpp') {
      const outputFilePath = filePath.replace('.cpp', '');
      command = `g++ ${filePath} -o ${outputFilePath} && ${outputFilePath}`;
    } else if (language === 'html') {
      return res.json({ output: `HTML file created. Open ${filePath} in a browser.` });
    } else {
      return res.status(400).json({ error: 'Unsupported language.' });
    }

    // Execute the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return res.json({ output: stderr });
      }
      res.json({ output: stdout });
    });
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});