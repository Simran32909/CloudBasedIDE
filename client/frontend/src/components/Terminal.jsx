import React, { useRef, useEffect, useState } from 'react';
import './Terminal.css';

function Terminal({ height, onResize }) {
  const resizerRef = useRef(null);
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'system', content: 'Cloud IDE Terminal' },
    { type: 'system', content: 'Type "help" for available commands' },
    { type: 'prompt', content: '> ' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const terminalContentRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const resizer = resizerRef.current;
    let startY;
    let startHeight;

    const onMouseDown = (e) => {
      startY = e.clientY;
      startHeight = height;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      const deltaY = startY - e.clientY;
      const newHeight = Math.max(100, Math.min(window.innerHeight * 0.7, startHeight + deltaY));
      onResize(newHeight);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    resizer.addEventListener('mousedown', onMouseDown);

    return () => {
      resizer.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [height, onResize]);

  useEffect(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputValue.trim()) {
      // Add user command to terminal output
      const newOutput = [...terminalOutput];
      // Update the last prompt with the command
      newOutput[newOutput.length - 1] = { type: 'prompt', content: '> ' + inputValue };

      // Process command
      let response;
      switch(inputValue.trim().toLowerCase()) {
        case 'help':
          response = { type: 'output', content: 'Available commands: help, clear, version, echo [text]' };
          break;
        case 'clear':
          setTerminalOutput([
            { type: 'system', content: 'Terminal cleared' },
            { type: 'prompt', content: '> ' }
          ]);
          setInputValue('');
          return;
        case 'version':
          response = { type: 'output', content: 'Cloud IDE Terminal v1.0.0' };
          break;
        default:
          if (inputValue.trim().startsWith('echo ')) {
            const echoText = inputValue.trim().substr(5);
            response = { type: 'output', content: echoText };
          } else {
            response = { type: 'error', content: `Command not found: ${inputValue}` };
          }
      }

      // Add response and new prompt
      setTerminalOutput([
        ...newOutput,
        response,
        { type: 'prompt', content: '> ' }
      ]);
    }

    setInputValue('');
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="terminal-container" style={{ height: `${height}px` }}>
      <div className="resizer" ref={resizerRef}></div>
      <div className="terminal-header">
        <span>TERMINAL</span>
        <div className="terminal-actions">
          <button className="icon-btn" title="New Terminal">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.5 8a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V8.5a.5.5 0 0 1 .5-.5z"/>
            </svg>
          </button>
          <button className="icon-btn" title="Kill Terminal">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
          <button className="icon-btn" title="Clear Terminal">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="terminal-content" ref={terminalContentRef} onClick={focusInput}>
        {terminalOutput.map((line, index) => (
          <div key={index} className={`terminal-line ${line.type}`}>
            {line.content}
            {index === terminalOutput.length - 1 && line.type === 'prompt' && (
              <form onSubmit={handleSubmit} className="terminal-input-form">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="terminal-input"
                  autoFocus
                />
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Terminal;