import React from 'react';
import MenuBar from './MenuBar';

function Header({ toggleSidebar, toggleTerminal, toggleTheme, theme, activeFile }) {
  return (
    <div className="header-container" style={{ borderBottom: '1px solid var(--border-color)' }}>
      <div
        className="ide-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '36px',
          backgroundColor: 'var(--tertiary-bg)',
          padding: '0 8px'
        }}
      >
        <div className="header-left flex align-center">
          <button
            className="icon-btn"
            onClick={toggleSidebar}
            title="Toggle sidebar"
          >
            ☰
          </button>
          <span className="app-title" style={{ marginLeft: '8px', fontWeight: 'bold' }}>
            Cloud IDE
          </span>
        </div>

        <div className="header-center">
          {activeFile && (
            <div className="active-file text-sm">
              {activeFile}
            </div>
          )}
        </div>

        <div className="header-right flex align-center">
          <button
            className="icon-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            style={{ marginRight: '8px' }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            className="icon-btn"
            onClick={toggleTerminal}
            title="Toggle terminal"
          >
            🖥️
          </button>
        </div>
      </div>

      {/* Add the MenuBar component */}
      <MenuBar />
    </div>
  );
}

export default Header;