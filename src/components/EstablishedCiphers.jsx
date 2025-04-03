import React from 'react';

function EstablishedCiphers() {
  return (
    <div className="established-container">
      <h2>Encrypt & Decrypt Established Ciphers</h2>

      {/* Algorithm Selection */}
      <div className="form-group">
         <label>Algorithm:</label>
         <div className="option-row">
             <label><input type="radio" name="cipherAlgorithm" value="otp" defaultChecked /> One-Time Pad (OTP)</label>
             <label><input type="radio" name="cipherAlgorithm" value="aes" /> AES-GCM</label>
             {/* <label><input type="radio" name="cipherAlgorithm" value="des" disabled/> DES (Not Implemented)</label> */}
         </div>
      </div>


      {/* Input Text */}
      <div className="form-group">
        <label htmlFor="cipher-text">Plaintext / Ciphertext:</label>
        <textarea
          id="cipher-text"
          rows="5"
          placeholder="Enter text here..."
        />
      </div>

      {/* Key Input */}
      <div className="form-group">
        <label htmlFor="cipher-key">Key:</label>
        <input
          id="cipher-key"
          type="text" // Keep as text for flexibility (OTP, password for AES key derivation)
          placeholder="Enter key (for OTP, same length as text is ideal)"
        />
        {/* Add note about key requirements */}
        <small>Note: For AES, this is used to derive the key. For OTP, ensure it's appropriate length or it will be repeated/truncated.</small>
      </div>


        {/* Output Format Selection */}
       <div className="form-group">
           <label>Output Format (for Ciphertext):</label>
            <div className="option-row">
                <label><input type="radio" name="outputFormat" value="text" defaultChecked /> Text (May fail for binary data)</label>
                <label><input type="radio" name="outputFormat" value="hex" /> Hexadecimal</label>
                <label><input type="radio" name="outputFormat" value="base64" /> Base64</label>
                 {/* <label><input type="radio" name="outputFormat" value="binary" /> Binary (Very long!)</label> */}
            </div>
       </div>


      {/* Action Buttons */}
      <div className="button-group">
        <button>Encrypt</button>
        <button className="secondary">Decrypt</button>
      </div>

      {/* Result Display */}
      <div className="result-box">
        <h3>Result:</h3>
        <pre>
          {/* Result will be displayed here */}
          Result appears here...
        </pre>
      </div>

      {/* Educational text sections will go here */}
    </div>
  );
}

export default EstablishedCiphers;