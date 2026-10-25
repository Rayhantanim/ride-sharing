import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Pages/Home/Home.jsx'
import { RouterProvider } from 'react-router-dom'
import router from './Router/Router.jsx'
import ChatBot from './Components/ChatBot.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ChatBot />             
  </StrictMode>,
)