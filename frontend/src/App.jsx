import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ImageUploader from './components/ImageUploader'
import ResultDisplay from './components/ResultDisplay'
import StatusIndicator from './components/StatusIndicator'
import './App.css'

function App() {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('idle')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [apiBase] = useState(import.meta.env.VITE_API_BASE_URL || '/api')
  const wsRef = useRef(null)

  // Initialize WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const backendHost = window.location.port === '3000'
      ? `${window.location.hostname}:8000`
      : window.location.host
    const wsUrl = `${protocol}//${backendHost}/ws`

    wsRef.current = new WebSocket(wsUrl)

    wsRef.current.onopen = () => {
      setStatus('connected')
      setMessages(prev => [...prev, { type: 'info', text: '🌐 Connected to server' }])
    }

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      handleWebsocketMessage(data)
    }

    wsRef.current.onerror = () => {
      setStatus('error')
      setMessages(prev => [...prev, { type: 'error', text: '❌ Connection failed' }])
    }

    wsRef.current.onclose = () => {
      setStatus('disconnected')
    }

    return () => {
      if (wsRef.current) wsRef.current.close()
    }
  }, [])

  const handleWebsocketMessage = (data) => {
    switch (data.type) {
      case 'status':
        setMessages(prev => [...prev, { type: 'status', text: data.message }])
        break
      case 'upload_complete':
        setMessages(prev => [...prev, { type: 'success', text: `📤 ${data.filename} uploaded` }])
        break
      case 'prediction_complete':
        setPrediction(data.data)
        setLoading(false)
        setMessages(prev => [...prev, { type: 'success', text: '🎯 Analysis complete!' }])
        break
      case 'error':
        setMessages(prev => [...prev, { type: 'error', text: `❌ ${data.data.error}` }])
        setLoading(false)
        break
      default:
        break
    }
  }

  const handleImageSelect = (file) => {
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      // Send filename through WebSocket
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'file_selected',
          filename: file.name
        }))
      }
    }
    reader.readAsDataURL(file)

    // Upload and predict
    handlePrediction(file)
  }

  const handlePrediction = async (file) => {
    setLoading(true)
    setMessages(prev => [...prev, { type: 'status', text: `🔍 Analyzing ${file.name}...` }])

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${apiBase}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response?.data) {
        setPrediction(response.data)
        setLoading(false)
        setMessages(prev => [...prev, { type: 'success', text: '🎯 Analysis complete!' }])
      }
    } catch (error) {
      setLoading(false)
      setMessages(prev => [...prev, {
        type: 'error',
        text: error.response?.data?.error || '❌ Prediction failed'
      }])
    }
  }

  const clearResults = () => {
    setPrediction(null)
    setPreview(null)
    setMessages([])
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className={`app ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Animated Background */}
      <div className="background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-shape shape-4"></div>
        <div className="bg-shape shape-5"></div>
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">
              <span className="logo-icon">🌾</span>
              <h1>Crop Disease Detector</h1>
            </div>
            <p className="subtitle">AI-Powered Agricultural Analysis</p>
          </div>

          <div className="header-controls">
            <StatusIndicator status={status} />
            <button
              className="fullscreen-btn"
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
            >
              {isFullscreen ? '🗗' : '🗖'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="container">
          <div className="hero-section">
            <div className="hero-content">
              <h2>Advanced Plant Health Analysis</h2>
              <p>Upload your crop images and get instant AI-powered disease detection with real-time results</p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">99%</span>
                  <span className="stat-label">Accuracy</span>
                </div>
                <div className="stat">
                  <span className="stat-number">&lt;1s</span>
                  <span className="stat-label">Response</span>
                </div>
                <div className="stat">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Available</span>
                </div>
              </div>
            </div>
          </div>

          <div className="app-grid">
            <div className="uploader-section">
              <ImageUploader
                onImageSelect={handleImageSelect}
                loading={loading}
                preview={preview}
              />

              {prediction && (
                <button className="btn-clear" onClick={clearResults}>
                  🔄 New Analysis
                </button>
              )}
            </div>

            <div className="results-section">
              {prediction ? (
                <ResultDisplay
                  prediction={prediction}
                  preview={preview}
                />
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <h3>Analysis Results</h3>
                  <p>Upload an image to see detailed analysis and recommendations</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Stream */}
          <div className="activity-section">
            <div className="activity-header">
              <h3>📡 Live Activity</h3>
              <div className="activity-count">
                {messages.length} events
              </div>
            </div>
            <div className="activity-stream">
              {messages.length === 0 ? (
                <div className="empty-activity">
                  <div className="empty-activity-icon">⚡</div>
                  <p>Waiting for activity...</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`activity-item activity-${msg.type}`}>
                    <div className="activity-content">
                      <span className="activity-text">{msg.text}</span>
                      <span className="activity-time">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>🌾 About</h4>
              <p>Advanced AI technology for crop disease detection, helping farmers protect their yields.</p>
            </div>
            <div className="footer-section">
              <h4>⚡ Features</h4>
              <ul>
                <li>Real-time analysis</li>
                <li>High accuracy AI</li>
                <li>Instant results</li>
                <li>Mobile friendly</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>📞 Support</h4>
              <p>24/7 technical support</p>
              <p>API documentation available</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Crop Disease Detector. Built with React & FastAPI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
