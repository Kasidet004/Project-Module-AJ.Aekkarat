import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#151B2B',
            color: '#F1F5F9',
            border: '1px solid #2A3350',
          },
          success: { iconTheme: { primary: '#22D3C7', secondary: '#0A0E14' } },
          error: { iconTheme: { primary: '#FB7185', secondary: '#0A0E14' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
