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
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    formData.append('code', file);

    try {
      const response = await fetch('http://localhost:5000/generate-docs', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setDocumentation(data.documentation || 'Documentation generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      setDocumentation('Error connecting to backend. Make sure your teammate\'s server is running on port 5000');
    } finally {
      setLoading(false);
    }
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