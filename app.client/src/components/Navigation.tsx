import { Link, useLocation } from 'react-router-dom'
import { Wand2 } from 'lucide-react'

export function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="border-b border-slate-800 backdrop-blur-sm bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Wand2 className="w-8 h-8 text-purple-400" />
            <Link to="/" className="text-2xl font-bold text-white hover:text-purple-300 transition-colors">
              MTG App
            </Link>
          </div>
          <div className="flex space-x-6">
            <Link
              to="/"
              className={`transition-colors ${
                isActive('/') ? 'text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/deck"
              className={`transition-colors ${
                isActive('/deck') ? 'text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Deck Builder
            </Link>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Collection
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}