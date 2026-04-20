import { useState, useEffect } from 'react'
import { Layers as CardIcon, Sparkles, Wand2 } from 'lucide-react'

interface MtgCard {
  id: number
  name: string
  manaCost: string
  type: string
}

function App() {
  const [cards, setCards] = useState<MtgCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // This will connect to our API when it's running
        const response = await fetch('/api/cards')
        if (response.ok) {
          const data = await response.json()
          setCards(data)
        } else {
          // Fallback data for development
          setCards([
            { id: 1, name: 'Lightning Bolt', manaCost: 'R', type: 'Instant' },
            { id: 2, name: 'Counterspell', manaCost: 'UU', type: 'Instant' },
            { id: 3, name: 'Giant Growth', manaCost: 'G', type: 'Instant' }
          ])
        }
      } catch (error) {
        console.log('API not available, using fallback data')
        setCards([
          { id: 1, name: 'Lightning Bolt', manaCost: 'R', type: 'Instant' },
          { id: 2, name: 'Counterspell', manaCost: 'UU', type: 'Instant' },
          { id: 3, name: 'Giant Growth', manaCost: 'G', type: 'Instant' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-800 backdrop-blur-sm bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Wand2 className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">MTG App</h1>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Cards</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Decks</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Collection</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-12 h-12 text-yellow-400" />
            Welcome to MTG App
            <Sparkles className="w-12 h-12 text-yellow-400" />
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your ultimate Magic: The Gathering companion
          </p>
        </div>

        {/* Cards Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <CardIcon className="w-8 h-8 text-blue-400" />
            Featured Cards
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full"></div>
              <p className="text-gray-400 mt-4">Loading cards...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-purple-500 transition-all duration-300 hover:scale-105"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">{card.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {card.manaCost}
                    </span>
                    <span className="text-gray-400">{card.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="text-center py-8 border-t border-slate-800">
          <p className="text-gray-400">
            🎉 MTG App is running! Frontend connected and ready for your magical adventures.
          </p>
        </div>
      </main>
    </div>
  )
}

export default App
