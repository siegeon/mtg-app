// Mock data for card collection view

export interface CollectionCard {
  id: string;
  name: string;
  mana_cost: string;
  cmc: number;
  type_line: string;
  oracle_text: string;
  colors: string[];
  rarity: 'common' | 'uncommon' | 'rare' | 'mythic';
  set_name: string;
  set_code: string;
  image_uris: {
    normal: string;
    small: string;
  };
  prices: {
    usd: string;
  };
  quantity: number;
  foil_quantity?: number;
  tags?: string[];
}

export interface FilterOption {
  id: string;
  label: string;
  count: number;
  color?: string;
}

export const mockCollection: CollectionCard[] = [
  {
    id: '1',
    name: "Lightning Bolt",
    mana_cost: "{R}",
    cmc: 1,
    type_line: "Instant",
    oracle_text: "Lightning Bolt deals 3 damage to any target.",
    colors: ["R"],
    rarity: "common",
    set_name: "Modern Masters 2017",
    set_code: "MM3",
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/2/d/2dd5a601-aff0-4d54-a8c0-704cd18ebf35.jpg",
      small: "https://cards.scryfall.io/small/front/2/d/2dd5a601-aff0-4d54-a8c0-704cd18ebf35.jpg"
    },
    prices: { usd: "0.25" },
    quantity: 4,
    tags: ["burn", "removal", "instant"]
  },
  {
    id: '2',
    name: "Counterspell",
    mana_cost: "{U}{U}",
    cmc: 2,
    type_line: "Instant",
    oracle_text: "Counter target spell.",
    colors: ["U"],
    rarity: "common",
    set_name: "Masters 25",
    set_code: "A25",
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/1/9/1920dae4-fb92-4f19-ae4b-eb3276b8dac7.jpg",
      small: "https://cards.scryfall.io/small/front/1/9/1920dae4-fb92-4f19-ae4b-eb3276b8dac7.jpg"
    },
    prices: { usd: "2.25" },
    quantity: 2,
    tags: ["control", "counter", "instant"]
  },
  {
    id: '3',
    name: "Sol Ring",
    mana_cost: "{1}",
    cmc: 1,
    type_line: "Artifact",
    oracle_text: "{T}: Add {C}{C}.",
    colors: [],
    rarity: "uncommon",
    set_name: "Commander 2021",
    set_code: "C21",
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/5/8/58b26011-e103-45c4-a253-900f4e6b2eeb.jpg",
      small: "https://cards.scryfall.io/small/front/5/8/58b26011-e103-45c4-a253-900f4e6b2eeb.jpg"
    },
    prices: { usd: "3.00" },
    quantity: 3,
    tags: ["ramp", "artifact", "commander"]
  },
  {
    id: '4',
    name: "Jace, the Mind Sculptor",
    mana_cost: "{2}{U}{U}",
    cmc: 4,
    type_line: "Legendary Planeswalker — Jace",
    oracle_text: "+2: Look at the top card of target player's library. You may put that card on the bottom of that player's library.\n+0: Draw three cards, then put two cards from your hand on top of your library in any order.\n-1: Return target creature to its owner's hand.\n-12: Exile all cards from target player's library, then that player shuffles their hand into their library.",
    colors: ["U"],
    rarity: "mythic",
    set_name: "Masters 25",
    set_code: "A25",
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/c/8/c8817585-0d32-4d56-9142-0d29512e7fa6.jpg",
      small: "https://cards.scryfall.io/small/front/c/8/c8817585-0d32-4d56-9142-0d29512e7fa6.jpg"
    },
    prices: { usd: "89.99" },
    quantity: 1,
    foil_quantity: 1,
    tags: ["planeswalker", "control", "expensive"]
  },
  {
    id: '5',
    name: "Demonic Tutor",
    mana_cost: "{1}{B}",
    cmc: 2,
    type_line: "Sorcery",
    oracle_text: "Search your library for a card, put that card into your hand, then shuffle.",
    colors: ["B"],
    rarity: "rare",
    set_name: "Vintage Masters",
    set_code: "VMA",
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/3/b/3bdbc231-5316-4abd-9d8d-d87cff2c9847.jpg",
      small: "https://cards.scryfall.io/small/front/3/b/3bdbc231-5316-4abd-9d8d-d87cff2c9847.jpg"
    },
    prices: { usd: "35.00" },
    quantity: 1,
    tags: ["tutor", "sorcery", "expensive"]
  },
  {
    id: '6',
    name: "Path to Exile",
    mana_cost: "{W}",
    cmc: 1,
    type_line: "Instant",
    oracle_text: "Exile target creature. Its controller may search their library for a basic land card, put that card onto the battlefield tapped, then shuffle.",
    colors: ["W"],
    rarity: "uncommon",
    set_name: "Modern Masters 2017",
    set_code: "MM3",
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/2/e/2e3dddd5-0ad7-4cc0-7a93-2179a3da12b5.jpg",
      small: "https://cards.scryfall.io/small/front/2/e/2e3dddd5-0ad7-4cc0-7a93-2179a3da12b5.jpg"
    },
    prices: { usd: "4.50" },
    quantity: 4,
    tags: ["removal", "exile", "white"]
  },
  {
    id: '7',
    name: "Llanowar Elves",
    mana_cost: "{G}",
    cmc: 1,
    type_line: "Creature — Elf Druid",
    oracle_text: "{T}: Add {G}.",
    colors: ["G"],
    rarity: "common",
    set_name: "Dominaria",
    set_code: "DOM",
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/7/3/73542493-cd0b-4bb7-a5b8-8f889c76e4d6.jpg",
      small: "https://cards.scryfall.io/small/front/7/3/73542493-cd0b-4bb7-a5b8-8f889c76e4d6.jpg"
    },
    prices: { usd: "0.15" },
    quantity: 4,
    tags: ["creature", "elf", "ramp"]
  },
  {
    id: '8',
    name: "Doubling Season",
    mana_cost: "{4}{G}",
    cmc: 5,
    type_line: "Enchantment",
    oracle_text: "If an effect would create one or more tokens under your control, it creates twice that many of those tokens instead.\nIf an effect would put one or more counters on a permanent you control, it puts twice that many of those counters on that permanent instead.",
    colors: ["G"],
    rarity: "rare",
    set_name: "Battlebond",
    set_code: "BBD",
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/8/6/8676d164-c76e-402b-a649-6ded3f549b6e.jpg",
      small: "https://cards.scryfall.io/small/front/8/6/8676d164-c76e-402b-a649-6ded3f549b6e.jpg"
    },
    prices: { usd: "65.00" },
    quantity: 1,
    tags: ["enchantment", "token", "expensive"]
  },
  {
    id: '9',
    name: "Mana Crypt",
    mana_cost: "{0}",
    cmc: 0,
    type_line: "Artifact",
    oracle_text: "At the beginning of your upkeep, flip a coin. If you lose the flip, Mana Crypt deals 3 damage to you.\n{T}: Add {C}{C}.",
    colors: [],
    rarity: "mythic",
    set_name: "Eternal Masters",
    set_code: "EMA",
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/4/b/4b677673-f81d-4454-9f78-fbbf15f87806.jpg",
      small: "https://cards.scryfall.io/small/front/4/b/4b677673-f81d-4454-9f78-fbbf15f87806.jpg"
    },
    prices: { usd: "150.00" },
    quantity: 1,
    tags: ["artifact", "ramp", "expensive", "vintage"]
  },
  {
    id: '10',
    name: "Birds of Paradise",
    mana_cost: "{G}",
    cmc: 1,
    type_line: "Creature — Bird",
    oracle_text: "Flying\n{T}: Add one mana of any color.",
    colors: ["G"],
    rarity: "rare",
    set_name: "Ravnica Allegiance",
    set_code: "RNA",
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/f/e/feefe9f0-24a6-461c-9ef1-86c5a6f33b83.jpg",
      small: "https://cards.scryfall.io/small/front/f/e/feefe9f0-24a6-461c-9ef1-86c5a6f33b83.jpg"
    },
    prices: { usd: "8.50" },
    quantity: 2,
    tags: ["creature", "bird", "ramp", "flying"]
  },
  {
    id: '11',
    name: "Black Lotus",
    mana_cost: "{0}",
    cmc: 0,
    type_line: "Artifact",
    oracle_text: "{T}, Sacrifice Black Lotus: Add three mana of any one color.",
    colors: [],
    rarity: "rare",
    set_name: "Limited Edition Alpha",
    set_code: "LEA",
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg",
      small: "https://cards.scryfall.io/small/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg"
    },
    prices: { usd: "25000.00" },
    quantity: 1,
    tags: ["power-nine", "artifact", "vintage", "legendary"]
  },
  {
    id: '12',
    name: "Tarmogoyf",
    mana_cost: "{1}{G}",
    cmc: 2,
    type_line: "Creature — Lhurgoyf",
    oracle_text: "Tarmogoyf's power is equal to the number of card types among cards in all graveyards and its toughness is equal to that number plus 1.",
    colors: ["G"],
    rarity: "rare",
    set_name: "Modern Masters 2017",
    set_code: "MM3",
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/4/2/42e56220-81c3-4440-9f97-8616d630a8ee.jpg",
      small: "https://cards.scryfall.io/small/front/4/2/42e56220-81c3-4440-9f97-8616d630a8ee.jpg"
    },
    prices: { usd: "45.00" },
    quantity: 4,
    tags: ["creature", "goyf", "modern", "expensive"]
  }
];

