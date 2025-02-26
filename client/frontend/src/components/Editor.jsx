import React, { useState, useEffect } from 'react';
import './Editor.css';

function Editor({ file }) {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    // Here you would fetch file content from server
    // For this demo, we're using placeholder content
    if (file) {
      // Simplified example
      const ext = file.split('.').pop().toLowerCase();

      // Set language based on file extension
      switch (ext) {
        case 'js':
        case 'jsx':
          setLanguage('javascript');
          break;
        case 'html':
          setLanguage('html');
          break;
        case 'css':
          setLanguage('css');
          break;
        case 'json':
          setLanguage('json');
          break;
        default:
          setLanguage('text');
      }

      // Mock content - in real app, this would come from backend
      setContent(`// File: ${file}\n// This is a placeholder for the actual content of ${file}`);
    }
  }, [file]);

  return (
    <div className="editor">
      <div className="editor-tabs">
        {file && (
          <div className="tab active">
            <span className="tab-name">
              {file.split('/').pop()}
            </span>
            <button className="tab-close">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="editor-content">
        <div className="line-numbers">
          {content.split('\n').map((_, index) => (
            <div key={index} className="line-number">{index + 1}</div>
          ))}
        </div>
        <div className="code-area">
          <pre className={`language-${language}`}>
            <code>{content}</code>
          </pre>
        </div>
      </div>

      <div className="editor-info">
        <div className="language-indicator">{language.toUpperCase()}</div>
        <div className="spacer"></div>
        <div className="cursor-position">Ln 1, Col 1</div>
      </div>
    </div>
  );
}

export default Editor;