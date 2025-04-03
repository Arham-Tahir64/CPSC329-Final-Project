import React, { useState } from 'react';
import CaesarCipher from './components/CaesarCipher';
import FrequencyAnalysis from './components/FrequencyAnalysis'; // Import the new component

function App() {
  const [activeTab, setActiveTab] = useState('caesar');

  const renderContent = () => {
    switch (activeTab) {
      case 'caesar':
        return <CaesarCipher />;
      case 'frequency':
        return <FrequencyAnalysis />;
      case 'established':
        return <div>Established Ciphers Content Placeholder</div>;
      default:
        return <p>Select a tool.</p>;
    }
  };

  return (
    <div className="App">
      <h1>React Cryptography Toolkit</h1>

      <div className="tabs">
        <button
          className={activeTab === 'caesar' ? 'active' : ''}
          onClick={() => setActiveTab('caesar')}
        >
          Caesar Cipher
        </button>
        <button
          className={activeTab === 'frequency' ? 'active' : ''}
          onClick={() => setActiveTab('frequency')}
        >
          Frequency Analysis
        </button>
        <button
          className={activeTab === 'established' ? 'active' : ''}
          onClick={() => setActiveTab('established')}
        >
          Established Ciphers
        </button>
      </div>

      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;