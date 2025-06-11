import React from 'react';
import './App.css';
import RegGuideMainContainer from './RegGuideMainContainer';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
          </div>
        </div>
      </nav>
      <main>
        <RegGuideMainContainer />
      </main>
    </div>
  );
}

export default App;