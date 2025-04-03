import React, { useState } from 'react';

// Helper Functions
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function stringToBytes(str) { /* ... */ return encoder.encode(str); }
function bytesToString(bytes) { /* ... */
   try { return decoder.decode(bytes); } catch (e) { console.error("Decode Error:", e); return `[Binary data: ${bytesToHex(bytes)}]`; }
}
function bytesToHex(bytes) { /* ... */ return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), ''); }
function hexToBytes(hex) { /* ... */
    if (hex.length % 2 !== 0) throw new Error("Hex string must have an even number of digits");
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) { bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16); }
    return bytes;
}
function bytesToBase64(bytes) { /* ... */ const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''); return btoa(binString); }
function base64ToBytes(base64) { /* ... */
   try { const binString = atob(base64); return Uint8Array.from(binString, (m) => m.codePointAt(0)); } catch (e) { console.error("Base64 Decode Error:", e); throw new Error("Invalid Base64 string provided."); }
}
// --- End Helpers ---


function EstablishedCiphers() {
  // --- State Variables (Keep all from Step 17) ---
  const [algorithm, setAlgorithm] = useState('otp');
  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState('');
  const [outputFormat, setOutputFormat] = useState('base64'); // Default to Base64 for AES
  const [resultText, setResultText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); // For loading state


  // --- OTP Logic (Keep from Step 17) ---
   const processOTP = (inputBytes, keyBytes, encrypt = true) => { /* ... */
      const outputBytes = new Uint8Array(inputBytes.length);
      for (let i = 0; i < inputBytes.length; i++) { outputBytes[i] = inputBytes[i] ^ keyBytes[i % keyBytes.length]; }
      return outputBytes;
   };

  // --- AES-GCM Logic ---
  const AES_KEY_LENGTH = 256; // Using AES-256
  const PBKDF2_ITERATIONS = 100000; // Iteration count for PBKDF2
  const SALT_LENGTH = 16; // 16 bytes = 128 bits salt
  const IV_LENGTH = 12; // 12 bytes = 96 bits IV for GCM is recommended

  // Function to derive AES key from password using PBKDF2
  async function deriveAesKey(password, salt) {
      const keyMaterial = await window.crypto.subtle.importKey(
          "raw",
          encoder.encode(password),
          { name: "PBKDF2" },
          false, // not extractable
          ["deriveKey"]
      );
      return window.crypto.subtle.deriveKey(
         {
             name: "PBKDF2",
             salt: salt,
             iterations: PBKDF2_ITERATIONS,
             hash: "SHA-256",
         },
          keyMaterial,
          { name: "AES-GCM", length: AES_KEY_LENGTH },
          true, // Can be used for encryption/decryption
          ["encrypt", "decrypt"]
      );
  }

  // AES Encryption
   async function encryptAES(plainTextBytes, password) {
       const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
       const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));

       const aesKey = await deriveAesKey(password, salt);

       const encryptedData = await window.crypto.subtle.encrypt(
           { name: "AES-GCM", iv: iv },
           aesKey,
           plainTextBytes
       );

       // Prepend salt and iv to the ciphertext for decryption
       const encryptedBytes = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
       encryptedBytes.set(salt, 0);
       encryptedBytes.set(iv, salt.length);
       encryptedBytes.set(new Uint8Array(encryptedData), salt.length + iv.length);

       return encryptedBytes;
   }

  // AES Decryption
  async function decryptAES(encryptedBytesWithMeta, password) {
      if (encryptedBytesWithMeta.length < SALT_LENGTH + IV_LENGTH) {
          throw new Error("Invalid encrypted data: too short to contain salt and IV.");
      }

      // Extract salt and iv from the beginning
      const salt = encryptedBytesWithMeta.slice(0, SALT_LENGTH);
      const iv = encryptedBytesWithMeta.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
      const encryptedData = encryptedBytesWithMeta.slice(SALT_LENGTH + IV_LENGTH);

      const aesKey = await deriveAesKey(password, salt);

      const decryptedData = await window.crypto.subtle.decrypt(
          { name: "AES-GCM", iv: iv },
          aesKey,
          encryptedData
      );

      return new Uint8Array(decryptedData);
  }


  // --- Handlers ---
  const handleEncrypt = async () => { // Make async for AES
    setErrorText('');
    setResultText('');
    setIsProcessing(true); // Start loading
    try {
        const inputBytes = stringToBytes(inputText);
         if (!key) throw new Error("Key/Password cannot be empty.");
         if (inputBytes.length === 0) throw new Error("Input text cannot be empty.");


         let encryptedBytes;

         if (algorithm === 'otp') {
            const keyBytes = stringToBytes(key);
            if (keyBytes.length === 0) throw new Error("OTP key cannot be empty.");
            encryptedBytes = processOTP(inputBytes, keyBytes, true);
         }
         else if (algorithm === 'aes') {
             encryptedBytes = await encryptAES(inputBytes, key);
         }
         else {
             throw new Error("Invalid algorithm selected.");
         }

        // Format output
         if (outputFormat === 'hex') setResultText(bytesToHex(encryptedBytes));
         else if (outputFormat === 'base64') setResultText(bytesToBase64(encryptedBytes));
         else {
              if (algorithm === 'aes') {
                  console.warn("Text output format selected for AES, defaulting to Base64 as text can be unreliable.");
                  setResultText(bytesToBase64(encryptedBytes));
                  setOutputFormat('base64'); // Switch format state visually too
              } else {
                   // For OTP, try text, but it might fail
                   setResultText(bytesToString(encryptedBytes));
              }
         }

    } catch (err) {
      console.error("Encryption Error:", err);
      setErrorText(`Error: ${err.message}`);
      setResultText('');
    } finally {
        setIsProcessing(false);
    }
  };

  const handleDecrypt = async () => {
     setErrorText('');
     setResultText('');
     setIsProcessing(true);
     try {
          if (!key) throw new Error("Key/Password cannot be empty.");
          if (!inputText) throw new Error("Ciphertext input cannot be empty.");

          let inputBytes;
          // Get bytes from input based on selected format
           if (outputFormat === 'hex') inputBytes = hexToBytes(inputText);
           else if (outputFormat === 'base64') inputBytes = base64ToBytes(inputText);
           else {
               console.warn("Decrypting with 'text' format selected. This might fail if the ciphertext contains invalid UTF-8 sequences.");
               inputBytes = stringToBytes(inputText); // Attempt conversion anyway
           }

          let decryptedBytes;

         if (algorithm === 'otp') {
            const keyBytes = stringToBytes(key);
             if (keyBytes.length === 0) throw new Error("OTP key cannot be empty.");
            decryptedBytes = processOTP(inputBytes, keyBytes, false);
         }
         else if (algorithm === 'aes') {
             decryptedBytes = await decryptAES(inputBytes, key);
         }
          else {
             throw new Error("Invalid algorithm selected.");
         }

        setResultText(bytesToString(decryptedBytes)); // Decrypted result should always be text

     } catch (err) {
         console.error("Decryption Error:", err);
         if (err.message.toLowerCase().includes('decryption failed') || err.name === 'OperationError' && algorithm === 'aes') {
              setErrorText(`Decryption failed. Common causes: incorrect password/key, corrupted data, or wrong input format selected.`);
          } else {
             setErrorText(`Error: ${err.message}`);
          }
         setResultText('');
     } finally {
         setIsProcessing(false);
     }
  };


  return (
    <div className="established-container">
      <h2>Encrypt & Decrypt Established Ciphers</h2>

       {/* Algorithm Selection */}
       <div className="form-group"> <label>Algorithm:</label> <div className="option-row">
            <label><input type="radio" name="cipherAlgorithm" value="otp" checked={algorithm === 'otp'} onChange={() => setAlgorithm('otp')} disabled={isProcessing}/> One-Time Pad (OTP)</label>
            <label><input type="radio" name="cipherAlgorithm" value="aes" checked={algorithm === 'aes'} onChange={() => setAlgorithm('aes')} disabled={isProcessing}/> AES-GCM (Recommended)</label>
       </div> </div>

      {/* Input Text */}
       <div className="form-group"> <label htmlFor="cipher-text">Plaintext (for Encrypt) / Ciphertext (for Decrypt):</label> <textarea id="cipher-text" rows="5" placeholder="..." value={inputText} onChange={(e) => setInputText(e.target.value)} disabled={isProcessing}/> </div>

      {/* Key Input */}
       <div className="form-group"> <label htmlFor="cipher-key">Key / Password:</label> <input id="cipher-key" type="password" placeholder="Enter secret key or password" value={key} onChange={(e) => setKey(e.target.value)} disabled={isProcessing}/> <small>AES uses PBKDF2 key derivation. OTP uses the key directly (repeats/truncates).</small> </div>

       {/* Output Format Selection */}
        <div className="form-group"> <label>Ciphertext Format (Encrypt Output / Decrypt Input):</label> <div className="option-row">
             {/* Removed 'text' as default/option for AES output, keep for OTP maybe? Base64 is safer */}
             {/* <label><input type="radio" name="outputFormat" value="text" checked={outputFormat === 'text'} onChange={() => setOutputFormat('text')} disabled={isProcessing || algorithm === 'aes'}/> Text (OTP only, unreliable)</label> */}
             <label><input type="radio" name="outputFormat" value="hex" checked={outputFormat === 'hex'} onChange={() => setOutputFormat('hex')} disabled={isProcessing}/> Hexadecimal</label>
             <label><input type="radio" name="outputFormat" value="base64" checked={outputFormat === 'base64'} onChange={() => setOutputFormat('base64')} disabled={isProcessing}/> Base64 (Recommended for AES)</label>
        </div> </div>

      {/* Action Buttons */}
       <div className="button-group">
         <button onClick={handleEncrypt} disabled={isProcessing}>{isProcessing ? 'Processing...' : 'Encrypt'}</button>
         <button onClick={handleDecrypt} className="secondary" disabled={isProcessing}>{isProcessing ? 'Processing...' : 'Decrypt'}</button>
       </div>

       {/* Error Display */}
       {errorText && <div className="error-box">{errorText}</div>}

      {/* Result Display */}
      <div className="result-box">
        <h3>Result:</h3>
        <pre>{resultText || (isProcessing ? '...' : 'Result appears here...')}</pre>
      </div>

      {/* Educational text sections will go here */}
    </div>
  );
}

export default EstablishedCiphers;