// Add more cards to reach 20+ total
for (let i = 13; i <= 25; i++) {
  const colors = [['W'], ['U'], ['B'], ['R'], ['G'], [], ['W', 'U'], ['B', 'R']][i % 8];
  const rarities: CollectionCard['rarity'][] = ['common', 'uncommon', 'rare', 'mythic'];

  mockCollection.push({
    id: i.toString(),
    name: `Sample Card ${i}`,
    mana_cost: i % 2 === 0 ? `{${i % 5}}` : `{${Math.floor(i/3)}}{${colors[0] || 'C'}}`,
    cmc: Math.floor(i / 2),
    type_line: i % 3 === 0 ? "Creature — Human Wizard" : i % 3 === 1 ? "Instant" : "Sorcery",
    oracle_text: `Sample card text for demonstration purposes.`,
    colors: colors as string[],
    rarity: rarities[i % 4],
    set_name: "Sample Set",
    set_code: "SAM",
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/5/8/58b26011-e103-45c4-a253-900f4e6b2eeb.jpg",
      small: "https://cards.scryfall.io/small/front/5/8/58b26011-e103-45c4-a253-900f4e6b2eeb.jpg"
    },
    prices: { usd: (Math.random() * 20 + 1).toFixed(2) },
    quantity: Math.floor(Math.random() * 4) + 1,
    tags: ["sample", "demo"]
  });
}

