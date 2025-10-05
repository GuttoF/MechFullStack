import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/AdminContext'
import DoctorContextProvider from './context/DoctorContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <AdminContextProvider>
      <DoctorContextProvider>
          <App />
      </DoctorContextProvider>
    </AdminContextProvider>
  </BrowserRouter>,
)
