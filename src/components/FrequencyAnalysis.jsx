import React from 'react';

function FrequencyAnalysis() {
  return (
    <div className="analysis-container">
      <h2>Frequency Analysis Tool</h2>

      <div className="form-group">
        <label htmlFor="freq-text">Text to Analyze:</label>
        <textarea
          id="freq-text"
          rows="6"
          placeholder="Paste ciphertext or any text here..."
        />
      </div>

      <div className="options-group">
        <h4>Analysis Options:</h4>
         <div className="option-row">
             <span>Analyze:</span>
             <label><input type="radio" name="analysisType" value="all" defaultChecked/> Every Letter</label>
             <label><input type="radio" name="analysisType" value="kth" /> Every K-th Letter</label>
         </div>
         {/* <div className="kth-options"> */}
            <div className="option-row inline-inputs">
                 <label htmlFor="kth-value"> K = </label>
                 <input type="number" id="kth-value" min="1" defaultValue="1" style={{width: '60px'}} disabled/> {/* Disable initially */}
                 <label htmlFor="kth-offset" style={{marginLeft: '15px'}}> Offset = </label>
                 <input type="number" id="kth-offset" min="0" defaultValue="0" style={{width: '60px'}} disabled/> {/* Disable initially */}
             </div>
         {/* </div> */}

        <div className="option-row">
          <label>
            <input type="checkbox" name="caseSensitive" /> Case-Sensitive
          </label>
          <label style={{marginLeft: '15px'}}>
            <input type="checkbox" name="ignoreNonAlpha" defaultChecked /> Ignore Non-Alphabetic
          </label>
        </div>
      </div>

       <button style={{alignSelf: 'flex-start'}}>Analyze Text</button>

      <div className="chart-container" style={{marginTop: '20px', border: '1px solid #ccc', padding: '10px', minHeight: '350px'}}>
         {/* Chart will be rendered here */}
         <p>Analysis results (chart) will appear here.</p>
      </div>

      {/* Educational text will go here */}
    </div>
  );
}

export default FrequencyAnalysis;