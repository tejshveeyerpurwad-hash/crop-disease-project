import './ResultDisplay.css'

function ResultDisplay({ prediction, preview }) {
  const isHealthy = prediction.prediction === 'Healthy'
  const confidencePercent = (prediction.confidence * 100).toFixed(2)

  const getHealthStatus = () => {
    if (isHealthy) {
      return { icon: '✓', label: 'Healthy', class: 'healthy' }
    } else {
      return { icon: '⚠', label: 'Diseased', class: 'diseased' }
    }
  }

  const status = getHealthStatus()

  return (
    <div className="result-display">
      <h2>Analysis Result</h2>

      {preview && (
        <div className="result-image">
          <img src={preview} alt="Analyzed" />
        </div>
      )}

      <div className={`result-status ${status.class}`}>
        <div className="status-icon">{status.icon}</div>
        <div className="status-text">
          <h3>{status.label}</h3>
          <p>Classification Result</p>
        </div>
      </div>

      <div className="confidence-meter">
        <div className="confidence-label">
          <span>Confidence Score</span>
          <span className="confidence-value">{confidencePercent}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${prediction.confidence * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="result-details">
        <div className="detail-item">
          <span className="detail-label">File:</span>
          <span className="detail-value">{prediction.filename}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Analyzed at:</span>
          <span className="detail-value">
            {new Date(prediction.upload_time).toLocaleString()}
          </span>
        </div>
      </div>

      {!isHealthy && (
        <div className="recommendation">
          <h4>Recommended Actions</h4>
          <ul>
            <li>Isolate affected plants to prevent disease spread</li>
            <li>Consult agricultural expert for treatment options</li>
            <li>Apply appropriate fungicides or pesticides</li>
            <li>Monitor other nearby plants regularly</li>
          </ul>
        </div>
      )}

      {isHealthy && (
        <div className="success-message">
          <h4>Good News! 🎉</h4>
          <p>Your crop appears healthy. Continue with regular monitoring and maintenance.</p>
        </div>
      )}
    </div>
  )
}

export default ResultDisplay
