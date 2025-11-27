import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/AdminContext'
import DoctorContextProvider from './context/DoctorContext'
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

// Detecta o basename baseado no caminho atual
const getBasename = () => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    if (path.startsWith('/admin')) {
      return '/admin'
    }
  }
  return ''
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter basename={getBasename()}>
    <AdminContextProvider>
      <DoctorContextProvider>
          <App />
      </DoctorContextProvider>
    </AdminContextProvider>
  </BrowserRouter>,
)
