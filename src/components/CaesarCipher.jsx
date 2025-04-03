import React, { useState } from 'react';

function CaesarCipher() {
  const [inputText, setInputText] = useState('');
  const [shift, setShift] = useState(3);
  const [outputText, setOutputText] = useState('');

  const handleShiftChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 25) {
      setShift(value);
    } else if (isNaN(value)) {
         setShift('');
         setShift(1);
    }
  };


  // Core Caesar Cipher Logic
  const processCaesar = (text, shiftAmount, encrypt = true) => {
    return text.split('').map(char => {
      const charCode = char.charCodeAt(0);

      // Handle uppercase letters
      if (charCode >= 65 && charCode <= 90) {
        let shiftedCode = charCode + (encrypt ? shiftAmount : -shiftAmount);
        if (shiftedCode > 90) {
          shiftedCode = 65 + (shiftedCode - 91);
        } else if (shiftedCode < 65) {
          shiftedCode = 91 - (65 - shiftedCode);
        }
        return String.fromCharCode(shiftedCode);
      }
      // Handle lowercase letters
      else if (charCode >= 97 && charCode <= 122) {
        let shiftedCode = charCode + (encrypt ? shiftAmount : -shiftAmount);
         if (shiftedCode > 122) {
           shiftedCode = 97 + (shiftedCode - 123);
        } else if (shiftedCode < 97) {
           shiftedCode = 123 - (97 - shiftedCode);
        }
        return String.fromCharCode(shiftedCode);
      }
      // Keep non-alphabetic characters unchanged
      else {
        return char;
      }
    }).join('');
  };

  const handleEncrypt = () => {
    const clampedShift = Math.max(1, Math.min(25, shift || 1)); // Ensure shift is 1-25
    const result = processCaesar(inputText, clampedShift, true);
    setOutputText(result);
  };

  const handleDecrypt = () => {
    const clampedShift = Math.max(1, Math.min(25, shift || 1)); // Ensure shift is 1-25
    const result = processCaesar(inputText, clampedShift, false);
    setOutputText(result);
  };

  return (
    <div className="cipher-container">
      <h2>Caesar Cipher Translator</h2>

      <div className="form-group">
        <label htmlFor="caesar-text">Text:</label>
        <textarea
          id="caesar-text"
          rows="4"
          placeholder="Enter text to encrypt or decrypt"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="caesar-shift">Shift Value (1-25):</label>
        <input
          id="caesar-shift"
          type="number"
          min="1"
          max="25"
          value={shift} // Controlled component
          onChange={handleShiftChange}
        />
      </div>

      <div className="button-group">
        <button onClick={handleEncrypt}>Encrypt</button>
        <button onClick={handleDecrypt} className="secondary">Decrypt</button>
      </div>

      <div className="result-box">
        <h3>Result:</h3>
        <pre>{outputText || 'Result appears here...'}</pre>
      </div>

      {/* Educational text will go here */}
    </div>
  );
}

export default CaesarCipher;