import React, { useState } from 'react';
import './Explorer.css';

function Explorer({ fileStructure, onFileSelect, activeFile }) {
  const [expandedFolders, setExpandedFolders] = useState({
    'project-name': true,
    'project-name/src': true
  });

  const toggleFolder = (path) => {
    setExpandedFolders({
      ...expandedFolders,
      [path]: !expandedFolders[path]
    });
  };

  const renderTree = (structure, basePath = '') => {
    return Object.entries(structure).map(([name, item]) => {
      const path = basePath ? `${basePath}/${name}` : name;

      if (item.type === 'directory') {
        const isExpanded = expandedFolders[path] || false;

        return (
          <div key={path} className="tree-item">
            <div
              className={`folder ${isExpanded ? 'expanded' : ''}`}
              onClick={() => toggleFolder(path)}
            >
              <span className="folder-icon">
                {isExpanded ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H2v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3h.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H14a.5.5 0 0 0-.354.146l-.853.854A.5.5 0 0 1 12.5 3H3.5a.5.5 0 0 1-.354-.146L2.293 2A.5.5 0 0 0 2 1.5H1.5z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 1-.4-.2l-1.3-1.6A.5.5 0 0 0 7.5 1H2a.5.5 0 0 0-.5.5V3z"/>
                  </svg>
                )}
              </span>
              <span className="item-name">{name}</span>
            </div>

            {isExpanded && (
              <div className="tree-children">
                {renderTree(item.children, path)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div
            key={path}
            className={`tree-item file ${activeFile === path ? 'active' : ''}`}
            onClick={() => onFileSelect(path)}
          >
            <span className="file-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
              </svg>
            </span>
            <span className="item-name">{name}</span>
          </div>
        );
      }
    });
  };

  return (
    <div className="explorer">
      <div className="panel-header">
        <h3>
          EXPLORER
          <div className="header-actions">
            <button className="icon-btn" title="New File">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z"/>
                <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
              </svg>
            </button>
            <button className="icon-btn" title="New Folder">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 1-.4-.2l-1.3-1.6A.5.5 0 0 0 7.5 1H2a.5.5 0 0 0-.5.5V3zm5-2A1.5 1.5 0 0 1 6.9 1.5l1.3 1.6A.5.5 0 0 0 8.5 3H14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h4.5z"/>
                <path d="M7.5 6.5a.5.5 0 0 0-1 0V8H5a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V9H9a.5.5 0 0 0 0-1H7.5V6.5z"/>
              </svg>
            </button>
            <button className="icon-btn" title="Refresh">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
              </svg>
            </button>
          </div>
        </h3>
      </div>
      <div className="tree-view">
        {renderTree(fileStructure)}
      </div>
    </div>
  );
}

export default Explorer;