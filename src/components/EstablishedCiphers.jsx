import React, { useState } from 'react';

// --- Helper Functions ---
// TextEncoder/Decoder for UTF-8 handling
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// String <-> Uint8Array
function stringToBytes(str) {
    return encoder.encode(str);
}
function bytesToString(bytes) {
   try {
        return decoder.decode(bytes);
   } catch (e) {
        console.error("Failed to decode bytes to string:", e);
        // Attempt fallback or return placeholder
        // Fallback: ISO-8859-1 (Latin1) - might display garbage but won't throw for invalid UTF-8
        let latin1String = '';
        bytes.forEach(byte => latin1String += String.fromCharCode(byte));
        // Check if it seems like valid text or just return hex as safer default?
        // For now, let's return a placeholder indicating potential binary data
        return `[Binary data: ${bytesToHex(bytes)}]`;
    }
}

// Bytes <-> Hex
function bytesToHex(bytes) {
    return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}
function hexToBytes(hex) {
    if (hex.length % 2 !== 0) {
         throw new Error("Hex string must have an even number of digits");
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
}

// Bytes <-> Base64
function bytesToBase64(bytes) {
    // Convert bytes to binary string
    const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
    // Use btoa for Base64 encoding
    return btoa(binString);
}

function base64ToBytes(base64) {
   try {
        // Use atob for Base64 decoding
        const binString = atob(base64);
        // Convert binary string to Uint8Array
        return Uint8Array.from(binString, (m) => m.codePointAt(0));
   } catch (e) {
        console.error("Invalid Base64 string:", e);
        throw new Error("Invalid Base64 string provided."); // Re-throw for handling
   }
}


function EstablishedCiphers() {
  const [algorithm, setAlgorithm] = useState('otp'); // 'otp', 'aes'
  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState('');
  const [outputFormat, setOutputFormat] = useState('text'); // 'text', 'hex', 'base64'
  const [resultText, setResultText] = useState('');
  const [errorText, setErrorText] = useState('');

  // --- OTP Logic ---
  const processOTP = (inputBytes, keyBytes, encrypt = true) => {
     // Key handling: Repeat or truncate key to match input length
     const outputBytes = new Uint8Array(inputBytes.length);
     for (let i = 0; i < inputBytes.length; i++) {
         const keyByte = keyBytes[i % keyBytes.length]; // Modulo ensures key repeats
         outputBytes[i] = inputBytes[i] ^ keyByte; // XOR operation
     }
     return outputBytes;
  };

  // --- Handlers ---
  const handleEncrypt = () => {
    setErrorText('');
    setResultText('');
    try {
        const inputBytes = stringToBytes(inputText);
         if (!key) { throw new Error("Key cannot be empty."); }

         if (algorithm === 'otp') {
            const keyBytes = stringToBytes(key); // Treat OTP key as text for XOR
            if (keyBytes.length === 0) { throw new Error("OTP key cannot be empty."); }

            const encryptedBytes = processOTP(inputBytes, keyBytes, true);

            // Format output
             if (outputFormat === 'hex') setResultText(bytesToHex(encryptedBytes));
             else if (outputFormat === 'base64') setResultText(bytesToBase64(encryptedBytes));
             else setResultText(bytesToString(encryptedBytes)); // Text format
         }
         else if (algorithm === 'aes') {
             // AES Encryption Logic (coming in next step)
             setResultText("AES encryption not yet implemented.");
         }

    } catch (err) {
      console.error("Encryption Error:", err);
      setErrorText(`Error: ${err.message}`);
      setResultText('');
    }
  };

  const handleDecrypt = () => {
     setErrorText('');
     setResultText('');
     try {
          if (!key) { throw new Error("Key cannot be empty."); }
          let inputBytes;

          // Determine how to interpret inputText based on the expected format of ciphertext
          // For decryption, we assume the inputText IS the ciphertext in *some* format.
          // Heuristics or explicit input format selection could be used.
          // Simple approach: Try formats until one works or rely on outputFormat state?
          // Let's assume the inputText matches the *selected* outputFormat for decryption.
           if (outputFormat === 'hex') inputBytes = hexToBytes(inputText);
           else if (outputFormat === 'base64') inputBytes = base64ToBytes(inputText);
           else inputBytes = stringToBytes(inputText); // Assume text if 'text' selected


         if (algorithm === 'otp') {
            const keyBytes = stringToBytes(key); // Key is always treated as text for OTP
             if (keyBytes.length === 0) { throw new Error("OTP key cannot be empty."); }

            // OTP decryption is the same XOR operation
            const decryptedBytes = processOTP(inputBytes, keyBytes, false);
            setResultText(bytesToString(decryptedBytes)); // Decrypted result is always text
         }
         else if (algorithm === 'aes') {
             // AES Decryption Logic (coming in next step)
             setResultText("AES decryption not yet implemented.");
         }

     } catch (err) {
         console.error("Decryption Error:", err);
         setErrorText(`Error: ${err.message}`);
         setResultText('');
     }
  };


  return (
    <div className="established-container">
      <h2>Encrypt & Decrypt Established Ciphers</h2>

       {/* Algorithm Selection */}
       <div className="form-group">
         <label>Algorithm:</label>
         <div className="option-row">
             <label><input type="radio" name="cipherAlgorithm" value="otp" checked={algorithm === 'otp'} onChange={() => setAlgorithm('otp')} /> One-Time Pad (OTP)</label>
             <label><input type="radio" name="cipherAlgorithm" value="aes" checked={algorithm === 'aes'} onChange={() => setAlgorithm('aes')} /> AES-GCM</label>
         </div>
      </div>

      {/* Input Text */}
      <div className="form-group">
         <label htmlFor="cipher-text">Plaintext (for Encrypt) / Ciphertext (for Decrypt):</label>
         <textarea
           id="cipher-text"
           rows="5"
           placeholder="Enter text here. For decryption, paste ciphertext in the selected 'Output Format'."
           value={inputText}
           onChange={(e) => setInputText(e.target.value)}
         />
       </div>

      {/* Key Input */}
      <div className="form-group">
        <label htmlFor="cipher-key">Key / Password:</label>
        <input
          id="cipher-key"
          type="text"
          placeholder="Enter key/password..."
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
         <small>Note: For AES, this is used to derive the key. For OTP, ensure it's appropriate length or it will be repeated/truncated.</small>
      </div>

       {/* Output Format Selection */}
       <div className="form-group">
           <label>Output Format (for Ciphertext / Input for Decrypt):</label>
            <div className="option-row">
                <label><input type="radio" name="outputFormat" value="text" checked={outputFormat === 'text'} onChange={() => setOutputFormat('text')} /> Text (Unreliable for binary)</label>
                <label><input type="radio" name="outputFormat" value="hex" checked={outputFormat === 'hex'} onChange={() => setOutputFormat('hex')} /> Hexadecimal</label>
                <label><input type="radio" name="outputFormat" value="base64" checked={outputFormat === 'base64'} onChange={() => setOutputFormat('base64')} /> Base64</label>
            </div>
       </div>

      {/* Action Buttons */}
      <div className="button-group">
        <button onClick={handleEncrypt}>Encrypt</button>
        <button onClick={handleDecrypt} className="secondary">Decrypt</button>
      </div>

       {/* Error Display */}
       {errorText && <div className="error-box">{errorText}</div>}


      {/* Result Display */}
      <div className="result-box">
        <h3>Result:</h3>
        <pre>{resultText || 'Result appears here...'}</pre>
      </div>

      {/* Educational text sections will go here */}
    </div>
  );
}

export default EstablishedCiphers;