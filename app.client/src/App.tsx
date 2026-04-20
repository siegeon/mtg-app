import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { DeckBuilderPage } from './pages/DeckBuilderPage'
import { DecksViewPage } from './pages/DecksView'
import { CollectionPage } from './pages/CollectionPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { AppShell } from './components/AppShell/AppShell'
import { AppShellProvider, useAppShell } from './contexts/AppShellContext'
import { useEffect } from 'react'

function AppContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const { filterControls, filterChips, resultCounter, clearAll } = useAppShell()

  // Clear AppShell props on route change
  useEffect(() => {
    clearAll()
  }, [location.pathname, clearAll])

  // Derive activeNav from current location
  const getActiveNav = (pathname: string) => {
    if (pathname === '/') return undefined
    if (pathname.startsWith('/decks')) return 'decks'
    if (pathname.startsWith('/deck/')) return 'decks' // deck builder is part of decks section
    if (pathname.startsWith('/collection')) return 'collection'
    if (pathname.startsWith('/cards')) return 'cards'
    if (pathname.startsWith('/scan')) return 'scan'
    if (pathname.startsWith('/storage')) return 'storage'
    if (pathname.startsWith('/trade-scout')) return 'trade-scout'
    if (pathname.startsWith('/prices')) return 'prices'
    return undefined
  }

  const activeNav = getActiveNav(location.pathname)

  // Handle navigation clicks
  const handleNavClick = (navId: string) => {
    const routeMap: Record<string, string> = {
      decks: '/decks',
      collection: '/collection',
      cards: '/cards',
      scan: '/scan',
      storage: '/storage',
      'trade-scout': '/trade-scout',
      prices: '/prices'
    }

    const route = routeMap[navId]
    if (route) {
      navigate(route)
    }
  }

  // Handle primary CTA clicks
  const handleCTAClick = (label: string) => {
    console.log('cta:', label)
  }

  // Get current page title for breadcrumb
  const getCurrentPageTitle = (pathname: string) => {
    if (pathname === '/') return 'Dashboard'
    if (pathname.startsWith('/decks')) return 'Decks'
    if (pathname.startsWith('/deck/')) return 'Deck Builder'
    if (pathname.startsWith('/collection')) return 'Collection'
    if (pathname.startsWith('/cards')) return 'Cards'
    if (pathname.startsWith('/scan')) return 'Scan'
    if (pathname.startsWith('/storage')) return 'Storage'
    if (pathname.startsWith('/trade-scout')) return 'Trade Scout'
    if (pathname.startsWith('/prices')) return 'Prices'
    return 'MTG App'
  }

  return (
    <AppShell
      currentPage={getCurrentPageTitle(location.pathname)}
      activeNav={activeNav}
      onNavClick={handleNavClick}
      onCTAClick={handleCTAClick}
      filterControls={filterControls}
      filterChips={filterChips}
      resultCounter={resultCounter}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/decks" element={<DecksViewPage />} />
        <Route path="/deck/:id" element={<DeckBuilderPage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/cards" element={<PlaceholderPage title="Cards" />} />
        <Route path="/scan" element={<PlaceholderPage title="Scan" />} />
        <Route path="/storage" element={<PlaceholderPage title="Storage" />} />
        <Route path="/trade-scout" element={<PlaceholderPage title="Trade Scout" />} />
        <Route path="/prices" element={<PlaceholderPage title="Prices" />} />
      </Routes>
    </AppShell>
  )
}

function App() {
  return (
    <Router>
      <AppShellProvider>
        <AppContent />
      </AppShellProvider>
    </Router>
  )
}

export default App
