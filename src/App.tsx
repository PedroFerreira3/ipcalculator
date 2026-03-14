import { useState } from 'react'

import Footer from './components/Footer'
import HelpModal from './components/HelpModal'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { useTheme } from './hooks/useTheme'
import './App.css'

export default function App() {
  const { theme, toggle } = useTheme()
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <>
      <Navbar theme={theme} onToggleTheme={toggle} onOpenHelp={() => setHelpOpen(true)} />
      <Home onOpenHelp={() => setHelpOpen(true)} />
      <Footer />
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  )
}
