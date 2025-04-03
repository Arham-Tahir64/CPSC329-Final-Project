import React from 'react';

function App() {
  return (
    <div className="App">
      <h1>React Cryptography Toolkit</h1>

      {/* Tabs will be here */}
      <div className="tabs">
        <button>Caesar Cipher</button>
        <button>Frequency Analysis</button>
        <button>Established Ciphers</button>
      </div>

      <div className="tab-content">
        <p>Welcome! Select a tool from the tabs above.</p>
        {/* Content here */}
      </div>
    </div>
  );
}

export default App;