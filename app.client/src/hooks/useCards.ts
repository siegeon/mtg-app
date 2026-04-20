import { useQuery } from '@tanstack/react-query';

// API Response types (matching the .NET API)
export interface CardResponse {
  id: string;
  oracleId: string;
  name: string;
  manaCost?: string;
  cmc: number;
  typeLine: string;
  colors: string[];
  rarity: string;
  setCode: string;
  imageUris?: {
    normal?: string;
    small?: string;
  };
  prices?: {
    usd?: string;
  };
  updatedAt: string;
}

export interface SearchResponse {
  cards: CardResponse[];
  total: number;
  query?: string;
  limit: number;
}

// Transform API response to match frontend interface
export interface CollectionCard {
  id: string;
  name: string;
  mana_cost?: string;
  cmc: number;
  type_line: string;
  oracle_text: string; // Will be empty for now since API doesn't provide it
  colors: string[];
  rarity: 'common' | 'uncommon' | 'rare' | 'mythic';
  set_name: string; // Will be empty for now since API doesn't provide it
  set_code: string;
  image_uris: {
    normal: string;
    small: string;
  };
  prices: {
    usd: string;
  };
  quantity: number; // Hardcoded to 1 for now since we don't have collection data
  foil_quantity?: number;
  tags?: string[];
}

// Transform API response to frontend format
const transformCardResponse = (apiCard: CardResponse): CollectionCard => ({
  id: apiCard.id,
  name: apiCard.name,
  mana_cost: apiCard.manaCost || '',
  cmc: apiCard.cmc,
  type_line: apiCard.typeLine,
  oracle_text: '', // Not provided by API yet
  colors: apiCard.colors,
  rarity: (apiCard.rarity.toLowerCase() as CollectionCard['rarity']) || 'common',
  set_name: '', // Not provided by API yet
  set_code: apiCard.setCode,
  image_uris: {
    normal: apiCard.imageUris?.normal || '',
    small: apiCard.imageUris?.small || apiCard.imageUris?.normal || ''
  },
  prices: {
    usd: apiCard.prices?.usd || '0.00'
  },
  quantity: 1, // Default quantity for now
  foil_quantity: 0,
  tags: []
});

// API client functions
const API_BASE_URL = '/api';

async function fetchCards(query?: string, limit: number = 50): Promise<CollectionCard[]> {
  const url = query
    ? `${API_BASE_URL}/cards/search?q=${encodeURIComponent(query)}&limit=${limit}`
    : `${API_BASE_URL}/cards/search?limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch cards: ${response.status}`);
  }

  const data: SearchResponse = await response.json();
  return data.cards.map(transformCardResponse);
}

async function fetchCard(id: string): Promise<CollectionCard> {
  const response = await fetch(`${API_BASE_URL}/cards/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch card: ${response.status}`);
  }

  const data: CardResponse = await response.json();
  return transformCardResponse(data);
}

// React Query hooks
export const useCards = (query?: string, limit: number = 50) => {
  return useQuery({
    queryKey: ['cards', query, limit],
    queryFn: () => fetchCards(query, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
  });
};

export const useCard = (id: string) => {
  return useQuery({
    queryKey: ['cards', id],
    queryFn: () => fetchCard(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!id, // Only fetch if ID is provided
  });
};