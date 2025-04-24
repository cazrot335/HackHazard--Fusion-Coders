import { useState, useRef, useEffect } from 'react';
import { PlayIcon, TerminalIcon, FileIcon, FolderIcon, PlusIcon, TrashIcon, EditIcon, MessageCircleIcon, Image, Mic, StopCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import './App.css';
import axios from 'axios';
import * as monaco from 'monaco-editor';
import Tesseract from 'tesseract.js';
import CodeBlock from './components/CodeBlock';
import ReactMarkdown from "react-markdown";

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
    <button className="copy-button" onClick={() => copyToClipboard(code)}>
      Copy
    </button>
    <pre>{code}</pre>
  </div>
);

const fetchCompletionSuggestions = async (code, cursorPosition) => {
  console.log('Fetching completion for:', { code, cursorPosition });

  try {
    const response = await fetch('http://localhost:5000/code-completion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cursorPosition }),
    });

    const data = await response.json();
    console.log('Completion response:', data);
    return data.completion; // Return the completion text
  } catch (error) {
    console.error('Error fetching code completion:', error);
    return '';
  }
};

const fetchCompletion = async (editor) => {
  const code = editor.getValue(); // Get the current code from the editor
  const cursorPosition = editor.getPosition(); // Get the cursor position

  try {
    const completion = await fetchCompletionSuggestions(code, cursorPosition);

    if (completion) {
      editor.executeEdits('', [
        {
          range: editor.getSelection(),
          text: completion,
          forceMoveMarkers: true,
        },
      ]);
    }
  } catch (error) {
    console.error('Error fetching code completion:', error);
  }
};

