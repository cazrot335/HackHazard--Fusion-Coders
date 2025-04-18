import { useState, useRef, useEffect } from 'react';
import { PlayIcon, TerminalIcon, FileIcon, FolderIcon, PlusIcon, TrashIcon, EditIcon, MessageCircleIcon } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import './App.css';
import axios from 'axios';

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('Code copied to clipboard!');
  }).catch((err) => {
    console.error('Failed to copy text: ', err);
  });
};

const CodeSnippet = ({ code }) => (
  <div className="code-snippet">
    <pre>{code}</pre>
    <button className="copy-button" onClick={() => copyToClipboard(code)}>
      Copy
    </button>
  </div>
);

export default function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [filename, setFilename] = useState('');
  const [language, setLanguage] = useState('');
  const [files, setFiles] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const terminalRef = useRef(null);
  const terminal = useRef(null);
  const fitAddon = useRef(null);
  const hasInitializedTerminal = useRef(false);
  const terminalContainerRef = useRef(null);

  useEffect(() => {
    if (!terminal.current) {
      terminal.current = new Terminal({
        fontSize: 13,
        fontFamily: '"Consolas", "Courier New", monospace',
        theme: {
          background: "#121212",
          foreground: "#d4d4d4",
          cursor: "#ffffff",
          cursorAccent: "#000000",
          selection: "rgba(255, 255, 255, 0.3)",
        },
      });

      fitAddon.current = new FitAddon();
      terminal.current.loadAddon(fitAddon.current);

      if (terminalRef.current) {
        terminal.current.open(terminalRef.current);
        fitAddon.current.fit();

        if (!hasInitializedTerminal.current) {
          terminal.current.writeln('\x1b[1;34mWelcome to the Web IDE Terminal!\x1b[0m');
          hasInitializedTerminal.current = true;
        }
      }
    }

    terminal.current.onData((data) => {
      if (isWaitingForInput) {
        handleUserInput(data.trim());
      }
    });

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

  const handleEditorChange = debounce(async (value) => {
    setCode(value || '');

    if (!filename) return;

    const fileExtension = filename.split('.').pop();
    let derivedLanguage = '';
    if (fileExtension === 'py') {
      derivedLanguage = 'python';
    } else if (fileExtension === 'js') {
      derivedLanguage = 'javascript';
    } else if (fileExtension === 'cpp') {
      derivedLanguage = 'cpp';
    } else {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/validate', {
        code: value,
        language: derivedLanguage,
      });

      if (response.data.errors) {
        const markers = response.data.errors.map((error) => ({
          startLineNumber: error.line,
          startColumn: error.column,
          endLineNumber: error.line,
          endColumn: error.column + 1,
          message: error.message,
          severity: monaco.MarkerSeverity.Error,
        }));

        monaco.editor.setModelMarkers(monaco.editor.getModels()[0], 'owner', markers);
      } else {
        monaco.editor.setModelMarkers(monaco.editor.getModels()[0], 'owner', []);
      }
    } catch (error) {
      console.error('Error validating code:', error);
      terminal.current.writeln('\x1b[1;31mError validating code. Check the backend logs for details.\x1b[0m');
    }
  }, 500);

  const handleRunCode = async () => {
    if (!filename || isRunning) return;

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
        userInput: '',
      });

      if (response.data.output.includes('Enter')) {
        setIsWaitingForInput(true);
        terminal.current.write(response.data.output);
      } else {
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
        userInput: input,
      });

      if (response.data.output.includes('Enter')) {
        setIsWaitingForInput(true);
        terminal.current.write(response.data.output);
      } else {
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

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    setChatMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setChatMessages((prev) => [...prev, { sender: 'ai', text: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages((prev) => [...prev, { sender: 'ai', text: 'Error processing your request.' }]);
    } finally {
      setUserMessage('');
    }
  };

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleTerminalResize = (e) => {
    const terminalContainer = terminalContainerRef.current;
    const newHeight = window.innerHeight - e.clientY - 40;
    if (newHeight >= 100 && newHeight <= window.innerHeight * 0.5) {
      terminalContainer.style.height = `${newHeight}px`;
    }
  };

  const startTerminalResize = () => {
    window.addEventListener('mousemove', handleTerminalResize);
    window.addEventListener('mouseup', stopTerminalResize);
  };

  const stopTerminalResize = () => {
    window.removeEventListener('mousemove', handleTerminalResize);
    window.removeEventListener('mouseup', stopTerminalResize);
  };

  return (
    <div className="app">
      <div className="top-bar">
        <div className="menu">
          <span className="menu-item">Web IDE</span>
          <button className="menu-item" onClick={handleCreateFile}>
            <PlusIcon size={14} />
            New File
          </button>
        </div>
        <div className="top-bar-actions">
          <button className="menu-item" onClick={handleChatToggle}>
            <MessageCircleIcon size={14} />
            Chat
          </button>
          <button
            className={`run-button ${isRunning ? 'loading' : ''}`}
            onClick={handleRunCode}
            disabled={isRunning}
          >
            <PlayIcon size={14} className="icon" />
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      <div className={`main-content ${isChatOpen ? 'chat-open' : ''}`}>
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

        <div className="editor-terminal">
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
              editorDidMount={(editor) => {
                editor.onDidChangeCursorPosition((event) => {
                  const lineNumber = event.position.lineNumber;
                  const markers = monaco.editor.getModelMarkers({ owner: 'owner' });
                  const error = markers.find((marker) => marker.startLineNumber === lineNumber);

                  if (error) {
                    terminal.current.writeln(`\x1b[1;31mError on line ${lineNumber}: ${error.message}\x1b[0m`);
                  }
                });
              }}
            />

            <div
              ref={terminalContainerRef}
              className="terminal-container"
            >
              <div
                className="terminal-resize-handle"
                onMouseDown={startTerminalResize}
              ></div>
              <div className="terminal-header">
                <TerminalIcon size={14} className="icon" />
                <span>TERMINAL</span>
              </div>
              <div ref={terminalRef} className="terminal-output"></div>
            </div>
          </div>
        </div>

        {isChatOpen && (
          <div className="chatbot">
            <div className="chatbot-header">AI Assistant</div>
            <div className="chatbot-messages">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`chatbot-message ${msg.sender === 'user' ? 'user' : 'ai'}`}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              ))}
            </div>
            <div className="chatbot-input">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>

      <div className="status-bar">
        <div>Status: Ready</div>
      </div>
    </div>
  );
}