import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
import StateRouter from './StateRouter.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StateRouter />
  </StrictMode>,
)
