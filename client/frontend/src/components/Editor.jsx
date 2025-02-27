import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

function Editor({ file }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset states when file changes
    setLoading(true);
    setError(null);

    const getFileContent = () => {
      // Simulate API call
      setTimeout(() => {
        try {
          // This is a simplified simulation - in a real app you'd fetch from API
          const filePathParts = file.split('/');
          const fileName = filePathParts[filePathParts.length - 1];

          // Sample content based on file extension
          let simulatedContent = '';

          if (fileName.endsWith('.jsx')) {
            simulatedContent = `import React from 'react';\n\nfunction ${fileName.replace('.jsx', '')}() {\n  return (\n    <div>\n      ${fileName.replace('.jsx', '')} Component\n    </div>\n  );\n}\n\nexport default ${fileName.replace('.jsx', '')};`;
          } else if (fileName.endsWith('.js')) {
            simulatedContent = `// ${fileName}\n\nconst ${fileName.replace('.js', '')} = {\n  init() {\n    console.log('${fileName.replace('.js', '')} initialized');\n  }\n};\n\nexport default ${fileName.replace('.js', '')};`;
          } else if (fileName.endsWith('.json')) {
            simulatedContent = `{\n  "name": "${fileName.replace('.json', '')}",\n  "version": "1.0.0"\n}`;
          } else if (fileName.endsWith('.html')) {
            simulatedContent = `<!DOCTYPE html>\n<html>\n<head>\n  <title>${fileName.replace('.html', '')}</title>\n</head>\n<body>\n  <h1>${fileName.replace('.html', '')}</h1>\n</body>\n</html>`;
          } else if (fileName.endsWith('.css')) {
            simulatedContent = `/* ${fileName} */\n\nbody {\n  margin: 0;\n  padding: 0;\n  font-family: sans-serif;\n}`;
          } else {
            simulatedContent = `// Content of ${fileName}`;
          }

          setContent(simulatedContent);
          setLoading(false);
        } catch (err) {
          setError('Failed to load file content');
          setLoading(false);
        }
      }, 300); // Simulate network delay
    };

    if (file) {
      getFileContent();
    }
  }, [file]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
    // In a real application, you would implement auto-save or a save button
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