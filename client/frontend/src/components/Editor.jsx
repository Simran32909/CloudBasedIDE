import React, { useState, useEffect } from 'react';
import { fileService } from '../services/api';
import './Editor.css';

function Editor({ file }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveTimeout, setSaveTimeout] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadFileContent = async () => {
      try {
        const response = await fileService.getFileContent(file);
        setContent(response.content);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (file) {
      loadFileContent();
    }
  }, [file]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Debounce auto-save
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    setSaveTimeout(setTimeout(() => saveContent(newContent), 1000));
  };

  const saveContent = async (contentToSave) => {
    try {
      await fileService.updateFile(file, contentToSave);
    } catch (err) {
      setError('Failed to save file: ' + err.message);
    }
  };

  if (loading) {
    return <div className="editor-loading">Loading file...</div>;
  }

  if (error) {
    return <div className="editor-error">{error}</div>;
  }

  return (
    <div className="editor">
      <div className="editor-header">
        <span className="file-name">{file}</span>
      </div>
      <textarea
        className="editor-textarea"
        value={content}
        onChange={handleContentChange}
        spellCheck="false"
        style={{
          width: '100%',
          height: 'calc(100% - 30px)',
          resize: 'none',
          backgroundColor: 'var(--secondary-bg)',
          color: 'var(--text-color)',
          border: 'none',
          padding: '10px',
          fontFamily: 'monospace',
          fontSize: '14px',
          lineHeight: '1.5',
          outline: 'none'
        }}
      />
    </div>
  );
}

export default Editor;