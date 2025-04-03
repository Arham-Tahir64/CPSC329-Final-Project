import React, { useState } from 'react';
// Chart imports will be added in the next step

function FrequencyAnalysis() {
  const [inputText, setInputText] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null); // To store { letter: count }

   // Options state (will be expanded)
  const [ignoreNonAlpha, setIgnoreNonAlpha] = useState(true);
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);

  const handleAnalyze = () => {
    const frequencies = {};
    const textToAnalyze = isCaseSensitive ? inputText : inputText.toUpperCase();
    const alphabet = isCaseSensitive
        ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

     // Initialize counts for all alphabet letters to 0
     for (const letter of alphabet) {
         frequencies[letter] = 0;
     }


    for (let i = 0; i < textToAnalyze.length; i++) {
      const char = textToAnalyze[i];

      // Check if it's an alphabet character we care about
       if (alphabet.includes(char)) {
           frequencies[char] = (frequencies[char] || 0) + 1;
       } else if (!ignoreNonAlpha && !alphabet.includes(char)) {

       }
    }

     // Filter out letters with 0 count if desired
     const filteredFrequencies = {};
     for(const letter in frequencies) {
        //if (frequencies[letter] > 0) { // Only include letters that appeared
            filteredFrequencies[letter] = frequencies[letter];
        //}
     }

    setAnalysisResults(filteredFrequencies);
  };

  return (
    <div className="analysis-container">
      <h2>Frequency Analysis Tool</h2>

      <div className="form-group">
        <label htmlFor="freq-text">Text to Analyze:</label>
        <textarea
          id="freq-text"
          rows="6"
          placeholder="Paste ciphertext or any text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>

      <div className="options-group">
         <h4>Analysis Options:</h4>
         {/* Analysis Type Radio buttons - Logic added later */}
         <div className="option-row">
             <span>Analyze:</span>
             <label><input type="radio" name="analysisType" value="all" defaultChecked/> Every Letter</label>
             <label><input type="radio" name="analysisType" value="kth" /> Every K-th Letter</label>
         </div>
          <div className="option-row inline-inputs">
                 <label htmlFor="kth-value"> K = </label>
                 <input type="number" id="kth-value" min="1" defaultValue="1" style={{width: '60px'}} disabled/>
                 <label htmlFor="kth-offset" style={{marginLeft: '15px'}}> Offset = </label>
                 <input type="number" id="kth-offset" min="0" defaultValue="0" style={{width: '60px'}} disabled/>
             </div>

        {/* Actual option checkboxes */}
        <div className="option-row">
          <label>
            <input
                type="checkbox"
                checked={isCaseSensitive}
                onChange={(e) => setIsCaseSensitive(e.target.checked)}
            /> Case-Sensitive
          </label>
          <label style={{marginLeft: '15px'}}>
            <input
                type="checkbox"
                checked={ignoreNonAlpha}
                onChange={(e) => setIgnoreNonAlpha(e.target.checked)}
            /> Ignore Non-Alphabetic
          </label>
        </div>
      </div>

       <button onClick={handleAnalyze} style={{alignSelf: 'flex-start'}}>Analyze Text</button>

      <div className="chart-container">
         {/* Chart will be rendered here */}
         {analysisResults ? (
             <p>Chart will render here soon...</p> /* Placeholder until chart integration */
         ) : (
             <p>Analysis results (chart) will appear here after clicking "Analyze Text".</p>
         )}
      </div>

      {/* Educational text will go here */}
    </div>
  );
}

export default FrequencyAnalysis;