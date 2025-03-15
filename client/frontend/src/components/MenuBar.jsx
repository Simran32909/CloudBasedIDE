import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fileService, gitService } from '../services/api';

function MenuBar({ activeFile, onRefresh }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [status, setStatus] = useState('');
  const menuRef = useRef(null);

  // Menu definitions with their dropdown items
  const menus = {
    file: {
      label: 'File',
      items: [
        { 
          label: 'New File', 
          shortcut: 'Ctrl+N', 
          action: async () => {
            try {
              const fileName = prompt('Enter file name:');
              if (!fileName) return;
              
              await fileService.createFile('', fileName);
              setStatus('File created successfully');
              if (onRefresh) onRefresh();
            } catch (err) {
              setStatus(`Error: ${err.message}`);
              console.error('Failed to create file:', err);
            }
          }
        },
        { 
          label: 'New Folder', 
          shortcut: 'Ctrl+Shift+N', 
          action: async () => {
            try {
              const folderName = prompt('Enter folder name:');
              if (!folderName) return;

              await fileService.createDirectory('', folderName);
              setStatus('Folder created successfully');
              if (onRefresh) onRefresh();
            } catch (err) {
              setStatus(`Error: ${err.message}`);
              console.error('Failed to create folder:', err);
            }
          }
        },
        { 
          label: 'Save', 
          shortcut: 'Ctrl+S', 
          action: async () => {
            if (activeFile) {
              try {
                const editor = document.querySelector('.editor-textarea');
                if (editor) {
                  await fileService.updateFile(activeFile, editor.value);
                  setStatus('File saved successfully');
                }
              } catch (err) {
                setStatus(`Error: ${err.message}`);
                console.error('Failed to save file:', err);
              }
            } else {
              setStatus('No file selected');
            }
          }
        },
        { type: 'separator' },
        { 
          label: 'Delete File', 
          shortcut: 'Delete',
          action: async () => {
            if (activeFile) {
              try {
                if (window.confirm('Are you sure you want to delete this file?')) {
                  await fileService.deleteFile(activeFile);
                  setStatus('File deleted successfully');
                  if (onRefresh) onRefresh();
                }
              } catch (err) {
                setStatus(`Error: ${err.message}`);
                console.error('Failed to delete file:', err);
              }
            } else {
              setStatus('No file selected');
            }
          }
        },
        { type: 'separator' },
        { label: 'Exit', action: () => window.close() }
      ]
    },
    edit: {
      label: 'Edit',
      items: [
        { 
          label: 'Undo', 
          shortcut: 'Ctrl+Z', 
          action: () => {
            const editor = document.querySelector('.editor-textarea');
            if (editor) editor.focus();
            document.execCommand('undo');
          }
        },
        { 
          label: 'Redo', 
          shortcut: 'Ctrl+Y', 
          action: () => {
            const editor = document.querySelector('.editor-textarea');
            if (editor) editor.focus();
            document.execCommand('redo');
          }
        },
        { type: 'separator' },
        { 
          label: 'Cut', 
          shortcut: 'Ctrl+X', 
          action: () => {
            const editor = document.querySelector('.editor-textarea');
            if (editor) editor.focus();
            document.execCommand('cut');
          }
        },
        { 
          label: 'Copy', 
          shortcut: 'Ctrl+X', 
          action: () => {
            const editor = document.querySelector('.editor-textarea');
            if (editor) editor.focus();
            document.execCommand('copy');
          }
        },
        { 
          label: 'Paste', 
          shortcut: 'Ctrl+V', 
          action: () => {
            const editor = document.querySelector('.editor-textarea');
            if (editor) editor.focus();
            document.execCommand('paste');
          }
        }
      ]
    },
    view: {
      label: 'View',
      items: [
        { label: 'Command Palette', shortcut: 'Ctrl+Shift+P' },
        { type: 'separator' },
        { label: 'Explorer', shortcut: 'Ctrl+Shift+E' },
        { label: 'Search', shortcut: 'Ctrl+Shift+F' },
        { label: 'Source Control', shortcut: 'Ctrl+Shift+G' },
        { type: 'separator' },
        { label: 'Toggle Terminal', shortcut: 'Ctrl+`' }
      ]
    },
    git: {
      label: 'Git',
      items: [
        { 
          label: 'Initialize Repository', 
          action: async () => {
            try {
              await gitService.init('');
            } catch (err) {
              console.error('Failed to initialize repository:', err);
            }
          }
        },
        { 
          label: 'View Status', 
          action: async () => {
            try {
              const status = await gitService.status('');
              console.log('Git status:', status);
            } catch (err) {
              console.error('Failed to get status:', err);
            }
          }
        },
        { type: 'separator' },
        { 
          label: 'Stage All Changes', 
          action: async () => {
            try {
              await gitService.add('', ['.']);
            } catch (err) {
              console.error('Failed to stage changes:', err);
            }
          }
        },
        { 
          label: 'Commit Changes', 
          action: async () => {
            try {
              const message = prompt('Enter commit message:');
              if (message) {
                await gitService.commit('', message);
              }
            } catch (err) {
              console.error('Failed to commit changes:', err);
            }
          }
        }
      ]
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Clear status message after 3 seconds
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Toggle menu dropdown
  const handleMenuClick = (menuKey) => {
    setActiveMenu(activeMenu === menuKey ? null : menuKey);
  };

  // Handle menu item action
  const handleMenuItemClick = async (item) => {
    if (item.action) {
      await item.action();
    }
    setActiveMenu(null);
  };

  return (
    <div className="menu-bar-container">
      <div
        className="menu-bar"
        ref={menuRef}
        style={{
          display: 'flex',
          height: '28px',
          backgroundColor: 'var(--tertiary-bg)',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        {Object.entries(menus).map(([key, menu]) => (
          <div
            key={key}
            className="menu-container"
            style={{ position: 'relative' }}
          >
            <button
              className={`menu-button ${activeMenu === key ? 'active' : ''}`}
              onClick={() => handleMenuClick(key)}
              style={{
                background: activeMenu === key ? 'var(--active-bg)' : 'transparent',
                border: 'none',
                color: 'var(--text-color)',
                padding: '0 10px',
                height: '100%',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {menu.label}
            </button>

            {activeMenu === key && (
              <div
                className="menu-dropdown"
                style={{
                  position: 'absolute',
                  top: '28px',
                  left: '0',
                  minWidth: '200px',
                  backgroundColor: 'var(--secondary-bg)',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  zIndex: 1000
                }}
              >
                {menu.items.map((item, index) => (
                  item.type === 'separator' ? (
                    <div
                      key={`separator-${index}`}
                      style={{
                        height: '1px',
                        backgroundColor: 'var(--border-color)',
                        margin: '4px 0'
                      }}
                    />
                  ) : (
                    <div
                      key={item.label}
                      className="menu-item"
                      onClick={() => handleMenuItemClick(item)}
                      style={{
                        padding: '6px 12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover-bg)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span style={{ marginLeft: '20px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                          {item.shortcut}
                        </span>
                      )}
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {status && (
        <div className="status-message" style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '8px 16px',
          backgroundColor: status.startsWith('Error') ? 'var(--error-color)' : 'var(--success-color)',
          color: 'white',
          borderRadius: '4px',
          zIndex: 1000
        }}>
          {status}
        </div>
      )}
    </div>
  );
}

MenuBar.propTypes = {
  activeFile: PropTypes.string,
  onRefresh: PropTypes.func
};

export default MenuBar;