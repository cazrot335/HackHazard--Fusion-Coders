import { useState, useRef, useEffect } from 'react';
import { PlayIcon, TerminalIcon, FileIcon, FolderIcon, PlusIcon, TrashIcon, EditIcon } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import './App.css';
import axios from 'axios';

export default function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [filename, setFilename] = useState('');
  const [language, setLanguage] = useState('');
  const [files, setFiles] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false); // New state for input handling
  const terminalRef = useRef(null);
  const terminal = useRef(null);
  const fitAddon = useRef(null);
  const hasInitializedTerminal = useRef(false); // Track if the terminal has been initialized

  useEffect(() => {
    // Initialize xterm.js terminal with fit addon
    terminal.current = new Terminal({
      fontSize: 13,
      fontFamily: '"Consolas", "Courier New", monospace',
      theme: {
        background: '#121212',
        foreground: '#d4d4d4',
        cursor: '#ffffff',
        cursorAccent: '#000000',
        selection: 'rgba(255, 255, 255, 0.3)',
      },
    });

    fitAddon.current = new FitAddon();
    terminal.current.loadAddon(fitAddon.current);

    if (terminalRef.current) {
      terminal.current.open(terminalRef.current);
      fitAddon.current.fit();

      // Display the welcome message only once
      if (!hasInitializedTerminal.current) {
        terminal.current.writeln('\x1b[1;34mWelcome to the Web IDE Terminal!\x1b[0m');
        hasInitializedTerminal.current = true;
      }
    }

    // Handle user input in the terminal
    terminal.current.onData((data) => {
      if (isWaitingForInput) {
        handleUserInput(data.trim());
      }
    });

    // Handle window resize to fit terminal
    const handleResize = () => {
      if (fitAddon.current) {
        fitAddon.current.fit();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isWaitingForInput]);

  useEffect(() => {
    // Fetch files from the backend
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/files');
        setFiles(response.data.files);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleRunCode = async () => {
    if (!filename || isRunning) return;

    // Derive the language from the file extension
    const fileExtension = filename.split('.').pop();
    let derivedLanguage = '';
    if (fileExtension === 'py') {
      derivedLanguage = 'python';
    } else if (fileExtension === 'js') {
      derivedLanguage = 'javascript';
    } else if (fileExtension === 'cpp') {
      derivedLanguage = 'cpp';
    } else {
      terminal.current.writeln('\x1b[1;31mUnsupported file type.\x1b[0m');
      return;
    }

    setIsRunning(true);
    terminal.current.writeln(`\r\n\x1b[1;33mRunning ${filename}...\x1b[0m`);

    try {
      const response = await axios.post('http://localhost:5000/execute', {
        filename,
        code,
        language: derivedLanguage,
        userInput: '', // Initially no user input
      });

      if (response.data.output.includes('Enter')) {
        // If the program is waiting for input
        setIsWaitingForInput(true);
        terminal.current.write(response.data.output); // Append output
      } else {
        // If the program has completed execution
        setOutput(response.data.output);
        terminal.current.write(`\x1b[32m${response.data.output}\x1b[0m`);
        terminal.current.writeln('\r\n\x1b[1;32mExecution completed successfully.\x1b[0m');
      }
    } catch (error) {
      terminal.current.writeln('\x1b[1;31mError executing code.\x1b[0m');
      console.error('Error executing code:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleUserInput = async (input) => {
    setIsWaitingForInput(false);
    terminal.current.writeln(`\x1b[1;33mUser input: ${input}\x1b[0m`);

    try {
      const response = await axios.post('http://localhost:5000/execute', {
        filename,
        code,
        language,
        userInput: input, // Pass user input to the backend
      });

      if (response.data.output.includes('Enter')) {
        // If the program is still waiting for input
        setIsWaitingForInput(true);
        terminal.current.write(response.data.output); // Append output
      } else {
        // If the program has completed execution
        setOutput(response.data.output);
        terminal.current.write(`\x1b[32m${response.data.output}\x1b[0m`);
        terminal.current.writeln('\r\n\x1b[1;32mExecution completed successfully.\x1b[0m');
      }
    } catch (error) {
      terminal.current.writeln('\x1b[1;31mError executing code.\x1b[0m');
      console.error('Error executing code:', error);
    }
  };

  const handleFileClick = async (file) => {
    setFilename(file.name);

    // Derive the language from the file extension
    const fileExtension = file.name.split('.').pop();
    let derivedLanguage = '';
    if (fileExtension === 'py') {
      derivedLanguage = 'python';
    } else if (fileExtension === 'js') {
      derivedLanguage = 'javascript';
    } else if (fileExtension === 'cpp') {
      derivedLanguage = 'cpp';
    } else if (fileExtension === 'html') {
      derivedLanguage = 'html';
    } else {
      terminal.current.writeln('\x1b[1;31mUnsupported file type.\x1b[0m');
      return;
    }
    setLanguage(derivedLanguage);

    try {
      const response = await axios.get(`http://localhost:5000/file/${file.name}`);
      setCode(response.data.code);
    } catch (error) {
      console.error('Error fetching file content:', error);
    }
  };

  const handleCreateFile = async () => {
    const newFilename = prompt('Enter the file name (e.g., main.py, index.html):');
    if (!newFilename) return;

    try {
      await axios.post('http://localhost:5000/create-file', { filename: newFilename });
      setFiles([...files, { name: newFilename, language: newFilename.split('.').pop() }]);
      terminal.current.writeln(`\x1b[1;34mCreated new file: ${newFilename}\x1b[0m`);
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  const handleDeleteFile = async (file) => {
    if (!window.confirm(`Are you sure you want to delete ${file.name}?`)) return;

    try {
      await axios.delete(`http://localhost:5000/delete-file/${file.name}`);
      setFiles(files.filter((f) => f.name !== file.name));
      terminal.current.writeln(`\x1b[1;31mDeleted file: ${file.name}\x1b[0m`);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleRenameFile = async (file) => {
    const newFilename = prompt('Enter the new file name:', file.name);
    if (!newFilename || newFilename === file.name) return;

    try {
      await axios.put('http://localhost:5000/rename-file', {
        oldFilename: file.name,
        newFilename,
      });

      setFiles(
        files.map((f) =>
          f.name === file.name ? { ...f, name: newFilename } : f
        )
      );
      terminal.current.writeln(`\x1b[1;34mRenamed file: ${file.name} to ${newFilename}\x1b[0m`);
    } catch (error) {
      console.error('Error renaming file:', error);
    }
  };

  return (
    <div className="app">
      {/* Top bar */}
      <div className="top-bar">
        <div className="menu">
          <span className="menu-item">Web IDE</span>
          <button className="menu-item" onClick={handleCreateFile}>
            <PlusIcon size={14} />
            New File
          </button>
        </div>
        <button
          className={`run-button ${isRunning ? 'loading' : ''}`}
          onClick={handleRunCode}
          disabled={isRunning}
        >
          <PlayIcon size={14} className="icon" />
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* File explorer */}
        <div className="file-explorer">
          <div className="explorer-header">EXPLORER</div>
          <div className="folder">
            <FolderIcon size={16} className="icon" style={{ color: '#75beff' }} />
            <span>project</span>
          </div>
          <div className="file-list">
            {files.map((file, index) => (
              <div key={index} className={`file-item ${file.name === filename ? 'active' : ''}`}>
                <div onClick={() => handleFileClick(file)}>
                  <FileIcon size={14} className="icon" />
                  <span>{file.name}</span>
                </div>
                <div className="file-actions">
                  <EditIcon size={14} className="icon" onClick={() => handleRenameFile(file)} />
                  <TrashIcon size={14} className="icon" onClick={() => handleDeleteFile(file)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor and output */}
        <div className="editor-output">
          <div className="editor-tabs">
            <div className="tab active-tab">
              <span>{filename || 'Untitled'}</span>
            </div>
          </div>

          <Editor
            height="calc(100vh - 255px)"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={handleEditorChange}
            options={{
              fontSize: 14,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: 'on',
              tabSize: 2,
              wordWrap: 'on',
            }}
          />

          {/* Terminal */}
          <div className="terminal">
            <div className="terminal-header">
              <TerminalIcon size={14} className="icon" />
              <span>TERMINAL</span>
            </div>
            <div ref={terminalRef} className="terminal-output"></div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="status-bar">
        <div>{language.toUpperCase()}</div>
        <div>UTF-8</div>
      </div>
    </div>
  );
}