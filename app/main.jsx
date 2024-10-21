/**
 * DON'T TOUCH THIS FILE!
 * This is where we render our entire React application :)
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ButtonPage from './page.jsx'
import './globals.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ButtonPage />
  </StrictMode>,
)