const registerCompletionProvider = (editor) => {
  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: async (model, position) => {
      console.log('Completion provider triggered:', { model, position });

      const code = model.getValue();
      const cursorPosition = {
        lineNumber: position.lineNumber,
        column: position.column,
      };

      const completion = await fetchCompletionSuggestions(code, cursorPosition);

      if (!completion) {
        console.log('No completion received');
        return { suggestions: [] };
      }

      console.log('Providing suggestions:', completion);

      return {
        suggestions: [
          {
            label: completion.trim(),
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: completion.trim(),
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            },
          },
        ],
      };
    },
  });

  editor.addCommand(monaco.KeyCode.Tab, () => {
    console.log('Tab key pressed');
    const position = editor.getPosition();
    const code = editor.getValue();

    fetchCompletionSuggestions(code, position).then((completion) => {
      if (completion) {
        console.log('Inserting completion:', completion);
        editor.executeEdits('', [
          {
            range: editor.getSelection(),
            text: completion.trim(),
            forceMoveMarkers: true,
          },
        ]);
      }
    });
  });
};

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
  const [isListening, setIsListening] = useState(false); // Add state for listening
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

    // Handle terminal input
    let inputBuffer = ''; // Buffer to store user input
    terminal.current.onData((data) => {
      if (isWaitingForInput) {
        if (data === '\r') {
          // Process input when Enter key is pressed
          handleUserInput(inputBuffer.trim());
          inputBuffer = ''; // Clear the buffer after processing
          setIsWaitingForInput(false); // Stop waiting for input
        } else if (data === '\u0003') {
          // Handle Ctrl+C to cancel input
          terminal.current.writeln('^C');
          inputBuffer = ''; // Clear the buffer
          setIsWaitingForInput(false); // Stop waiting for input
        } else {
          // Append data to the input buffer and display it in the terminal
          inputBuffer += data;
          terminal.current.write(data);
        }
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

    try {
      // Save the updated code to the backend
      await axios.post('http://localhost:5000/update-code', {
        filename,
        code: value,
      });

      terminal.current.writeln(`\x1b[1;34mAuto-saved ${filename}\x1b[0m`);
    } catch (error) {
      console.error('Error saving file:', error);
      terminal.current.writeln('\x1b[1;31mError saving file. Check the backend logs for details.\x1b[0m');
    }

    // Existing logic for language detection and validation
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

    // New logic for Fluvio integration
    try {
      const ws = new WebSocket('ws://localhost:8080');
      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            filename,
            code: value,
          })
        );
      };
    } catch (error) {
      console.error('Error sending code update to WebSocket:', error);
    }
  }, 500);

  const handleRunCode = async () => {
    if (!filename || isRunning) return; // Prevent multiple executions if already running

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

    setIsRunning(true); // Set the running state to true
    terminal.current.writeln(`\r\n\x1b[1;33mRunning ${filename}...\x1b[0m`);

    try {
      const response = await axios.post('http://localhost:5000/execute', {
        filename,
        code,
        language: derivedLanguage,
        userInput: '',
      });

      if (response.data.waitingForInput) {
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
      setIsRunning(false); // Reset the running state
    }
  };

  const handleUserInput = async (input) => {
    terminal.current.writeln(`\x1b[1;33mUser input: ${input}\x1b[0m`);

    try {
      const response = await axios.post('http://localhost:5000/execute', {
        filename,
        code,
        language,
        userInput: input,
      });

      if (response.data.waitingForInput) {
        setIsWaitingForInput(true); // Wait for further input if required
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

  const handleVoiceInput = () => {
    if (isListening) {
      // Stop listening
      setIsListening(false);
      recognition.stop(); // Stop the recognition process
      return;
    }

    // Start listening
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log('Voice recognition started...');
      setIsListening(true); // Set listening state to true
    };

    recognition.onresult = (event) => {
      console.log('Voice input:', event.results[0][0].transcript);
      setUserMessage(event.results[0][0].transcript); // Set the transcribed text in the input field
      handleSendMessage(); // Automatically send the transcribed message
    };

    recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      setIsListening(false); // Reset listening state on error
    };

    recognition.onend = () => {
      console.log('Voice recognition ended.');
      setIsListening(false); // Reset listening state when recognition ends
    };

    recognition.start();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target.result;

      try {
        const { data: { text } } = await Tesseract.recognize(imageData, 'eng');
        console.log('Extracted text from image:', text);
        setUserMessage(text); // Set the extracted text in the input field
        handleSendMessage(); // Automatically send the extracted text
      } catch (error) {
        console.error('Error extracting text from image:', error);
      }
    };

    reader.readAsDataURL(file);
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

  const messagesEndRef = useRef(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [chatMessages]);

const chatRef = useRef(null);
const isResizing = useRef(false);

const startResizing = (e) => {
  isResizing.current = true;
  document.addEventListener("mousemove", resizeChat);
  document.addEventListener("mouseup", stopResizing);
};

const resizeChat = (e) => {
  if (!isResizing.current || !chatRef.current) return;
  const newWidth = window.innerWidth - e.clientX;
  if (newWidth > 250 && newWidth < 600) {
    chatRef.current.style.width = `${newWidth}px`;
  }
};

const stopResizing = () => {
  isResizing.current = false;
  document.removeEventListener("mousemove", resizeChat);
  document.removeEventListener("mouseup", stopResizing);
};

  useEffect(() => {
  const ws = new WebSocket('ws://localhost:8080');

  ws.onmessage = (event) => {
    const { filename: updatedFilename, code: updatedCode } = JSON.parse(event.data);

    // Update the editor if the file matches the current file
    if (updatedFilename === filename) {
      setCode(updatedCode);
    }
  };

  return () => ws.close();
}, [filename]);

  return (
    <div className="app">
      <div className="top-bar">
        <div className="menu">
          <span className="menu-item">DevNest AI</span>
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
              language="javascript"
              value={code}
              onChange={(value) => setCode(value)}
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
                registerCompletionProvider(editor); // Attach the completion provider
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

        {/* Chat Section */}
        {isChatOpen && (
  <div className="chatbot" ref={chatRef}>
    <div className="chatbot-resizer" onMouseDown={startResizing}></div>

    <div className="chatbot-header">AI Assistant</div>

    <div className="chatbot-messages">
      {chatMessages.map((msg, index) => (
        <div
          key={index}
          className={`chatbot-message ${msg.sender === 'user' ? 'user' : 'ai'}`}
        >
          {msg.sender === 'ai' ? (
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline ? (
                    <CodeBlock
                      language={match ? match[1] : 'text'}
                      value={String(children).replace(/\n$/, '')}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {msg.text}
            </ReactMarkdown>
          ) : (
            msg.text
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>

    <div className="chatbot-input">
      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSendMessage();
        }}
        placeholder="Type your message..."
      />
      <button onClick={handleSendMessage}>Send</button>
      <button
        className={`voice-button ${isListening ? 'listening' : ''}`}
        onClick={handleVoiceInput}
      >
        {isListening ? <StopCircle size={18} /> : <Mic size={18} />}
      </button>
      <button onClick={() => document.getElementById('image-upload').click()}>
        <Image size={18} />
      </button>
      <input
        type="file"
        id="image-upload"
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleImageUpload}
      />
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