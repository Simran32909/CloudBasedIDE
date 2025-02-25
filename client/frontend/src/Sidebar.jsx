import { useState } from 'react'
import './Sidebar.css'
import Explorer from './Explorer'

function Sidebar({ collapsed, fileStructure, onFileSelect, activeFile }) {
  const [activeTab, setActiveTab] = useState('explorer')

  const tabs = [
    { id: 'explorer', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M.54 3.87L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z"/>
      </svg>
    ) },
    { id: 'search', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
      </svg>
    ) },
    { id: 'git', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M15.698 7.287 8.712.302a1.03 1.03 0 0 0-1.457 0l-1.45 1.45 1.84 1.84a1.223 1.223 0 0 1 1.55 1.56l1.773 1.774a1.224 1.224 0 0 1 1.267 2.025 1.226 1.226 0 0 1-2.002-1.334L8.58 5.963v4.353a1.226 1.226 0 1 1-1.008-.036V5.887a1.226 1.226 0 0 1-.666-1.608L5.093 2.465l-4.79 4.79a1.03 1.03 0 0 0 0 1.457l6.986 6.986a1.03 1.03 0 0 0 1.457 0l6.953-6.953a1.031 1.031 0 0 0 0-1.457"/>
      </svg>
    ) },
    { id: 'debug', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
        <path d="M5.5.5A.5.5 0 0 1 6 0h4a.5.5 0 0 1 0 1H9v1.07a7.002 7.002 0 0 1 3.537 12.26l.817.816a.5.5 0 0 1-.708.708l-.924-.925A6.967 6.967 0 0 1 8 16a6.967 6.967 0 0 1-3.722-1.07l-.924.924a.5.5 0 0 1-.708-.708l.817-.816A7.002 7.002 0 0 1 7 2.07V1H6a.5.5 0 0 1-.5-.5zM8 3a6 6 0 1 0 0 12A6 6 0 0 0 8 3z"/>
      </svg>
    ) },
    { id: 'extensions', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M2 2a2 2 0 0 0-2 2v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zm0 7.5v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1zm6.5-1.5a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1zm-6.5-4A1.5 1.5 0 0 1 3.5 3h1A1.5 1.5 0 0 1 6 4.5v1A1.5 1.5 0 0 1 4.5 7h-1A1.5 1.5 0 0 1 2 5.5v-1zM8.5 3A1.5 1.5 0 0 1 10 4.5v1A1.5 1.5 0 0 1 8.5 7h-1A1.5 1.5 0 0 1 6 5.5v-1A1.5 1.5 0 0 1 7.5 3h1zM8 9.5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 8 10.5v-1z"/>
      </svg>
    ) }
  ]

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}
          >
            {tab.icon}
          </button>
        ))}
      </div>
      <div className="sidebar-content">
        {activeTab === 'explorer' && (
          <Explorer
            fileStructure={fileStructure}
            onFileSelect={onFileSelect}
            activeFile={activeFile}
          />
        )}
        {activeTab === 'search' && (
          <div className="sidebar-panel">
            <div className="panel-header">
              <h3>Search</h3>
              <div className="search-input-container">
                <input type="text" placeholder="Search in files" className="search-input" />
              </div>
              <div className="search-options">
                <button className="icon-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15 3.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1 0-1h13a.5.5 0 0 1 .5.5zM15 7a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1 0-1h13a.5.5 0 0 1 .5.5zM15 10.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1 0-1h13a.5.5 0 0 1 .5.5z"/>
                  </svg>
                </button>
                <button className="icon-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="search-results">
              <div className="empty-state">
                <p>Type to search in project files</p>
              </div>
            </div>
          </div>
        )}
        {(activeTab === 'git' || activeTab === 'debug' || activeTab === 'extensions') && (
          <div className="sidebar-panel">
            <div className="panel-header">
              <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
            </div>
            <div className="empty-state">
              <p>This panel is not implemented in the demo</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar