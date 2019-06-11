import React, { ErrorInfo } from 'react'
import styles from './ErrorBoundary.module.css'
import errorMessages from './ErrorMessages'

interface Props {
  children: React.ReactNode
}

interface State {
  error: false | Error
}

const getErrorMessage = (error: string) => {
  return errorMessages[error] || error
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: false }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.log(1392, error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className={styles.container}>
          {getErrorMessage(this.state.error.message)}
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
