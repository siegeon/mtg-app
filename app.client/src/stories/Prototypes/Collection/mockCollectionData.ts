// Mock Collection Data - Moxfield Style
// Represents a user's MTG collection with various cards and quantities

export interface CollectionCard {
  name: string;
  quantity: number;
  mana_cost: string;
  cmc: number;
  type_line: string;
  oracle_text: string;
  set_name: string;
  set: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'mythic';
  prices: {
    usd: string;
  };
  image_uris: {
    normal: string;
  };
  colors?: string[];
  color_identity?: string[];
}

export const mockCollection: CollectionCard[] = [
  // High-value cards
  {
    name: "Black Lotus",
    quantity: 1,
    mana_cost: "{0}",
    cmc: 0,
    type_line: "Artifact",
    oracle_text: "{T}, Sacrifice Black Lotus: Add three mana of any one color.",
    set_name: "Limited Edition Alpha",
    set: "lea",
    rarity: "rare",
    prices: { usd: "15000.00" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg"
    },
    colors: [],
    color_identity: []
  },
  {
    name: "Mox Ruby",
    quantity: 1,
    mana_cost: "{0}",
    cmc: 0,
    type_line: "Artifact",
    oracle_text: "{T}: Add {R}.",
    set_name: "Limited Edition Alpha",
    set: "lea",
    rarity: "rare",
    prices: { usd: "3500.00" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/a/d/ad020b25-6d24-4d35-a0bf-eafe5bad0c5a.jpg"
    },
    colors: [],
    color_identity: ["R"]
  },
  {
    name: "Time Walk",
    quantity: 1,
    mana_cost: "{1}{U}",
    cmc: 2,
    type_line: "Sorcery",
    oracle_text: "Take an extra turn after this one.",
    set_name: "Limited Edition Alpha",
    set: "lea",
    rarity: "rare",
    prices: { usd: "2800.00" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/7/0/70901356-3266-4bd9-aacc-f06c27271de5.jpg"
    },
    colors: ["U"],
    color_identity: ["U"]
  },

  // Modern Staples
  {
    name: "Lightning Bolt",
    quantity: 8,
    mana_cost: "{R}",
    cmc: 1,
    type_line: "Instant",
    oracle_text: "Lightning Bolt deals 3 damage to any target.",
    set_name: "Modern Masters 2017",
    set: "mm3",
    rarity: "common",
    prices: { usd: "1.50" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/f/2/f29ba16f-c8fb-42fe-aabf-87089cb214a7.jpg"
    },
    colors: ["R"],
    color_identity: ["R"]
  },
  {
    name: "Counterspell",
    quantity: 4,
    mana_cost: "{U}{U}",
    cmc: 2,
    type_line: "Instant",
    oracle_text: "Counter target spell.",
    set_name: "Tempest Remastered",
    set: "tpr",
    rarity: "common",
    prices: { usd: "2.25" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/1/9/1920dae4-fb92-4f19-ae4b-eb3276b8dac7.jpg"
    },
    colors: ["U"],
    color_identity: ["U"]
  },
  {
    name: "Sol Ring",
    quantity: 12,
    mana_cost: "{1}",
    cmc: 1,
    type_line: "Artifact",
    oracle_text: "{T}: Add {C}{C}.",
    set_name: "Commander 2021",
    set: "c21",
    rarity: "uncommon",
    prices: { usd: "3.00" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/5/8/58b26011-e103-45c4-a253-900f4e6b2eeb.jpg"
    },
    colors: [],
    color_identity: []
  },

  // Planeswalkers
  {
    name: "Jace, the Mind Sculptor",
    quantity: 2,
    mana_cost: "{2}{U}{U}",
    cmc: 4,
    type_line: "Legendary Planeswalker — Jace",
    oracle_text: "+2: Look at the top card of target player's library. You may put that card on the bottom of that player's library.",
    set_name: "Masters 25",
    set: "a25",
    rarity: "mythic",
    prices: { usd: "89.99" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/c/8/c8817585-0d32-4d56-9142-0d29512e7fa6.jpg"
    },
    colors: ["U"],
    color_identity: ["U"]
  },
  {
    name: "Liliana of the Veil",
    quantity: 1,
    mana_cost: "{1}{B}{B}",
    cmc: 3,
    type_line: "Legendary Planeswalker — Liliana",
    oracle_text: "+1: Each player discards a card.",
    set_name: "Double Masters 2022",
    set: "2x2",
    rarity: "mythic",
    prices: { usd: "45.00" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/e/6/e653437e-2e56-4443-aec5-5bb7d8860238.jpg"
    },
    colors: ["B"],
    color_identity: ["B"]
  },

  // Creatures
  {
    name: "Tarmogoyf",
    quantity: 4,
    mana_cost: "{1}{G}",
    cmc: 2,
    type_line: "Creature — Lhurgoyf",
    oracle_text: "Tarmogoyf's power is equal to the number of different card types among cards in all graveyards and its toughness is equal to that number plus 1.",
    set_name: "Time Spiral Remastered",
    set: "tsr",
    rarity: "rare",
    prices: { usd: "25.00" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/6/9/69daba76-96e8-4bcc-ab79-2f00189ad8fb.jpg"
    },
    colors: ["G"],
    color_identity: ["G"]
  },
  {
    name: "Snapcaster Mage",
    quantity: 3,
    mana_cost: "{1}{U}",
    cmc: 2,
    type_line: "Creature — Human Wizard",
    oracle_text: "Flash. When Snapcaster Mage enters the battlefield, target instant or sorcery card in your graveyard gains flashback until end of turn.",
    set_name: "Time Spiral Remastered",
    set: "tsr",
    rarity: "rare",
    prices: { usd: "18.50" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/7/e/7e41765e-43fe-461d-baeb-ee30d13d2d93.jpg"
    },
    colors: ["U"],
    color_identity: ["U"]
  },

  // Lands
  {
    name: "Polluted Delta",
    quantity: 3,
    mana_cost: "",
    cmc: 0,
    type_line: "Land",
    oracle_text: "{T}, Pay 1 life, Sacrifice Polluted Delta: Search your library for an Island or Swamp card, put it onto the battlefield, then shuffle.",
    set_name: "Khans of Tarkir",
    set: "ktk",
    rarity: "rare",
    prices: { usd: "22.00" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/f/f/ff2f5f58-9a95-4ca6-93a0-813738f0072f.jpg"
    },
    colors: [],
    color_identity: ["U", "B"]
  },
  {
    name: "Scalding Tarn",
    quantity: 4,
    mana_cost: "",
    cmc: 0,
    type_line: "Land",
    oracle_text: "{T}, Pay 1 life, Sacrifice Scalding Tarn: Search your library for an Island or Mountain card, put it onto the battlefield, then shuffle.",
    set_name: "Modern Masters 2017",
    set: "mm3",
    rarity: "rare",
    prices: { usd: "28.00" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/7/1/71e4d64c-4f82-4cec-8aa2-5a90f532d1b5.jpg"
    },
    colors: [],
    color_identity: ["U", "R"]
  },

  // Recent Standard cards
  {
    name: "Teferi, Time Raveler",
    quantity: 2,
    mana_cost: "{1}{W}{U}",
    cmc: 3,
    type_line: "Legendary Planeswalker — Teferi",
    oracle_text: "Each opponent can cast spells only any time they could cast a sorcery.",
    set_name: "War of the Spark",
    set: "war",
    rarity: "rare",
    prices: { usd: "12.00" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/5/c/5cb76266-ae50-4bbc-8f96-d98f309b02d3.jpg"
    },
    colors: ["W", "U"],
    color_identity: ["W", "U"]
  },
  {
    name: "Oko, Thief of Crowns",
    quantity: 1,
    mana_cost: "{1}{G}{U}",
    cmc: 3,
    type_line: "Legendary Planeswalker — Oko",
    oracle_text: "+2: Create a Food token.",
    set_name: "Throne of Eldraine",
    set: "eld",
    rarity: "mythic",
    prices: { usd: "35.00" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/3/4/3462a3d0-5552-49fa-9eb7-100960c55891.jpg"
    },
    colors: ["G", "U"],
    color_identity: ["G", "U"]
  },

  // Budget cards / commons
  {
    name: "Brainstorm",
    quantity: 20,
    mana_cost: "{U}",
    cmc: 1,
    type_line: "Instant",
    oracle_text: "Draw three cards, then put two cards from your hand on top of your library in any order.",
    set_name: "Eternal Masters",
    set: "ema",
    rarity: "common",
    prices: { usd: "0.75" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/e/9/e989a7d4-e889-4bd3-a0b4-4c11a163e7b6.jpg"
    },
    colors: ["U"],
    color_identity: ["U"]
  },
  {
    name: "Dark Ritual",
    quantity: 8,
    mana_cost: "{B}",
    cmc: 1,
    type_line: "Instant",
    oracle_text: "Add {B}{B}{B}.",
    set_name: "Tempest Remastered",
    set: "tpr",
    rarity: "common",
    prices: { usd: "0.50" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/9/5/95f27eeb-6f14-4db3-adb9-9be5ed76b34b.jpg"
    },
    colors: ["B"],
    color_identity: ["B"]
  }
];

