// Mock data for multiple decks in a deck library/collection view

export interface DeckSummary {
  id: string;
  name: string;
  format: 'Commander' | 'Standard' | 'Modern' | 'Legacy' | 'Pioneer' | 'Historic';
  commander?: string;
  totalCards: number;
  totalValue: number;
  lastEdited: string;
  colorIdentity: string[];
  thumbnail?: string;
  description?: string;
}

export const mockDecks: DeckSummary[] = [
  {
    id: '1',
    name: "Atraxa +1/+1 Counters",
    format: 'Commander',
    commander: "Atraxa, Praetors' Voice",
    totalCards: 100,
    totalValue: 450.75,
    lastEdited: '2 days ago',
    colorIdentity: ['W', 'U', 'B', 'G'],
    description: 'Proliferate and counter synergies with value engine.',
    thumbnail: 'https://cards.scryfall.io/normal/front/d/0/d0d33d52-3d28-4635-b985-51e126289259.jpg'
  },
  {
    id: '2',
    name: "Mono-Red Burn",
    format: 'Modern',
    totalCards: 60,
    totalValue: 180.50,
    lastEdited: '4 hours ago',
    colorIdentity: ['R'],
    description: 'Fast aggro deck focused on direct damage.',
    thumbnail: 'https://cards.scryfall.io/normal/front/2/d/2dd5a601-aff0-4d54-a8c0-704cd18ebf35.jpg'
  },
  {
    id: '3',
    name: "Esper Control",
    format: 'Standard',
    totalCards: 60,
    totalValue: 320.25,
    lastEdited: '1 week ago',
    colorIdentity: ['W', 'U', 'B'],
    description: 'Control deck with counterspells and win conditions.',
    thumbnail: 'https://cards.scryfall.io/normal/front/1/9/1920dae4-fb92-4f19-ae4b-eb3276b8dac7.jpg'
  },
  {
    id: '4',
    name: "Meren Reanimator",
    format: 'Commander',
    commander: "Meren of Clan Nel Toth",
    totalCards: 100,
    totalValue: 275.80,
    lastEdited: '3 days ago',
    colorIdentity: ['B', 'G'],
    description: 'Graveyard value engine with powerful ETB effects.',
    thumbnail: 'https://cards.scryfall.io/normal/front/1/7/17d6703c-ad79-457b-a1b5-c2284e363085.jpg'
  },
  {
    id: '5',
    name: "Simic Ramp",
    format: 'Standard',
    totalCards: 60,
    totalValue: 195.40,
    lastEdited: '5 days ago',
    colorIdentity: ['U', 'G'],
    description: 'Ramp into big threats with card advantage.',
    thumbnail: 'https://cards.scryfall.io/normal/front/8/d/8da7c24e-a317-4503-9343-117569934b13.jpg'
  },
  {
    id: '6',
    name: "Eldrazi Tron",
    format: 'Modern',
    totalCards: 60,
    totalValue: 850.90,
    lastEdited: '2 weeks ago',
    colorIdentity: [],
    description: 'Big mana deck with colorless threats.',
    thumbnail: 'https://cards.scryfall.io/normal/front/0/a/0ab4f4a4-6ac6-4cbe-a4fb-d2a668566d59.jpg'
  },
  {
    id: '7',
    name: "Krenko Goblin Tribal",
    format: 'Commander',
    commander: "Krenko, Mob Boss",
    totalCards: 100,
    totalValue: 125.60,
    lastEdited: '1 month ago',
    colorIdentity: ['R'],
    description: 'Explosive goblin tribal with token synergies.',
    thumbnail: 'https://cards.scryfall.io/normal/front/c/d/cd9fec9d-23c8-4d35-97c1-9499527198fb.jpg'
  },
  {
    id: '8',
    name: "Azorius Artifacts",
    format: 'Pioneer',
    totalCards: 60,
    totalValue: 240.30,
    lastEdited: '3 weeks ago',
    colorIdentity: ['W', 'U'],
    description: 'Artifact synergies with efficient removal.',
    thumbnail: 'https://cards.scryfall.io/normal/front/5/8/58b26011-e103-45c4-a253-900f4e6b2eeb.jpg'
  }
];

// Sample cards that might appear in deck previews
export const mockPreviewCards = [
  {
    name: "Lightning Bolt",
    mana_cost: "{R}",
    type_line: "Instant",
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/2/d/2dd5a601-aff0-4d54-a8c0-704cd18ebf35.jpg"
    },
    prices: { usd: "0.25" }
  },
  {
    name: "Counterspell",
    mana_cost: "{U}{U}",
    type_line: "Instant",
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/1/9/1920dae4-fb92-4f19-ae4b-eb3276b8dac7.jpg"
    },
    prices: { usd: "2.25" }
  },
  {
    name: "Sol Ring",
    mana_cost: "{1}",
    type_line: "Artifact",
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/5/8/58b26011-e103-45c4-a253-900f4e6b2eeb.jpg"
    },
    prices: { usd: "3.00" }
  },
  {
    name: "Demonic Tutor",
    mana_cost: "{1}{B}",
    type_line: "Sorcery",
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/3/b/3bdbc231-5316-4abd-9d8d-d87cff2c9847.jpg"
    },
    prices: { usd: "35.00" }
  }
];

// Color identity helper
export const getColorIdentityDisplay = (colors: string[]) => {
  const colorMap: Record<string, string> = {
    'W': '⚪', // White
    'U': '🔵', // Blue
    'B': '⚫', // Black
    'R': '🔴', // Red
    'G': '🟢'  // Green
  };

  if (colors.length === 0) return '◯'; // Colorless
  return colors.map(c => colorMap[c] || c).join('');
};