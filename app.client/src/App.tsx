import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { DeckBuilderPage } from './pages/DeckBuilderPage'
import { Navigation } from './components/Navigation'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/deck" element={<DeckBuilderPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
