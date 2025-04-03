import React, { useState, useEffect } from 'react';
// ... (imports, ChartJS registration remain the same)
import { Bar } from 'react-chartjs-2';
 import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
);


function FrequencyAnalysis() {
  // all state variables and functions
    const [inputText, setInputText] = useState('');
    const [analysisResults, setAnalysisResults] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [analysisType, setAnalysisType] = useState('all');
    const [kValue, setKValue] = useState(1);
    const [kOffset, setKOffset] = useState(0);
    const [isCaseSensitive, setIsCaseSensitive] = useState(false);
    const [ignoreNonAlpha, setIgnoreNonAlpha] = useState(true);

    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, title: { display: true, text: 'Letter Frequency Analysis' } },
        scales: { y: { beginAtZero: true, title: { display: true, text: 'Count' } }, x: { title: { display: true, text: 'Letter' } } }
   };

    const handleAnalyze = () => {
       const frequencies = {};
       let processedText = '';
       if (analysisType === 'kth') {
           const k = Math.max(1, parseInt(kValue, 10) || 1);
           const offset = Math.max(0, parseInt(kOffset, 10) || 0);
           for (let i = offset; i < inputText.length; i += k) { processedText += inputText[i]; }
       } else { processedText = inputText; }
       const textToAnalyze = isCaseSensitive ? processedText : processedText.toUpperCase();
       const alphabet = isCaseSensitive ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
       for (const letter of alphabet) { frequencies[letter] = 0; }
       let nonAlphaKey = 'Non-Alpha'; // Key for non-alphabetic chars

       for (let i = 0; i < textToAnalyze.length; i++) {
           const char = textToAnalyze[i];
           if (alphabet.includes(char)) { frequencies[char]++; }
           else if (!ignoreNonAlpha) {
               if(!(nonAlphaKey in frequencies)) frequencies[nonAlphaKey] = 0; // Initialize if first time
                frequencies[nonAlphaKey]++;
           }
       }
        const finalFrequencies = {};
        let hasCounts = false;
        for (const key in frequencies) {
            if (frequencies[key] > 0) {
                finalFrequencies[key] = frequencies[key];
                hasCounts = true;
            }
        }
       setAnalysisResults(hasCounts ? finalFrequencies : null);
   };

    useEffect(() => {
         if (analysisResults) {
           const labels = Object.keys(analysisResults);
           const data = Object.values(analysisResults);
           setChartData({
             labels: labels,
             datasets: [{ label: 'Frequency', data: data, backgroundColor: 'rgba(0, 123, 255, 0.6)', borderColor: 'rgba(0, 123, 255, 1)', borderWidth: 1, }],
           });
         } else { setChartData(null); }
       }, [analysisResults]);

  return (
    <div className="analysis-container">
      <h2>Frequency Analysis Tool</h2>

      {/* ... (Input fields, Options, Button, Chart Container remain the same) ... */}
        {/* Input Text Area */}
        <div className="form-group">
            <label htmlFor="freq-text">Text to Analyze:</label>
            <textarea id="freq-text" rows="6" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Paste ciphertext or any text here..."/>
        </div>

         {/* Options Group */}
         <div className="options-group">
            <h4>Analysis Options:</h4>
            <div className="option-row">
            <span>Analyze:</span>
            <label><input type="radio" name="analysisType" value="all" checked={analysisType === 'all'} onChange={() => setAnalysisType('all')} /> Every Letter</label>
            <label><input type="radio" name="analysisType" value="kth" checked={analysisType === 'kth'} onChange={() => setAnalysisType('kth')} /> Every K-th Letter</label>
            </div>
            <div className="option-row inline-inputs">
            <label htmlFor="kth-value"> K = </label>
            <input type="number" id="kth-value" min="1" value={kValue} onChange={(e) => setKValue(e.target.value)} disabled={analysisType !== 'kth'} style={{width: '60px'}}/>
            <label htmlFor="kth-offset" style={{ marginLeft: '15px' }}> Offset = </label>
            <input type="number" id="kth-offset" min="0" value={kOffset} onChange={(e) => setKOffset(e.target.value)} disabled={analysisType !== 'kth'} style={{width: '60px'}}/>
            </div>
            <div className="option-row">
            <label><input type="checkbox" checked={isCaseSensitive} onChange={(e) => setIsCaseSensitive(e.target.checked)} /> Case-Sensitive</label>
            <label style={{ marginLeft: '15px' }}><input type="checkbox" checked={ignoreNonAlpha} onChange={(e) => setIgnoreNonAlpha(e.target.checked)} /> Ignore Non-Alphabetic</label>
            </div>
        </div>

        {/* Analyze Button */}
        <button onClick={handleAnalyze} style={{ alignSelf: 'flex-start' }}>Analyze Text</button>

         {/* Chart Container */}
       <div className="chart-container" style={{ height: '400px' }}>
        {chartData ? ( <Bar options={chartOptions} data={chartData} /> ) : (
          <p style={{ textAlign: 'center', paddingTop: '50px', color: '#666' }}>
            {analysisResults === null && inputText ? 'Analysis resulted in zero counts based on options.' : 'Analysis results (chart) will appear here after clicking "Analyze Text".'}
          </p>
        )}
      </div>


      {/* Educational Text */}
      <div className="educational-text">
        <h3>What is Frequency Analysis?</h3>
        <p>
          Frequency analysis is a fundamental technique in classical cryptography and cryptanalysis. It relies on the fact that, in any given language, certain letters and combinations of letters occur with characteristic frequencies. For example, in English, 'E' is the most common letter, followed by 'T', 'A', 'O', 'I', 'N', etc.
        </p>
        <p>
          When analyzing ciphertext from simple substitution ciphers (like the Caesar cipher), comparing the frequency of letters in the ciphertext to the known frequencies of the language can reveal clues about the original plaintext. The most frequent letter in the ciphertext might correspond to 'E' in the plaintext, the next most frequent to 'T', and so on.
        </p>
        <p>
          This tool allows you to visualize these frequencies. Analyzing every K-th letter is useful against polyalphabetic ciphers (like Vigenère) where different shifts are used periodically. By analyzing letters at intervals matching the key length (K), you can isolate the effects of a single Caesar shift within the larger cipher.
        </p>
      </div>
    </div>
  );
}

export default FrequencyAnalysis;