import React, { useState } from 'react';
 // Helper Functions
const encoder = new TextEncoder(); const decoder = new TextDecoder();
function stringToBytes(str) { return encoder.encode(str); }
function bytesToString(bytes) { try { return decoder.decode(bytes); } catch (e) { console.error("Decode Error:", e); return `[Binary data: ${bytesToHex(bytes)}]`; }}
function bytesToHex(bytes) { return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), ''); }
function hexToBytes(hex) { if (hex.length % 2 !== 0) throw new Error("Hex string must have an even number of digits"); const bytes = new Uint8Array(hex.length / 2); for (let i = 0; i < hex.length; i += 2) { bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16); } return bytes; }
function bytesToBase64(bytes) { const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''); return btoa(binString); }
function base64ToBytes(base64) { try { const binString = atob(base64); return Uint8Array.from(binString, (m) => m.codePointAt(0)); } catch (e) { console.error("Base64 Decode Error:", e); throw new Error("Invalid Base64 string provided."); }}

function EstablishedCiphers() {
    const [algorithm, setAlgorithm] = useState('aes'); // Default to AES
    const [inputText, setInputText] = useState('');
    const [key, setKey] = useState('');
    const [outputFormat, setOutputFormat] = useState('base64');
    const [resultText, setResultText] = useState('');
    const [errorText, setErrorText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // --- OTP Logic ---
    const processOTP = (inputBytes, keyBytes) => { const outputBytes = new Uint8Array(inputBytes.length); for (let i = 0; i < inputBytes.length; i++) { outputBytes[i] = inputBytes[i] ^ keyBytes[i % keyBytes.length]; } return outputBytes; };

    // --- AES-GCM Logic ---
    const AES_KEY_LENGTH = 256; const PBKDF2_ITERATIONS = 100000; const SALT_LENGTH = 16; const IV_LENGTH = 12;
    async function deriveAesKey(password, salt) { const keyMaterial = await window.crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]); return window.crypto.subtle.deriveKey({ name: "PBKDF2", salt: salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: AES_KEY_LENGTH }, true, ["encrypt", "decrypt"]); }
    async function encryptAES(plainTextBytes, password) { const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH)); const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH)); const aesKey = await deriveAesKey(password, salt); const encryptedData = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, aesKey, plainTextBytes); const encryptedBytes = new Uint8Array(salt.length + iv.length + encryptedData.byteLength); encryptedBytes.set(salt, 0); encryptedBytes.set(iv, salt.length); encryptedBytes.set(new Uint8Array(encryptedData), salt.length + iv.length); return encryptedBytes; }
    async function decryptAES(encryptedBytesWithMeta, password) { if (encryptedBytesWithMeta.length < SALT_LENGTH + IV_LENGTH) throw new Error("Invalid encrypted data: too short."); const salt = encryptedBytesWithMeta.slice(0, SALT_LENGTH); const iv = encryptedBytesWithMeta.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH); const encryptedData = encryptedBytesWithMeta.slice(SALT_LENGTH + IV_LENGTH); const aesKey = await deriveAesKey(password, salt); const decryptedData = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, aesKey, encryptedData); return new Uint8Array(decryptedData); }

    // --- Handlers ---
    const handleEncrypt = async () => {
        setErrorText(''); setResultText(''); setIsProcessing(true);
        try {
            const inputBytes = stringToBytes(inputText); if (!key) throw new Error("Key/Password cannot be empty."); if (inputBytes.length === 0) throw new Error("Input text cannot be empty.");
            let encryptedBytes;
            if (algorithm === 'otp') { const keyBytes = stringToBytes(key); if (keyBytes.length === 0) throw new Error("OTP key cannot be empty."); encryptedBytes = processOTP(inputBytes, keyBytes); }
            else if (algorithm === 'aes') { encryptedBytes = await encryptAES(inputBytes, key); }
            else { throw new Error("Invalid algorithm selected."); }
            if (outputFormat === 'hex') setResultText(bytesToHex(encryptedBytes));
            else if (outputFormat === 'base64') setResultText(bytesToBase64(encryptedBytes));
            else { // Default to Base64 for AES if text chosen
                 if(algorithm === 'aes') { console.warn("Text output selected for AES, using Base64."); setResultText(bytesToBase64(encryptedBytes)); setOutputFormat('base64'); }
                 else { setResultText(bytesToString(encryptedBytes)); /* Try text for OTP */ }
             }
        } catch (err) { console.error("Encrypt Error:", err); setErrorText(`Error: ${err.message}`); setResultText(''); } finally { setIsProcessing(false); }
    };
    const handleDecrypt = async () => {
         setErrorText(''); setResultText(''); setIsProcessing(true);
         try {
             if (!key) throw new Error("Key/Password cannot be empty."); if (!inputText) throw new Error("Ciphertext input cannot be empty.");
             let inputBytes;
             if (outputFormat === 'hex') inputBytes = hexToBytes(inputText);
             else if (outputFormat === 'base64') inputBytes = base64ToBytes(inputText);
             else { console.warn("Decrypting with 'text' format."); inputBytes = stringToBytes(inputText); } // Attempt text format
             let decryptedBytes;
             if (algorithm === 'otp') { const keyBytes = stringToBytes(key); if (keyBytes.length === 0) throw new Error("OTP key cannot be empty."); decryptedBytes = processOTP(inputBytes, keyBytes); }
             else if (algorithm === 'aes') { decryptedBytes = await decryptAES(inputBytes, key); }
             else { throw new Error("Invalid algorithm selected."); }
             setResultText(bytesToString(decryptedBytes));
         } catch (err) { console.error("Decrypt Error:", err); if (err.message.toLowerCase().includes('decryption failed') || err.name === 'OperationError') { setErrorText(`Decryption failed. Check password/key, input format, and data integrity.`); } else { setErrorText(`Error: ${err.message}`); } setResultText(''); } finally { setIsProcessing(false); }
    };

  return (
    <div className="established-container">
      <h2>Encrypt & Decrypt Established Ciphers</h2>
         {/* Algorithm Selection */}
         <div className="form-group"> <label>Algorithm:</label> <div className="option-row"> <label><input type="radio" name="cipherAlgorithm" value="otp" checked={algorithm === 'otp'} onChange={() => setAlgorithm('otp')} disabled={isProcessing}/> One-Time Pad (OTP)</label> <label><input type="radio" name="cipherAlgorithm" value="aes" checked={algorithm === 'aes'} onChange={() => setAlgorithm('aes')} disabled={isProcessing}/> AES-GCM (Recommended)</label> </div> </div>
         {/* Input Text */} <div className="form-group"> <label htmlFor="cipher-text">Plaintext (for Encrypt) / Ciphertext (for Decrypt):</label> <textarea id="cipher-text" rows="5" placeholder="Enter text. For decrypt, paste ciphertext in the selected format." value={inputText} onChange={(e) => setInputText(e.target.value)} disabled={isProcessing}/> </div>
         {/* Key Input */} <div className="form-group"> <label htmlFor="cipher-key">Key / Password:</label> <input id="cipher-key" type="password" placeholder="Enter secret key or password" value={key} onChange={(e) => setKey(e.target.value)} disabled={isProcessing}/> <small>AES uses PBKDF2 key derivation. OTP uses the key directly.</small> </div>
         {/* Output Format Selection */} <div className="form-group"> <label>Ciphertext Format (Encrypt Output / Decrypt Input):</label> <div className="option-row"> <label><input type="radio" name="outputFormat" value="hex" checked={outputFormat === 'hex'} onChange={() => setOutputFormat('hex')} disabled={isProcessing}/> Hex</label> <label><input type="radio" name="outputFormat" value="base64" checked={outputFormat === 'base64'} onChange={() => setOutputFormat('base64')} disabled={isProcessing}/> Base64</label> </div> </div>
         {/* Action Buttons */} <div className="button-group"> <button onClick={handleEncrypt} disabled={isProcessing}>{isProcessing ? 'Processing...' : 'Encrypt'}</button> <button onClick={handleDecrypt} className="secondary" disabled={isProcessing}>{isProcessing ? 'Processing...' : 'Decrypt'}</button> </div>

      {/* Error Display */}
      {errorText && <div className="error-box">{errorText}</div>}

      {/* Result Display */}
      <div className="result-box">
        <h3>Result:</h3>
        <pre>{resultText || (isProcessing ? '...' : 'Result appears here...')}</pre>
      </div>

      {/* --- Educational Texts --- */}
      <div className="educational-text">
        <h3>One-Time Pad (OTP)</h3>
        <p>
          The One-Time Pad is a theoretically unbreakable encryption technique when used correctly. It requires a pre-shared random key that is the same length as the message. Encryption is performed by combining the plaintext with the key using modular addition or, more commonly in computing, the bitwise XOR operation.
        </p>
        <p>
          <strong>How it works (XOR):</strong> Each bit/byte of the plaintext is XORed with the corresponding bit/byte of the key. `Ciphertext = Plaintext XOR Key`. Decryption uses the same key: `Plaintext = Ciphertext XOR Key`.
        </p>
        <p>
          <strong>Security:</strong> Its perfect secrecy relies on strict conditions: the key must be truly random, used only once, kept secret, and be at least as long as the message. In practice, generating and securely managing such keys is extremely difficult, making true OTP impractical for most applications. This implementation repeats or truncates the key if lengths differ, which breaks the core security guarantees and makes it vulnerable (effectively becoming a Vigenère cipher if the key is short and repeated).
        </p>
      </div>

       <div className="educational-text">
         <h3>AES (Advanced Encryption Standard) - GCM Mode</h3>
         <p>
           AES is a symmetric block cipher chosen by the U.S. government as the standard for encrypting classified information. It operates on fixed-size blocks of data (128 bits) and supports key sizes of 128, 192, or 256 bits (this tool uses 256 bits).
         </p>
         <p>
            <strong>GCM (Galois/Counter Mode):</strong> This is a mode of operation for AES that provides both confidentiality (encryption) and data authenticity (integrity checking). It uses a counter for encryption and incorporates a mechanism to generate an authentication tag. This means GCM not only encrypts the data but also helps detect if the data has been tampered with during transmission or storage. This is highly recommended for modern applications.
         </p>
         <p>
           <strong>Key Derivation (PBKDF2):</strong> Since AES requires a fixed-size binary key, but users typically provide passwords, we use a Key Derivation Function (PBKDF2) here. PBKDF2 takes the password, a random 'salt' (to prevent precomputed attacks like rainbow tables), and applies a hashing function many times (iterations) to produce a cryptographically strong key of the required length. The salt is stored alongside the ciphertext (usually prepended) so it can be used for decryption.
         </p>
          <p>
           <strong>IV (Initialization Vector):</strong> GCM requires a unique IV for each encryption performed with the same key. Using the same IV twice with the same key compromises security catastrophically. This implementation generates a random 12-byte IV for each encryption and prepends it (after the salt) to the ciphertext.
         </p>
         <p>
            <strong>Web Crypto API:</strong> This implementation uses the browser's built-in `window.crypto.subtle` API, which provides standardized and efficient cryptographic operations directly in JavaScript, leveraging the browser's underlying cryptographic libraries.
         </p>
       </div>
         {/* Optional: Note on DES */}
         {/* <div className="educational-text">
             <h4>Note on DES</h4>
             <p>DES (Data Encryption Standard) is an older symmetric-key algorithm (standardized in 1977) with a small key size (56 bits) and block size (64 bits). Due to its small key size, it is now considered insecure and vulnerable to brute-force attacks with modern hardware. It has been largely superseded by AES. The Web Crypto API does not provide a simple, direct implementation of DES, hence it's not included here.</p>
         </div> */}
    </div>
  );
}

export default EstablishedCiphers;