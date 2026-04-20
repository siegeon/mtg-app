// Mock MTG Card Data (Scryfall format)
export interface MtgCard {
  name: string;
  mana_cost: string;
  cmc: number;
  type_line: string;
  oracle_text: string;
  prices: {
    usd: string;
  };
  image_uris: {
    normal: string;
  };
  colors?: string[];
}

export const mockCards: MtgCard[] = [
  {
    name: "Lightning Bolt",
    mana_cost: "{R}",
    cmc: 1,
    type_line: "Instant",
    oracle_text: "Lightning Bolt deals 3 damage to any target.",
    prices: { usd: "1.50" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/f/2/f29ba16f-c8fb-42fe-aabf-87089cb214a7.jpg"
    },
    colors: ["R"]
  },
  {
    name: "Counterspell",
    mana_cost: "{U}{U}",
    cmc: 2,
    type_line: "Instant",
    oracle_text: "Counter target spell.",
    prices: { usd: "2.25" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/1/9/1920dae4-fb92-4f19-ae4b-eb3276b8dac7.jpg"
    },
    colors: ["U"]
  },
  {
    name: "Sol Ring",
    mana_cost: "{1}",
    cmc: 1,
    type_line: "Artifact",
    oracle_text: "{T}: Add {C}{C}.",
    prices: { usd: "3.00" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/5/8/58b26011-e103-45c4-a253-900f4e6b2eeb.jpg"
    },
    colors: []
  },
  {
    name: "Rhystic Study",
    mana_cost: "{2}{U}",
    cmc: 3,
    type_line: "Enchantment",
    oracle_text: "Whenever an opponent casts a spell, you may draw a card unless that player pays {1}.",
    prices: { usd: "15.00" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/d/6/d6914dba-0d27-4055-ac34-b3ebf5802221.jpg"
    },
    colors: ["U"]
  },
  {
    name: "Birds of Paradise",
    mana_cost: "{G}",
    cmc: 1,
    type_line: "Creature — Bird",
    oracle_text: "Flying\n{T}: Add one mana of any color.",
    prices: { usd: "8.50" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/f/e/feefe9f0-24a6-461c-9ef1-86c5a6f33b83.jpg"
    },
    colors: ["G"]
  },
  {
    name: "Black Lotus",
    mana_cost: "{0}",
    cmc: 0,
    type_line: "Artifact",
    oracle_text: "{T}, Sacrifice Black Lotus: Add three mana of any one color.",
    prices: { usd: "30000.00" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg"
    },
    colors: []
  },
  {
    name: "Doom Blade",
    mana_cost: "{1}{B}",
    cmc: 2,
    type_line: "Instant",
    oracle_text: "Destroy target non-black creature.",
    prices: { usd: "0.50" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/9/0/90699423-2556-40f7-b8f5-c9d82f22d52e.jpg"
    },
    colors: ["B"]
  },
  {
    name: "Giant Growth",
    mana_cost: "{G}",
    cmc: 1,
    type_line: "Instant",
    oracle_text: "Target creature gets +3/+3 until end of turn.",
    prices: { usd: "0.25" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/0/6/06ec9e8b-4bd8-4caf-a559-6514b7ab4ca4.jpg"
    },
    colors: ["G"]
  },
  {
    name: "Wrath of God",
    mana_cost: "{2}{W}{W}",
    cmc: 4,
    type_line: "Sorcery",
    oracle_text: "Destroy all creatures. They can't be regenerated.",
    prices: { usd: "4.75" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/6/6/664e6656-36a3-4635-9f33-9f8901afd397.jpg"
    },
    colors: ["W"]
  },
  {
    name: "Nicol Bolas, Planeswalker",
    mana_cost: "{4}{U}{B}{B}{R}",
    cmc: 8,
    type_line: "Legendary Planeswalker — Nicol Bolas",
    oracle_text: "+3: Destroy target noncreature permanent.\n−2: Gain control of target creature.\n−9: Nicol Bolas, Planeswalker deals 7 damage to target player or planeswalker. That player discards seven cards, then sacrifices seven permanents.",
    prices: { usd: "12.00" },
    image_uris: {
      normal: "https://cards.scryfall.io/normal/front/9/e/9e80f2fc-06d4-4ce9-b23b-3e4af1208fa5.jpg"
    },
    colors: ["U", "B", "R"]
  }
];

// Helper to get MTG color for theming
export const getCardColor = (card: MtgCard): 'white' | 'blue' | 'black' | 'red' | 'green' | 'colorless' | 'multicolor' => {
  if (!card.colors || card.colors.length === 0) return 'colorless';
  if (card.colors.length > 1) return 'multicolor';

  const colorMap: Record<string, 'white' | 'blue' | 'black' | 'red' | 'green'> = {
    'W': 'white',
    'U': 'blue',
    'B': 'black',
    'R': 'red',
    'G': 'green'
  };

  return colorMap[card.colors[0]] || 'colorless';
};