// Collection statistics
export const collectionStats = {
  totalCards: mockCollection.reduce((sum, card) => sum + card.quantity, 0),
  uniqueCards: mockCollection.length,
  totalValue: mockCollection.reduce((sum, card) => sum + (parseFloat(card.prices.usd) * card.quantity), 0),
  byRarity: {
    common: mockCollection.filter(card => card.rarity === 'common'),
    uncommon: mockCollection.filter(card => card.rarity === 'uncommon'),
    rare: mockCollection.filter(card => card.rarity === 'rare'),
    mythic: mockCollection.filter(card => card.rarity === 'mythic')
  },
  byColor: {
    white: mockCollection.filter(card => card.colors?.includes('W')),
    blue: mockCollection.filter(card => card.colors?.includes('U')),
    black: mockCollection.filter(card => card.colors?.includes('B')),
    red: mockCollection.filter(card => card.colors?.includes('R')),
    green: mockCollection.filter(card => card.colors?.includes('G')),
    colorless: mockCollection.filter(card => !card.colors?.length || card.colors.length === 0)
  }
};

// Filter options for the collection browser
export const filterOptions = {
  colors: ['W', 'U', 'B', 'R', 'G', 'C'],
  rarities: ['common', 'uncommon', 'rare', 'mythic'],
  types: [
    'Artifact',
    'Creature',
    'Enchantment',
    'Instant',
    'Land',
    'Planeswalker',
    'Sorcery'
  ],
  sets: [...new Set(mockCollection.map(card => card.set_name))].sort(),
  priceRanges: [
    { label: 'Under $1', min: 0, max: 1 },
    { label: '$1 - $5', min: 1, max: 5 },
    { label: '$5 - $20', min: 5, max: 20 },
    { label: '$20 - $100', min: 20, max: 100 },
    { label: 'Over $100', min: 100, max: Infinity }
  ]
};