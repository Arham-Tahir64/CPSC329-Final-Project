import React from 'react';

function CaesarCipher() {
  return (
    <div className="cipher-container">
      <h2>Caesar Cipher Translator</h2>

      <div className="form-group">
        <label htmlFor="caesar-text">Text:</label>
        <textarea
          id="caesar-text"
          rows="4"
          placeholder="Enter text to encrypt or decrypt"
        />
      </div>

      <div className="form-group">
        <label htmlFor="caesar-shift">Shift Value (1-25):</label>
        <input
          id="caesar-shift"
          type="number"
          min="1"
          max="25"
          defaultValue="3"
        />
      </div>

      <div className="button-group">
        <button>Encrypt</button>
        <button>Decrypt</button>
      </div>

      <div className="result-box">
        <h3>Result:</h3>
        <pre>
          {/* Result will be displayed here */}
          Result appears here...
        </pre>
      </div>

      {/* Educational text */}
    </div>
  );
}

export default CaesarCipher;