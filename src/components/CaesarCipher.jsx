import React, { useState } from 'react';

function CaesarCipher() {
    const [inputText, setInputText] = useState('');
    const [shift, setShift] = useState(3);
    const [outputText, setOutputText] = useState('');
  
    const handleShiftChange = (e) => {
      const value = parseInt(e.target.value, 10);
       if (!isNaN(value)) { // Only update if it's a number
           setShift(Math.max(1, Math.min(25, value))); // Clamp value between 1 and 25
       } else if (e.target.value === '') {
           setShift('');
       }
    };


 // Core Caesar Cipher Logic
 const processCaesar = (text, shiftAmount, encrypt = true) => {
    const actualShift = encrypt ? shiftAmount : -shiftAmount;
    // Ensure shift wraps around correctly for decryption too
    const effectiveShift = ((actualShift % 26) + 26) % 26; // Handles negative shifts properly

    return text.split('').map(char => {
      const charCode = char.charCodeAt(0);

      // Handle uppercase letters A-Z (65-90)
      if (charCode >= 65 && charCode <= 90) {
         // Use the effectiveShift calculated above
        let shiftedCode = 65 + ((charCode - 65 + effectiveShift) % 26);
        return String.fromCharCode(shiftedCode);
      }
      // Handle lowercase letters a-z (97-122)
      else if (charCode >= 97 && charCode <= 122) {
         // Use the effectiveShift calculated above
        let shiftedCode = 97 + ((charCode - 97 + effectiveShift) % 26);
        return String.fromCharCode(shiftedCode);
      }
      // Keep non-alphabetic characters unchanged
      else {
        return char;
      }
    }).join('');
  };

   const handleEncrypt = () => {
    const currentShift = parseInt(shift, 10);
    if (isNaN(currentShift) || currentShift < 1 || currentShift > 25) {
        setOutputText("Please enter a valid shift value between 1 and 25.");
        return;
    }
    const result = processCaesar(inputText, currentShift, true);
    setOutputText(result);
  };

  const handleDecrypt = () => {
     const currentShift = parseInt(shift, 10);
     if (isNaN(currentShift) || currentShift < 1 || currentShift > 25) {
         setOutputText("Please enter a valid shift value between 1 and 25.");
         return;
     }
    // Decryption is just shifting in the opposite direction
    const result = processCaesar(inputText, currentShift, false);
    setOutputText(result);
  };


  return (
    <div className="cipher-container">
      <h2>Caesar Cipher Translator</h2>

      {/* Input Fields */}
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
          value={shift}
          onChange={handleShiftChange}
          placeholder="e.g., 3"
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


      {/* Educational Text */}
      <div className="educational-text">
        <h3>How the Caesar Cipher Works</h3>
        <p>
          The Caesar cipher is one of the simplest and most widely known encryption techniques. It's a type of substitution cipher where each letter in the plaintext is shifted a certain number of places down the alphabet.
        </p>
        <p>
          For example, with a shift of 3, 'A' would become 'D', 'B' would become 'E', and so on. When the shift goes past 'Z', it wraps back around to 'A'. Decryption involves shifting the letters back by the same amount.
        </p>
        <p>
          While historically significant (used by Julius Caesar), it's very insecure by modern standards because there are only 25 possible keys (shifts), making it easy to break using brute force or frequency analysis.
        </p>
      </div>
    </div>
  );
}

export default CaesarCipher;