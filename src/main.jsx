import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { initLenis } from './utils/lenis'

// Ensure browser automatic scroll restoration is disabled on reload
if (typeof window !== 'undefined') {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Site-wide inertia smooth scrolling (synced with GSAP ScrollTrigger)
  initLenis();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
