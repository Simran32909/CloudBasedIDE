import React, { useState, useRef, useEffect } from 'react';

function Terminal({ height, onResize }) {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', content: 'Welcome to Cloud IDE Terminal' },
    { type: 'system', content: 'Type "help" to see available commands' }
  ]);
  const terminalRef = useRef(null);
  const resizerRef = useRef(null);
  const historyEndRef = useRef(null);

  // Terminal commands
  const executeCommand = (cmd) => {
    // Add command to history
    setHistory(prev => [...prev, { type: 'command', content: `$ ${cmd}` }]);

    // Process command
    const cmdLower = cmd.trim().toLowerCase();

    if (cmdLower === 'clear' || cmdLower === 'cls') {
      setHistory([{ type: 'system', content: 'Terminal cleared' }]);
    } else if (cmdLower === 'help') {
      setHistory(prev => [
        ...prev,
        { type: 'output', content: 'Available commands:' },
        { type: 'output', content: '  help - Show this help message' },
        { type: 'output', content: '  clear, cls - Clear the terminal' },
        { type: 'output', content: '  echo [text] - Display text' },
        { type: 'output', content: '  date - Show current date and time' },
        { type: 'output', content: '  ls - List files (simulated)' }
      ]);
    } else if (cmdLower.startsWith('echo ')) {
      const text = cmd.substring(5);
      setHistory(prev => [...prev, { type: 'output', content: text }]);
    } else if (cmdLower === 'date') {
      setHistory(prev => [...prev, {
        type: 'output',
        content: new Date().toLocaleString()
      }]);
    } else if (cmdLower === 'ls') {
      setHistory(prev => [
        ...prev,
        { type: 'output', content: 'src/' },
        { type: 'output', content: 'public/' },
        { type: 'output', content: 'package.json' },
        { type: 'output', content: 'README.md' }
      ]);
    } else if (cmd.trim() !== '') {
      setHistory(prev => [
        ...prev,
        { type: 'error', content: `Command not found: ${cmd}` }
      ]);
    }

    // Clear input
    setCommand('');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    executeCommand(command);
  };

  // Setup resizer functionality
  useEffect(() => {
    const resizer = resizerRef.current;
    if (!resizer) return;

    let startY;
    let startHeight;

    const onMouseDown = (e) => {
      startY = e.clientY;
      startHeight = height;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      // Calculate new height (minimum 100px, maximum 80% of window height)
      const newHeight = Math.min(
        Math.max(100, startHeight - (e.clientY - startY)),
        window.innerHeight * 0.8
      );
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

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div
      className="terminal-container"
      style={{
        height: `${height}px`,
        backgroundColor: 'var(--secondary-bg)',
        borderTop: '1px solid var(--border-color)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}
      ref={terminalRef}
    >
      <div
        className="resizer"
        ref={resizerRef}
      />

      <div className="terminal-header" style={{
        padding: '4px 8px',
        backgroundColor: 'var(--tertiary-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>Terminal</span>
        <button
          className="icon-btn"
          onClick={() => onResize(height === 200 ? 400 : 200)}
          title={height === 200 ? "Expand terminal" : "Collapse terminal"}
        >
          {height === 200 ? '↑' : '↓'}
        </button>
      </div>

      <div
        className="terminal-output"
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '8px',
          fontFamily: 'monospace',
          fontSize: '14px',
          lineHeight: '1.5',
          color: 'var(--text-color)'
        }}
      >
        {history.map((entry, index) => (
          <div
            key={index}
            className={`terminal-line terminal-${entry.type}`}
            style={{
              color: entry.type === 'error' ? 'var(--error-color)' :
                    entry.type === 'system' ? 'var(--accent-color)' :
                    'inherit',
              marginBottom: '4px'
            }}
          >
            {entry.content}
          </div>
        ))}
        <div ref={historyEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          padding: '8px',
          borderTop: '1px solid var(--border-color)'
        }}
      >
        <span style={{ marginRight: '8px' }}>$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-color)',
            fontFamily: 'monospace',
            fontSize: '14px',
            outline: 'none'
          }}
          autoFocus
        />
      </form>
    </div>
  );
}

export default Terminal;