import { useState, useEffect } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import Header from './components/Header'
import Terminal from './components/Terminal'
import StatusBar from './components/StatusBar'
import MenuBar from './components/MenuBar'
import Auth from './components/Auth'
import { fileService } from './services/api'
import { authService } from './services/auth'

function App() {
  const [activeFile, setActiveFile] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [terminalVisible, setTerminalVisible] = useState(true)
  const [terminalHeight, setTerminalHeight] = useState(200)
  const [theme, setTheme] = useState('dark')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadFiles()
    }
  }, [isAuthenticated])

  const checkAuth = () => {
    const isAuth = authService.isAuthenticated()
    setIsAuthenticated(isAuth)
    return isAuth
  }

  const loadFiles = async () => {
    try {
      setLoading(true)
      const response = await fileService.listFiles()
      setFiles(response.files || [])
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Failed to load files:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
  }

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
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.className = newTheme
  }

  // If not authenticated, show auth screen
  if (!isAuthenticated) {
    return (
      <div className={`app ${theme}`}>
        <Auth onAuthSuccess={handleAuthSuccess} />
      </div>
    )
  }

  return (
    <div className={`app ${theme}`}>
      <div className="ide-container">
        <Header
          toggleSidebar={toggleSidebar}
          toggleTerminal={toggleTerminal}
          toggleTheme={toggleTheme}
          theme={theme}
          activeFile={activeFile}
        />
        <MenuBar
          activeFile={activeFile}
          onRefresh={loadFiles}
        />
        <div className="ide-main">
          <Sidebar
            collapsed={sidebarCollapsed}
            files={files}
            onFileSelect={handleFileSelect}
            activeFile={activeFile}
          />
          <div className="ide-content">
            {activeFile ? (
              <Editor file={activeFile} />
            ) : (
              <div className="welcome-screen">
                <h2>Welcome to Cloud IDE</h2>
                <p>Select a file to start editing</p>
              </div>
            )}
          </div>
        </div>
        {terminalVisible && (
          <Terminal
            height={terminalHeight}
            onResize={handleTerminalResize}
          />
        )}
        <StatusBar />
      </div>
    </div>
  )
}

export default App