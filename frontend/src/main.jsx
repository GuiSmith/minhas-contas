// Bibliotecas react
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css' // ✅ Import here
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // Optional
import 'bootstrap-icons/font/bootstrap-icons.css'

// Contextos
import { AuthProvider } from '@contexts/AuthContext';

// Recursos
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Router basename='/'>
        <App />
      </Router>
    </AuthProvider>
  </StrictMode>,
)
