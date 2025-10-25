import { useState } from 'react';
import Particles from './components/Particles';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

 


  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('http://localhost:3001/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      console.log('Received data:', data);
      setResult(data);
      setShowResults(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewScan = () => {
    setFile(null);
    setResult(null);
    setShowResults(false);
    setError(null);
  };

  if (showResults && result) {
    return (
      <div className="app results-page">
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo">scanCV</div>
            <div className="nav-links">
              <button onClick={handleNewScan} className="nav-link">New Scan</button>
            </div>
          </div>
        </nav>

        <div className="results-container">
          <div className="results-card">
            <div className="score-header">
              <h2>Overall Score</h2>
              <div className="overall-score-big">
                {result.overallScore || result.score || 0}%
              </div>
            </div>

            {result.categoryScores && (
              <div className="category-scores-section">
                <h3>Category Breakdown</h3>
                <div className="scores-list">
                  {Object.entries(result.categoryScores).map(([key, value]) => (
                    <div className="score-row" key={key}>
                      <span className="score-label">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className="score-bar-container">
                        <div 
                          className="score-bar" 
                          style={{ width: `${value}%`, background: value >= 70 ? '#10b981' : '#f59e0b' }}
                        />
                        <span className="score-number">{value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.feedback && (
              <div className="feedback-box">
                <h3>📝 Overall Feedback</h3>
                <p>{result.feedback}</p>
              </div>
            )}

            <div className="feedback-columns">
              {result.strengths && result.strengths.length > 0 && (
                <div className="feedback-col">
                  <h3>✅ Strengths</h3>
                  <ul>
                    {result.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.improvements && result.improvements.length > 0 && (
                <div className="feedback-col">
                  <h3>💡 Improvements</h3>
                  <ul>
                    {result.improvements.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {result.suggestions && result.suggestions.length > 0 && (
              <div className="suggestions-box">
                <h3>🚀 Action Steps</h3>
                <ul>
                  {result.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            <button onClick={handleNewScan} className="scan-another-btn">
              Scan Another Resume
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app landing-page">
      {/* Ember Glow Background */}
  <div
    className="ember-glow-bg"
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      backgroundImage: `
        radial-gradient(circle at 50% 100%, rgba(255, 69, 0, 0.6) 0%, transparent 60%),
        radial-gradient(circle at 50% 100%, rgba(255, 140, 0, 0.4) 0%, transparent 70%),
        radial-gradient(circle at 50% 100%, rgba(255, 215, 0, 0.3) 0%, transparent 80%)
      `,
      backgroundColor: '#000'
    }}
  />
      {/* Particles Background */}
      <div className="particles-bg">
        <Particles
          particleColors={['#60a5fa', '#3b82f6', '#2563eb']}
          particleCount={100}
          particleSpread={20}
          speed={0.03}
          particleBaseSize={60}
          moveParticlesOnHover={false}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">ScanME</div>
          <div className="nav-links">
            <a href="#" className="nav-link">Home</a>
            <a href="#" className="nav-link">Why Us?</a>
            
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-highlight">AI Resume Scanner</span>
            <br />
            <span className="title-black">that actually gets you hired</span>
          </h1>
          
          <p className="hero-subtitle">
            Get your resume scanned by our AI-powered resume scanner
            <br />
            which provides instant feedback and helps you land more interviews
          </p>

          <div className="upload-section">
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileChange}
              disabled={loading}
              id="resume-input"
              style={{ display: 'none' }}
            />
            <label htmlFor="resume-input" className="upload-btn">
              <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {file ? file.name : 'Upload Resume'}
            </label>
          </div>

          {file && (
            <button onClick={handleAnalyze} disabled={loading} className="analyze-btn-main">
              {loading ? 'Analyzing...' : 'Analyze Now'}
            </button>
          )}

          {error && <div className="error-msg">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
