import { Component } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';
import Button from '../common/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <AlertTriangle size={64} color="var(--danger-red)" />
            <h1 style={styles.title}>¡Ups! Algo salió mal</h1>
            <p style={styles.message}>
              {this.props.fallbackMessage ||
                'Ha ocurrido un error inesperado. Por favor, intenta recargar la página.'}
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Detalles del error (solo en desarrollo)</summary>
                <pre style={styles.errorText}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div style={styles.actions}>
              <Button variant="primary" onClick={this.handleReset}>
                Intentar de nuevo
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.location.href = '/'}
              >
                Volver al inicio
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-secondary)',
    padding: '2rem'
  },
  content: {
    maxWidth: '600px',
    textAlign: 'center',
    backgroundColor: 'var(--bg-card)',
    padding: '3rem',
    borderRadius: '1rem',
    boxShadow: 'var(--shadow-xl)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: 0
  },
  message: {
    fontSize: '1rem',
    color: 'var(--text-secondary)',
    margin: 0,
    lineHeight: '1.6'
  },
  details: {
    width: '100%',
    textAlign: 'left',
    marginTop: '1rem'
  },
  summary: {
    cursor: 'pointer',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem'
  },
  errorText: {
    backgroundColor: 'var(--bg-tertiary)',
    padding: '1rem',
    borderRadius: '0.5rem',
    fontSize: '0.75rem',
    color: 'var(--danger-red)',
    overflow: 'auto',
    maxHeight: '200px'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  }
};

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallbackMessage: PropTypes.string,
  onReset: PropTypes.func
};

export default ErrorBoundary;

