import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
);

function FrequencyAnalysis() {
  const [inputText, setInputText] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [chartData, setChartData] = useState(null);

  // --- Options State ---
  const [analysisType, setAnalysisType] = useState('all');
  const [kValue, setKValue] = useState(1);
  const [kOffset, setKOffset] = useState(0);
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [ignoreNonAlpha, setIgnoreNonAlpha] = useState(true);

  // --- Chart Options
   const chartOptions = { 
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, title: { display: true, text: 'Letter Frequency Analysis' } },
        scales: { y: { beginAtZero: true, title: { display: true, text: 'Count' } }, x: { title: { display: true, text: 'Letter' } } }
   };

  // --- Analysis Logic ---
  const handleAnalyze = () => {
    const frequencies = {};
    let processedText = '';

    // 1. Filter text based on k-th selection
    if (analysisType === 'kth') {
      const k = Math.max(1, parseInt(kValue, 10) || 1); // Ensure k >= 1
      const offset = Math.max(0, parseInt(kOffset, 10) || 0); // Ensure offset >= 0
      for (let i = offset; i < inputText.length; i += k) {
        processedText += inputText[i];
      }
    } else {
      processedText = inputText;
    }

    // 2. Apply case sensitivity
    const textToAnalyze = isCaseSensitive ? processedText : processedText.toUpperCase();

    // 3. Define the alphabet to count
    const alphabet = isCaseSensitive
        ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Initialize counts
    for (const letter of alphabet) { frequencies[letter] = 0; }

    // 4. Count frequencies, considering ignoreNonAlpha
    for (let i = 0; i < textToAnalyze.length; i++) {
      const char = textToAnalyze[i];
      if (alphabet.includes(char)) {
        frequencies[char]++;
      } else if (!ignoreNonAlpha) {
         // If not ignoring non-alpha, count them under a generic key
         // Make sure this key is distinct if case-sensitive matters for it.
         const nonAlphaKey = 'Non-Alpha';
         frequencies[nonAlphaKey] = (frequencies[nonAlphaKey] || 0) + 1;
         // Add 'Non-Alpha' to the initial list if needed? Add it here if it's the first time.
         if(!(nonAlphaKey in frequencies)) frequencies[nonAlphaKey] = 1;
      }
    }

     // If 'Non-Alpha' was added and has a count, keep it.
     // Remove letters with 0 count (cleaner chart) unless 'Non-Alpha' is the only one.
     const finalFrequencies = {};
     let hasCounts = false;
     for (const key in frequencies) {
         if (frequencies[key] > 0) {
             finalFrequencies[key] = frequencies[key];
             hasCounts = true;
         }
     }

    setAnalysisResults(hasCounts ? finalFrequencies : null); // Use null if no characters were counted
  };

  // --- Effect to update chart (same as before) ---
  useEffect(() => {
    if (analysisResults) {
      const labels = Object.keys(analysisResults);
      const data = Object.values(analysisResults);
      setChartData({
        labels: labels,
        datasets: [{ /* ... dataset config ... */
            label: 'Frequency', data: data,
            backgroundColor: 'rgba(0, 123, 255, 0.6)', borderColor: 'rgba(0, 123, 255, 1)', borderWidth: 1,
        }],
      });
    } else {
      setChartData(null);
    }
  }, [analysisResults]);

  // --- Render ---
  return (
    <div className="analysis-container">
      <h2>Frequency Analysis Tool</h2>

      {/* Input Text Area */}
      <div className="form-group">
        <label htmlFor="freq-text">Text to Analyze:</label>
        <textarea id="freq-text" rows="6" value={inputText} onChange={(e) => setInputText(e.target.value)} />
      </div>

      {/* Options Group */}
      <div className="options-group">
        <h4>Analysis Options:</h4>
        <div className="option-row">
          <span>Analyze:</span>
          <label>
            <input type="radio" name="analysisType" value="all" checked={analysisType === 'all'} onChange={() => setAnalysisType('all')} /> Every Letter
          </label>
          <label>
            <input type="radio" name="analysisType" value="kth" checked={analysisType === 'kth'} onChange={() => setAnalysisType('kth')} /> Every K-th Letter
          </label>
        </div>

        {/* K-th options - Enable/disable based on analysisType */}
        <div className="option-row inline-inputs">
          <label htmlFor="kth-value"> K = </label>
          <input type="number" id="kth-value" min="1" value={kValue} onChange={(e) => setKValue(e.target.value)} disabled={analysisType !== 'kth'} />
          <label htmlFor="kth-offset" style={{ marginLeft: '15px' }}> Offset = </label>
          <input type="number" id="kth-offset" min="0" value={kOffset} onChange={(e) => setKOffset(e.target.value)} disabled={analysisType !== 'kth'} />
        </div>

        {/* Checkboxes */}
        <div className="option-row">
          <label>
            <input type="checkbox" checked={isCaseSensitive} onChange={(e) => setIsCaseSensitive(e.target.checked)} /> Case-Sensitive
          </label>
          <label style={{ marginLeft: '15px' }}>
            <input type="checkbox" checked={ignoreNonAlpha} onChange={(e) => setIgnoreNonAlpha(e.target.checked)} /> Ignore Non-Alphabetic
          </label>
        </div>
      </div>

      {/* Analyze Button */}
      <button onClick={handleAnalyze} style={{ alignSelf: 'flex-start' }}>Analyze Text</button>

      {/* Chart Container */}
       <div className="chart-container" style={{ height: '400px' }}>
        {chartData ? (
          <Bar options={chartOptions} data={chartData} />
        ) : (
          <p style={{ textAlign: 'center', paddingTop: '50px', color: '#666' }}>
            {analysisResults === null && inputText ? 'Analysis resulted in zero counts based on options.' : 'Analysis results (chart) will appear here after clicking "Analyze Text".'}
          </p>
        )}
      </div>

      {/* Educational text will go here */}
    </div>
  );
}

export default FrequencyAnalysis;