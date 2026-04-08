import { useState, useRef } from 'react'
import './ImageUploader.css'

function ImageUploader({ onImageSelect, loading, preview }) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0])
    }
  }

  const triggerInput = () => {
    inputRef.current?.click()
  }

  return (
    <div className="uploader">
      <div className="uploader-header">
        <h2>📸 Upload Crop Image</h2>
        <p>Drag & drop or click to select your crop image for analysis</p>
      </div>

      <div
        className={`upload-area ${dragActive ? 'active' : ''} ${loading ? 'loading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="file-input"
        />

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3>🔍 Analyzing Image...</h3>
            <p>AI is processing your crop image</p>
            <div className="loading-progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          </div>
        ) : preview ? (
          <div className="preview-container">
            <div className="preview-image-wrapper">
              <img src={preview} alt="Crop Preview" className="preview-image" />
              <div className="preview-overlay">
                <div className="preview-status">
                  <span className="status-icon">✅</span>
                  <span className="status-text">Ready for Analysis</span>
                </div>
              </div>
            </div>
            <div className="preview-info">
              <h4>Image Ready</h4>
              <p>Click analyze to get AI-powered disease detection</p>
            </div>
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon">
              <div className="icon-circle">
                <span>📷</span>
              </div>
            </div>
            <div className="upload-text">
              <h3>Choose Your Crop Image</h3>
              <p>Supported formats: JPG, PNG, WebP</p>
              <p>Maximum size: 10MB</p>
            </div>
            <div className="upload-features">
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <span>Instant Analysis</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎯</span>
                <span>High Accuracy</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {!preview && !loading && (
        <div className="upload-actions">
          <button className="upload-btn primary" onClick={triggerInput}>
            <span className="btn-icon">📁</span>
            Browse Files
          </button>
          <div className="upload-hint">
            <span>or drag and drop your image here</span>
          </div>
        </div>
      )}

      {preview && !loading && (
        <div className="analyze-section">
          <button className="analyze-btn" onClick={triggerInput}>
            <span className="btn-icon">🔁</span>
            Replace Image
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageUploader
