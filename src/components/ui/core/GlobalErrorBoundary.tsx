import { ErrorBoundaryProps } from './ErrorBoundary'
import { Component, ReactNode } from 'react'

// Allow window.gtag usage for analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="bg-red-100 rounded-full p-2 mr-3">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Something went wrong</h2>
      </div>
      
      <p className="text-gray-600 mb-4">
        An error occurred while loading this page. Please try again.
      </p>
      
      <details className="mb-4">
        <summary className="cursor-pointer text-sm text-gray-500 mb-2">
          Error details
        </summary>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto text-red-600">
          {error.message}
        </pre>
      </details>
      
      <div className="flex space-x-3">
        <button
          onClick={resetError}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Reload page
        </button>
      </div>
    </div>
  </div>
)

interface ErrorInfo {
  componentStack: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Global Error Boundary caught an error:', error, errorInfo)
    
    // Report to error tracking service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false
      })
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError)
      }
      return <ErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}


