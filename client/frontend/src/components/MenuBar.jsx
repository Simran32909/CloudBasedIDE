import React, { useState, useRef, useEffect } from 'react';

function MenuBar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  // Menu definitions with their dropdown items
  const menus = {
    file: {
      label: 'File',
      items: [
        { label: 'New File', shortcut: 'Ctrl+N', action: () => alert('New File') },
        { label: 'New Folder', shortcut: 'Ctrl+Shift+N', action: () => alert('New Folder') },
        { label: 'Open...', shortcut: 'Ctrl+O', action: () => alert('Open File') },
        { label: 'Save', shortcut: 'Ctrl+S', action: () => alert('Save') },
        { label: 'Save As...', shortcut: 'Ctrl+Shift+S', action: () => alert('Save As') },
        { type: 'separator' },
        { label: 'Exit', action: () => alert('Exit') }
      ]
    },
    edit: {
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: 'Ctrl+Z', action: () => alert('Undo') },
        { label: 'Redo', shortcut: 'Ctrl+Y', action: () => alert('Redo') },
        { type: 'separator' },
        { label: 'Cut', shortcut: 'Ctrl+X', action: () => alert('Cut') },
        { label: 'Copy', shortcut: 'Ctrl+C', action: () => alert('Copy') },
        { label: 'Paste', shortcut: 'Ctrl+V', action: () => alert('Paste') },
        { type: 'separator' },
        { label: 'Find', shortcut: 'Ctrl+F', action: () => alert('Find') },
        { label: 'Replace', shortcut: 'Ctrl+H', action: () => alert('Replace') }
      ]
    },
    view: {
      label: 'View',
      items: [
        { label: 'Explorer', shortcut: 'Ctrl+Shift+E', action: () => alert('Explorer') },
        { label: 'Search', shortcut: 'Ctrl+Shift+F', action: () => alert('Search') },
        { label: 'Terminal', shortcut: 'Ctrl+`', action: () => alert('Terminal') },
        { type: 'separator' },
        { label: 'Zoom In', shortcut: 'Ctrl+Plus', action: () => alert('Zoom In') },
        { label: 'Zoom Out', shortcut: 'Ctrl+Minus', action: () => alert('Zoom Out') },
        { label: 'Reset Zoom', shortcut: 'Ctrl+0', action: () => alert('Reset Zoom') }
      ]
    },
    run: {
      label: 'Run',
      items: [
        { label: 'Start Debugging', shortcut: 'F5', action: () => alert('Start Debugging') },
        { label: 'Run Without Debugging', shortcut: 'Ctrl+F5', action: () => alert('Run Without Debugging') },
        { label: 'Stop', shortcut: 'Shift+F5', action: () => alert('Stop') },
        { type: 'separator' },
        { label: 'Add Configuration', action: () => alert('Add Configuration') }
      ]
    },
    tools: {
      label: 'Tools',
      items: [
        { label: 'Extensions', action: () => alert('Extensions') },
        { label: 'Settings', shortcut: 'Ctrl+,', action: () => alert('Settings') },
        { type: 'separator' },
        { label: 'Command Palette', shortcut: 'Ctrl+Shift+P', action: () => alert('Command Palette') }
      ]
    },
    help: {
      label: 'Help',
      items: [
        { label: 'Welcome', action: () => alert('Welcome') },
        { label: 'Documentation', action: () => alert('Documentation') },
        { label: 'Keyboard Shortcuts', action: () => alert('Keyboard Shortcuts') },
        { type: 'separator' },
        { label: 'Check for Updates', action: () => alert('Check for Updates') },
        { label: 'About', action: () => alert('About Cloud IDE') }
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

  // Toggle menu dropdown
  const handleMenuClick = (menuKey) => {
    setActiveMenu(activeMenu === menuKey ? null : menuKey);
  };

  // Handle menu item action
  const handleMenuItemClick = (item) => {
    if (item.action) {
      item.action();
    }
    setActiveMenu(null);
  };

  return (
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
  );
}

export default MenuBar;