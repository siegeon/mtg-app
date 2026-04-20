import { useQuery } from '@tanstack/react-query'

// API Response types based on Scryfall schema
export interface CardImageUris {
  small?: string
  normal?: string
  large?: string
  png?: string
  art_crop?: string
  border_crop?: string
}

export interface CardPrices {
  usd?: string
  usd_foil?: string
  eur?: string
  eur_foil?: string
  tix?: string
}

export interface ApiCard {
  id: string
  name: string
  mana_cost?: string
  cmc: number
  type_line: string
  oracle_text?: string
  colors?: string[]
  color_identity?: string[]
  rarity: string
  set_code: string
  collector_number?: string
  image_uris?: CardImageUris
  prices?: CardPrices
  bulk_data_timestamp?: string
}

export interface CardsSearchResponse {
  data?: ApiCard[]
  total_cards?: number
  has_more?: boolean
  next_page?: string
}

export interface CardsSearchParams {
  q?: string
  limit?: number
  page?: number
}

// Convert API card to Collection card format
export interface CollectionCard {
  id: string
  name: string
  mana_cost?: string
  cmc: number
  type_line: string
  oracle_text: string
  colors: string[]
  color_identity: string[]
  rarity: string
  set_code: string
  collector_number?: string
  image_uris: CardImageUris
  prices: { usd: string }
  quantity: number
  foil_quantity?: number
}

const convertApiCardToCollectionCard = (apiCard: ApiCard): CollectionCard => ({
  id: apiCard.id,
  name: apiCard.name,
  mana_cost: apiCard.mana_cost,
  cmc: apiCard.cmc,
  type_line: apiCard.type_line,
  oracle_text: apiCard.oracle_text || '',
  colors: apiCard.colors || [],
  color_identity: apiCard.color_identity || [],
  rarity: apiCard.rarity,
  set_code: apiCard.set_code,
  collector_number: apiCard.collector_number,
  image_uris: apiCard.image_uris || {},
  prices: { usd: apiCard.prices?.usd || '0.00' },
  quantity: 1, // Default for search results
  foil_quantity: 0
})

export const useCardsSearch = (params: CardsSearchParams) => {
  return useQuery({
    queryKey: ['cards', 'search', params],
    queryFn: async (): Promise<CollectionCard[]> => {
      const searchParams = new URLSearchParams()

      if (params.q) searchParams.append('q', params.q)
      if (params.limit) searchParams.append('limit', params.limit.toString())
      if (params.page) searchParams.append('page', params.page.toString())

      const response = await fetch(`/api/cards/search?${searchParams}`)

      if (!response.ok) {
        // For development, return empty array on API errors
        // This allows frontend development to continue
        console.warn('API unavailable, using empty results:', response.status, response.statusText)
        return []
      }

      const data: CardsSearchResponse = await response.json()
      return data.data?.map(convertApiCardToCollectionCard) || []
    },
    retry: 1, // Only retry once for API calls
    enabled: Boolean(params.q), // Only run query if we have a search term
  })
}

// Hook for getting a default collection (when no search term)
export const useDefaultCollection = () => {
  return useQuery({
    queryKey: ['cards', 'default'],
    queryFn: async (): Promise<CollectionCard[]> => {
      // Try to get some default cards, fallback to empty array
      const response = await fetch('/api/cards/search?q=&limit=24')

      if (!response.ok) {
        console.warn('API unavailable for default collection')
        return []
      }

      const data: CardsSearchResponse = await response.json()
      return data.data?.map(convertApiCardToCollectionCard) || []
    },
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes for default collection
  })
}