export const filterOptions: FilterOption[] = [
  { id: 'all', label: 'All Cards', count: mockCollection.length },
  { id: 'white', label: 'White', count: mockCollection.filter(c => c.colors.includes('W')).length, color: '#fffbd5' },
  { id: 'blue', label: 'Blue', count: mockCollection.filter(c => c.colors.includes('U')).length, color: '#0e68ab' },
  { id: 'black', label: 'Black', count: mockCollection.filter(c => c.colors.includes('B')).length, color: '#150b00' },
  { id: 'red', label: 'Red', count: mockCollection.filter(c => c.colors.includes('R')).length, color: '#d3202a' },
  { id: 'green', label: 'Green', count: mockCollection.filter(c => c.colors.includes('G')).length, color: '#00733e' },
  { id: 'colorless', label: 'Colorless', count: mockCollection.filter(c => c.colors.length === 0).length, color: '#ccc2c0' },
  { id: 'common', label: 'Common', count: mockCollection.filter(c => c.rarity === 'common').length },
  { id: 'uncommon', label: 'Uncommon', count: mockCollection.filter(c => c.rarity === 'uncommon').length },
  { id: 'rare', label: 'Rare', count: mockCollection.filter(c => c.rarity === 'rare').length },
  { id: 'mythic', label: 'Mythic', count: mockCollection.filter(c => c.rarity === 'mythic').length },
  { id: 'expensive', label: '$50+', count: mockCollection.filter(c => parseFloat(c.prices.usd) >= 50).length },
];

export const getRarityColor = (rarity: CollectionCard['rarity']) => {
  switch (rarity) {
    case 'common': return '#ffffff';
    case 'uncommon': return '#c0c0c0';
    case 'rare': return '#ffd700';
    case 'mythic': return '#ff8c00';
    default: return '#ffffff';
  }
};

export const filterCollection = (cards: CollectionCard[], activeFilters: string[]): CollectionCard[] => {
  if (activeFilters.includes('all') || activeFilters.length === 0) {
    return cards;
  }

  return cards.filter(card => {
    return activeFilters.some(filter => {
      switch (filter) {
        case 'white': return card.colors.includes('W');
        case 'blue': return card.colors.includes('U');
        case 'black': return card.colors.includes('B');
        case 'red': return card.colors.includes('R');
        case 'green': return card.colors.includes('G');
        case 'colorless': return card.colors.length === 0;
        case 'common':
        case 'uncommon':
        case 'rare':
        case 'mythic':
          return card.rarity === filter;
        case 'expensive':
          return parseFloat(card.prices.usd) >= 50;
        default:
          return false;
      }
    });
  });
};