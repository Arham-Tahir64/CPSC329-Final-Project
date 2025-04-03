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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function FrequencyAnalysis() {
  const [inputText, setInputText] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Options state
  const [ignoreNonAlpha, setIgnoreNonAlpha] = useState(true);
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);

   // Chart Options
   const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allow chart to fill container height
        plugins: {
         legend: {
             display: false, // Usually don't need a legend for single dataset frequency
         },
         title: {
             display: true,
             text: 'Letter Frequency Analysis',
         },
         },
         scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Count'
                }
            },
             x: {
                title: {
                    display: true,
                    text: 'Letter'
                }
             }
         }
   };


  const handleAnalyze = () => {
    const frequencies = {};
    const textToAnalyze = isCaseSensitive ? inputText : inputText.toUpperCase();
    const alphabet = isCaseSensitive
        ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

     for (const letter of alphabet) { frequencies[letter] = 0; }

    for (let i = 0; i < textToAnalyze.length; i++) {
      const char = textToAnalyze[i];
       if (alphabet.includes(char)) {
           frequencies[char] = frequencies[char] + 1;
       } // else: ignore based on current logic
    }
    setAnalysisResults(frequencies); // Set raw results
  };

  // Effect to update chart data when analysisResults change
  useEffect(() => {
    if (analysisResults) {
      const labels = Object.keys(analysisResults);
      const data = Object.values(analysisResults);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Frequency',
            data: data,
            backgroundColor: 'rgba(0, 123, 255, 0.6)', // Blue bars
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1,
          },
        ],
      });
    } else {
        setChartData(null); // Clear chart if no results
    }
  }, [analysisResults]); // Rerun when analysisResults updates


  return (
    <div className="analysis-container">
      <h2>Frequency Analysis Tool</h2>

      {/* Input Text Area */}
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

      {/* Options Group */}
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

         {/* Checkboxes */}
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

      {/* Analyze Button */}
      <button onClick={handleAnalyze} style={{alignSelf: 'flex-start'}}>Analyze Text</button>

      {/* Chart Container */}
      <div className="chart-container" style={{ height: '400px' }}> {/* Give explicit height */}
        {chartData ? (
          <Bar options={chartOptions} data={chartData} />
        ) : (
          <p style={{ textAlign: 'center', paddingTop: '50px', color: '#666' }}>
            Analysis results (chart) will appear here after clicking "Analyze Text".
          </p>
        )}
      </div>

      {/* Educational text will go here */}
    </div>
  );
}

export default FrequencyAnalysis;