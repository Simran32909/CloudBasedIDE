import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { fileService } from '../services/api';
import './Explorer.css';

function Explorer({ files, onFileSelect, activeFile, onRefresh }) {
  const [error, setError] = useState(null);

  const handleCreateFile = async () => {
    const fileName = prompt('Enter file name:');
    if (!fileName) return;

    try {
      await fileService.createFile('', fileName);
      onRefresh(); // Refresh file list after creating file
    } catch (err) {
      setError(err.message);
      console.error('Failed to create file:', err);
    }
  };

  const handleCreateDirectory = async () => {
    const dirName = prompt('Enter folder name:');
    if (!dirName) return;

    try {
      await fileService.createDirectory('', dirName);
      onRefresh(); // Refresh file list after creating directory
    } catch (err) {
      setError(err.message);
      console.error('Failed to create directory:', err);
    }
  };

  const renderTree = (items) => {
    return items.map(item => {
      if (item.type === 'directory') {
        return (
          <DirectoryItem
            key={item.path}
            name={item.name}
            path={item.path}
            onFileSelect={onFileSelect}
            onCreateFile={handleCreateFile}
            onCreateDirectory={handleCreateDirectory}
            activeFile={activeFile}
            onRefresh={onRefresh}
          />
        );
      } else {
        return (
          <FileItem
            key={item.path}
            name={item.name}
            path={item.path}
            onFileSelect={onFileSelect}
            isActive={activeFile === item.path}
          />
        );
      }
    });
  };

  if (error) {
    return <div className="explorer-error">{error}</div>;
  }

  return (
    <div className="explorer">
      <div className="explorer-header">
        <span>EXPLORER</span>
        <div className="header-actions">
          <button
            className="icon-btn"
            onClick={handleCreateFile}
            title="New File"
          >
            📄
          </button>
          <button
            className="icon-btn"
            onClick={handleCreateDirectory}
            title="New Folder"
          >
            📁
          </button>
        </div>
      </div>
      <div className="tree-view">
        {renderTree(files || [])}
      </div>
    </div>
  );
}

Explorer.propTypes = {
  files: PropTypes.array,
  onFileSelect: PropTypes.func.isRequired,
  activeFile: PropTypes.string,
  onRefresh: PropTypes.func.isRequired
};

function DirectoryItem({ name, path, onFileSelect, onCreateFile, onCreateDirectory, activeFile, onRefresh }) {
  const [expanded, setExpanded] = useState(true);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDirectoryContents = async () => {
    try {
      setLoading(true);
      const contents = await fileService.listFiles(path);
      setItems(contents);
    } catch (err) {
      console.error('Failed to load directory contents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFile = async () => {
    const fileName = prompt('Enter file name:');
    if (!fileName) return;

    try {
      await fileService.createFile(path, fileName);
      onRefresh();
      loadDirectoryContents();
    } catch (err) {
      console.error('Failed to create file:', err);
    }
  };

  const handleCreateDirectory = async () => {
    const dirName = prompt('Enter folder name:');
    if (!dirName) return;

    try {
      await fileService.createDirectory(path, dirName);
      onRefresh();
      loadDirectoryContents();
    } catch (err) {
      console.error('Failed to create directory:', err);
    }
  };

  return (
    <div className="directory-item">
      <div className="directory-header">
        <div 
          className="directory-name" 
          onClick={() => setExpanded(!expanded)}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <span>{expanded ? '▼' : '►'}</span>
          <span>{expanded ? '📂' : '📁'}</span>
          <span>{name}</span>
        </div>
        <div className="directory-actions">
          <button
            className="icon-btn small"
            onClick={handleCreateFile}
            title="New File"
          >
            📄
          </button>
          <button
            className="icon-btn small"
            onClick={handleCreateDirectory}
            title="New Folder"
          >
            📁
          </button>
        </div>
      </div>
      {expanded && !loading && items.length > 0 && (
        <div className="directory-children">
          {items.map(item => (
            item.type === 'directory' ? (
              <DirectoryItem
                key={item.path}
                name={item.name}
                path={item.path}
                onFileSelect={onFileSelect}
                onCreateFile={onCreateFile}
                onCreateDirectory={onCreateDirectory}
                activeFile={activeFile}
                onRefresh={onRefresh}
              />
            ) : (
              <FileItem
                key={item.path}
                name={item.name}
                path={item.path}
                onFileSelect={onFileSelect}
                isActive={activeFile === item.path}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
}

DirectoryItem.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  onFileSelect: PropTypes.func.isRequired,
  onCreateFile: PropTypes.func.isRequired,
  onCreateDirectory: PropTypes.func.isRequired,
  activeFile: PropTypes.string,
  onRefresh: PropTypes.func.isRequired
};

function FileItem({ name, path, onFileSelect, isActive }) {
  const handleClick = () => {
    onFileSelect(path);
  };

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

  return (
    <div
      className={`file-item ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <span className="file-icon">{getFileIcon(name)}</span>
      <span className="file-name">{name}</span>
    </div>
  );
}

FileItem.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  onFileSelect: PropTypes.func.isRequired,
  isActive: PropTypes.bool
};

export default Explorer;