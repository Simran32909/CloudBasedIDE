import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import Header from './components/Header'
import Terminal from './components/Terminal'
import StatusBar from './components/StatusBar'
import Explorer from './components/Explorer'

function App() {
  const [activeFile, setActiveFile] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [terminalVisible, setTerminalVisible] = useState(true)
  const [terminalHeight, setTerminalHeight] = useState(200)
  const [theme, setTheme] = useState('dark')
  const [fileStructure, setFileStructure] = useState([
  {
    name: 'project-name',
    type: 'directory',
    children: [
      {
        name: 'src',
        type: 'directory',
        children: [
          {
            name: 'components',
            type: 'directory',
            children: [
              { name: 'Header.jsx', type: 'file', path: 'project-name/src/components/Header.jsx' },
              { name: 'Sidebar.jsx', type: 'file', path: 'project-name/src/components/Sidebar.jsx' },
              { name: 'Editor.jsx', type: 'file', path: 'project-name/src/components/Editor.jsx' },
            ]
          },
          { name: 'App.jsx', type: 'file', path: 'project-name/src/App.jsx' },
          { name: 'main.jsx', type: 'file', path: 'project-name/src/main.jsx' }
        ]
      },
      {
        name: 'public',
        type: 'directory',
        children: [
          { name: 'index.html', type: 'file', path: 'project-name/public/index.html' }
        ]
      },
      { name: 'package.json', type: 'file', path: 'project-name/package.json' }
    ]
  }
]);

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