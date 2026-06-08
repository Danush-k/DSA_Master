import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an uncaught exception:", error, errorInfo);
  }

  handleRetry = () => {
    // Clear state and force-refresh the page to attempt re-fetching chunk assets
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="lc-loading-screen" style={{ minHeight: '80vh', padding: 24 }}>
          <div className="lc-loading-card" style={{ maxWidth: 420, textAlign: 'center', borderColor: 'var(--error)' }}>
            <div 
              className="lc-logo-circle" 
              style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: 'var(--error)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                border: '1.5px solid rgba(239, 68, 68, 0.25)'
              }}
            >
              <AlertTriangle size={24} />
            </div>
            <h2 className="lc-loading-title" style={{ color: 'var(--text-primary)', fontSize: 18, marginBottom: 8 }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              The application could not load the requested page. This usually happens due to a temporary network issue or a connection timeout.
            </p>
            <button 
              className="btn btn-secondary" 
              onClick={this.handleRetry}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 8, 
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-secondary)',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}
            >
              <RefreshCw size={14} /> Retry Loading Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
