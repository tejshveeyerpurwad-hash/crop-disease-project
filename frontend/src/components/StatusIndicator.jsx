import './StatusIndicator.css'

function StatusIndicator({ status }) {
  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return { icon: '🟢', text: 'Connected', class: 'connected' }
      case 'disconnected':
        return { icon: '🔴', text: 'Disconnected', class: 'disconnected' }
      case 'error':
        return { icon: '🟠', text: 'Connection Error', class: 'error' }
      default:
        return { icon: '🟡', text: 'Connecting...', class: 'idle' }
    }
  }

  const info = getStatusInfo()

  return (
    <div className={`status-indicator ${info.class}`}>
      <span className="status-icon">{info.icon}</span>
      <span className="status-text">{info.text}</span>
    </div>
  )
}

export default StatusIndicator
