import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [documentation, setDocumentation] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (loading) return; // Prevent multiple uploads
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    setLoading(true);

    try {
      const text = await file.text();

      const response = await fetch('http://127.0.0.1:5000/generate-docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: text
        })
      });

      const data = await response.json();

      setDocumentation(data.documentation);

    } catch (error) {
      console.log(error);
      setDocumentation('❌ Backend error');
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(documentation);
    alert('Copied to clipboard!');
  };

  const downloadMarkdown = () => {
    const blob = new Blob([documentation], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>🤖 AI Documentation Generator</h1>
        <p>Upload your code — AI writes the documentation instantly</p>
      </div>

      <div className="upload-section">
        <div className="upload-box">
          <input 
            type="file" 
            id="file-upload" 
            onChange={handleFileChange}
            accept=".zip,.py,.js,.java,.cpp,.html,.css"
          />
          <label htmlFor="file-upload" className="upload-label">
            📁 Click to upload code file
          </label>
          {fileName && <p className="file-name">Selected: {fileName}</p>}
        </div>

        <button 
          onClick={handleUpload} 
          disabled={loading}
          className="generate-btn"
        >
          {loading ? '⚡ AI is analyzing...' : '✨ Generate Documentation'}
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Reading your code...</p>
          <p className="small">AI is writing documentation</p>
        </div>
      )}

      {documentation && !loading && (
        <div className="docs-section">
          <div className="docs-header">
            <h2>📄 Generated Documentation</h2>
            <div className="button-group">
              <button onClick={copyToClipboard} className="copy-btn">📋 Copy</button>
              <button onClick={downloadMarkdown} className="download-btn">💾 Download .md</button>
            </div>
          </div>

          <div className="docs-content">
            <pre>{documentation}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;