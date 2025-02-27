import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import Header from './components/Header'
import Terminal from './components/Terminal'
import StatusBar from './components/StatusBar'

function App() {
  const [activeFile, setActiveFile] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [terminalVisible, setTerminalVisible] = useState(true)
  const [terminalHeight, setTerminalHeight] = useState(200)
  const [theme, setTheme] = useState('dark')

  // Sample file structure for the explorer
  const [fileStructure, setFileStructure] = useState({
    'project-name': {
      type: 'directory',
      children: {
        'src': {
          type: 'directory',
          children: {
            'components': {
              type: 'directory',
              children: {
                'Header.jsx': { type: 'file', content: '// Header component code' },
                'Sidebar.jsx': { type: 'file', content: '// Sidebar component code' },
                'Editor.jsx': { type: 'file', content: '// Editor component code' },
                'MenuBar.jsx': { type: 'file', content: '// MenuBar component code' },
              }
            },
            'App.jsx': { type: 'file', content: '// App component code' },
            'main.jsx': { type: 'file', content: '// Main entry point' },
          }
        },
        'public': {
          type: 'directory',
          children: {
            'index.html': { type: 'file', content: '<!DOCTYPE html>...' },
          }
        },
        'package.json': { type: 'file', content: '{ "name": "project" }' },
      }
    }
  })

  const handleFileSelect = (filePath) => {
    setActiveFile(filePath)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleTerminal = () => {
    setTerminalVisible(!terminalVisible)
  }

  const handleTerminalResize = (height) => {
    setTerminalHeight(height)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className={`ide-container ${theme}`}>
      <Header
        toggleSidebar={toggleSidebar}
        toggleTerminal={toggleTerminal}
        toggleTheme={toggleTheme}
        theme={theme}
        activeFile={activeFile}
      />
      <div className="ide-main">
        <Sidebar
          collapsed={sidebarCollapsed}
          fileStructure={fileStructure}
          onFileSelect={handleFileSelect}
          activeFile={activeFile}
        />
        <div className="ide-content">
          <div className="editor-container" style={{
            height: terminalVisible ? `calc(100% - ${terminalHeight}px)` : '100%'
          }}>
            {activeFile ? (
              <Editor file={activeFile} />
            ) : (
              <div className="welcome-screen">
                <h2>Welcome to Cloud IDE</h2>
                <p>Select a file to get started or create a new file.</p>
              </div>
            )}
          </div>
          {terminalVisible && (
            <Terminal
              height={terminalHeight}
              onResize={handleTerminalResize}
            />
          )}
        </div>
      </div>
      <StatusBar />
    </div>
  )
}

export default App