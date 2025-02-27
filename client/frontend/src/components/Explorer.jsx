import React, { useState } from 'react';

function Explorer({ fileStructure, onFileSelect, activeFile }) {
  const renderTree = (node, path = '', level = 0) => {
    const entries = Object.entries(node);

    return entries.map(([key, value]) => {
      const currentPath = path ? `${path}/${key}` : key;
      const isDirectory = value.type === 'directory';

      if (isDirectory) {
        return (
          <DirectoryItem
            key={currentPath}
            name={key}
            path={currentPath}
            children={value.children}
            level={level}
            onFileSelect={onFileSelect}
            activeFile={activeFile}
          />
        );
      } else {
        return (
          <FileItem
            key={currentPath}
            name={key}
            path={currentPath}
            level={level}
            onFileSelect={onFileSelect}
            isActive={activeFile === currentPath}
          />
        );
      }
    });
  };

  return (
    <div
      className="explorer"
      style={{
        overflow: 'auto',
        height: '100%'
      }}
    >
      <div className="explorer-header" style={{ padding: '8px', fontWeight: 'bold' }}>
        EXPLORER
      </div>
      <div className="file-tree">
        {renderTree(fileStructure)}
      </div>
    </div>
  );
}

function DirectoryItem({ name, path, children, level, onFileSelect, activeFile }) {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const paddingLeft = level * 16 + 8;

  return (
    <div className="directory-item">
      <div
        className="directory-header"
        onClick={toggleExpanded}
        style={{
          paddingLeft: `${paddingLeft}px`,
          paddingRight: '8px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          backgroundColor: 'var(--secondary-bg)',
          userSelect: 'none'
        }}
      >
        <span style={{ marginRight: '4px' }}>
          {expanded ? '▼' : '►'}
        </span>
        <span style={{ marginRight: '4px' }}>
          {expanded ? '📂' : '📁'}
        </span>
        <span>{name}</span>
      </div>

      {expanded && (
        <div className="directory-children">
          {Object.entries(children).map(([childName, childValue]) => {
            const childPath = `${path}/${childName}`;
            if (childValue.type === 'directory') {
              return (
                <DirectoryItem
                  key={childPath}
                  name={childName}
                  path={childPath}
                  children={childValue.children}
                  level={level + 1}
                  onFileSelect={onFileSelect}
                  activeFile={activeFile}
                />
              );
            } else {
              return (
                <FileItem
                  key={childPath}
                  name={childName}
                  path={childPath}
                  level={level + 1}
                  onFileSelect={onFileSelect}
                  isActive={activeFile === childPath}
                />
              );
            }
          })}
        </div>
      )}
    </div>
  );
}

function FileItem({ name, path, level, onFileSelect, isActive }) {
  const handleClick = () => {
    onFileSelect(path);
  };

  // Get file icon based on extension
  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.jsx') || fileName.endsWith('.js')) {
      return '📄';
    } else if (fileName.endsWith('.json')) {
      return '📋';
    } else if (fileName.endsWith('.html')) {
      return '🌐';
    } else if (fileName.endsWith('.css')) {
      return '🎨';
    } else {
      return '📝';
    }
  };

  const paddingLeft = level * 16 + 8;

  return (
    <div
      className={`file-item ${isActive ? 'active' : ''}`}
      onClick={handleClick}
      style={{
        paddingLeft: `${paddingLeft}px`,
        paddingRight: '8px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: isActive ? 'var(--selection-bg)' : 'transparent',
        userSelect: 'none'
      }}
    >
      <span style={{ marginRight: '4px', marginLeft: '12px' }}>
        {getFileIcon(name)}
      </span>
      <span>{name}</span>
    </div>
  );
}

export default Explorer;