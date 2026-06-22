import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

class ErrorBoundary extends React.Component {
  state = { error: null }
  componentDidCatch(error) { this.setState({ error }) }
  render() {
    if (this.state.error) return (
      <div style={{color:'red',padding:20,fontFamily:'monospace',whiteSpace:'pre-wrap'}}>
        {String(this.state.error)}
      </div>
    )
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <BrowserRouter basename="/Periodic-Table">
      <App />
    </BrowserRouter>
  </ErrorBoundary>
)

