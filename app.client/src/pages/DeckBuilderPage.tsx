import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';

interface MtgCard {
  id: number;
  name: string;
  manaCost: string;
  type: string;
  imageUrl?: string;
  scryfallId?: string;
}

interface DeckCard {
  scryfallId: string;
  quantity: number;
  card: MtgCard;
}

interface Deck {
  id: number;
  name: string;
  cards: DeckCard[];
}

export function DeckBuilderPage() {
  const [cards, setCards] = useState<MtgCard[]>([]);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Load available cards and test deck
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load available cards
        const cardsResponse = await fetch('/api/cards');
        if (cardsResponse.ok) {
          const cardsData = await cardsResponse.json();
          setCards(cardsData.cards || []);
        }

        // Try to load the seeded test deck (ID 1)
        const deckResponse = await fetch('/api/decks/1');
        if (deckResponse.ok) {
          const deckData = await deckResponse.json();
          setDeck(deckData);
        } else {
          // Create a new deck if none exists
          const createResponse = await fetch('/api/decks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'My Deck',
              format: 'Standard'
            })
          });
          if (createResponse.ok) {
            const newDeck = await createResponse.json();
            setDeck(newDeck);
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Add card to deck
  const handleAddCard = useCallback(async (card: MtgCard) => {
    if (!deck || !card.scryfallId) return;

    try {
      const response = await fetch(`/api/decks/${deck.id}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scryfallId: card.scryfallId,
          quantity: 1,
          isMainboard: true
        })
      });

      if (response.ok) {
        // Refresh deck data
        const deckResponse = await fetch(`/api/decks/${deck.id}`);
        if (deckResponse.ok) {
          const updatedDeck = await deckResponse.json();
          setDeck(updatedDeck);
        }
      }
    } catch (error) {
      console.error('Failed to add card:', error);
    }
  }, [deck]);

  // Filter cards based on search
  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full"></div>
          <p className="text-gray-400 mt-4">Loading deck builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header
        className="border-b border-slate-800 backdrop-blur-sm bg-black/50 sticky top-0 z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-white">Deck Builder</h1>
              {deck && <span className="text-gray-400">— {deck.name}</span>}
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Cards */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">Available Cards</h2>

            {filteredCards.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                {cards.length === 0 ? 'No cards available' : 'No cards match your search'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCards.slice(0, 20).map((card) => (
                  <motion.div
                    key={card.id}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-purple-500 transition-all duration-200 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleAddCard(card)}
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">{card.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                        {card.manaCost || 'X'}
                      </span>
                      <span className="text-gray-400 text-sm">{card.type}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Current Deck */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-6">Current Deck</h2>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              {!deck ? (
                <p className="text-gray-400">No deck loaded</p>
              ) : deck.cards.length === 0 ? (
                <p className="text-gray-400">No cards in deck. Click cards to add them!</p>
              ) : (
                <div className="space-y-3">
                  {deck.cards.map((deckCard, index) => (
                    <div
                      key={`${deckCard.scryfallId}-${index}`}
                      className="flex justify-between items-center text-sm"
                    >
                      <div className="text-white">
                        <span className="font-medium">{deckCard.quantity}x</span>{' '}
                        <span>{deckCard.card?.name || 'Unknown Card'}</span>
                      </div>
                      <span className="text-gray-400">
                        {deckCard.card?.manaCost || 'X'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {deck && (
                <div className="mt-6 pt-4 border-t border-slate-600">
                  <div className="text-sm text-gray-400">
                    <div>Total Cards: {deck.cards.reduce((sum, card) => sum + card.quantity, 0)}</div>
                    <div>Unique Cards: {deck.cards.length}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}