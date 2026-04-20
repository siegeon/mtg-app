// Mock Deck Data - Moxfield Style
// Represents a complete Commander deck with categorized sections

export interface DeckCard {
  name: string;
  quantity: number;
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
  rarity: 'common' | 'uncommon' | 'rare' | 'mythic';
}

export interface DeckSection {
  title: string;
  cards: DeckCard[];
  totalCards: number;
}

export const mockCommander: DeckCard = {
  name: "Atraxa, Praetors' Voice",
  quantity: 1,
  mana_cost: "{G}{W}{U}{B}",
  cmc: 4,
  type_line: "Legendary Creature — Phyrexian Angel Horror",
  oracle_text: "Flying, vigilance, deathtouch, lifelink. At the beginning of your end step, proliferate.",
  prices: { usd: "15.99" },
  image_uris: {
    normal: "https://cards.scryfall.io/normal/front/d/0/d0d33d52-3d28-4635-b985-51e126289259.jpg"
  },
  colors: ["G", "W", "U", "B"],
  rarity: "mythic"
};

export const mockDeckSections: DeckSection[] = [
  {
    title: "Creatures",
    totalCards: 25,
    cards: [
      {
        name: "Deepglow Skate",
        quantity: 1,
        mana_cost: "{4}{U}{U}",
        cmc: 6,
        type_line: "Creature — Fish",
        oracle_text: "When Deepglow Skate enters the battlefield, double the number of each kind of counter on any number of target permanents.",
        prices: { usd: "8.50" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/4/a/4a8b26dc-de39-4510-9fcf-6cb43372f543.jpg"
        },
        colors: ["U"],
        rarity: "rare"
      },
      {
        name: "Crystalline Crawler",
        quantity: 1,
        mana_cost: "{4}",
        cmc: 4,
        type_line: "Artifact Creature — Construct",
        oracle_text: "Converge — Crystalline Crawler enters the battlefield with a +1/+1 counter on it for each color of mana spent to cast it.",
        prices: { usd: "3.25" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/0/2/02b90a7c-288d-420a-91b2-bd9ced5767e4.jpg"
        },
        colors: [],
        rarity: "rare"
      },
      {
        name: "Vorel of the Hull Clade",
        quantity: 1,
        mana_cost: "{1}{G}{U}",
        cmc: 3,
        type_line: "Legendary Creature — Human Merfolk",
        oracle_text: "{G}{U}, {T}: Double the number of each kind of counter on target artifact, creature, or land.",
        prices: { usd: "2.75" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/4/7/47edde50-81c8-4fe0-ae13-9a10171361bc.jpg"
        },
        colors: ["G", "U"],
        rarity: "rare"
      },
      {
        name: "Forgotten Ancient",
        quantity: 1,
        mana_cost: "{3}{G}",
        cmc: 4,
        type_line: "Creature — Elemental",
        oracle_text: "Whenever a player casts a spell, you may put a +1/+1 counter on Forgotten Ancient.",
        prices: { usd: "1.50" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/c/2/c23e3732-4589-4ea7-8125-a5434861b9f5.jpg"
        },
        colors: ["G"],
        rarity: "uncommon"
      }
    ]
  },
  {
    title: "Planeswalkers",
    totalCards: 6,
    cards: [
      {
        name: "Jace, the Mind Sculptor",
        quantity: 1,
        mana_cost: "{2}{U}{U}",
        cmc: 4,
        type_line: "Legendary Planeswalker — Jace",
        oracle_text: "+2: Look at the top card of target player's library. You may put that card on the bottom of that player's library.",
        prices: { usd: "89.99" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/c/8/c8817585-0d32-4d56-9142-0d29512e7fa6.jpg"
        },
        colors: ["U"],
        rarity: "mythic"
      },
      {
        name: "Vraska, Betrayal's Sting",
        quantity: 1,
        mana_cost: "{4}{B/P}{G/P}",
        cmc: 6,
        type_line: "Legendary Planeswalker — Vraska",
        oracle_text: "Compleated ({B/P}{G/P} can be paid with {B}{G}, 2 life, or one of each.)",
        prices: { usd: "12.50" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/d/6/d6a5fdc3-28db-4b98-9fed-80c6c6aa2b28.jpg"
        },
        colors: ["B", "G"],
        rarity: "mythic"
      }
    ]
  },
  {
    title: "Instants",
    totalCards: 12,
    cards: [
      {
        name: "Counterspell",
        quantity: 1,
        mana_cost: "{U}{U}",
        cmc: 2,
        type_line: "Instant",
        oracle_text: "Counter target spell.",
        prices: { usd: "2.25" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/1/9/1920dae4-fb92-4f19-ae4b-eb3276b8dac7.jpg"
        },
        colors: ["U"],
        rarity: "common"
      },
      {
        name: "Anguished Unmaking",
        quantity: 1,
        mana_cost: "{1}{W}{B}",
        cmc: 3,
        type_line: "Instant",
        oracle_text: "Exile target nonland permanent. You lose 3 life.",
        prices: { usd: "4.75" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/9/0/90ced4fa-6509-4f7a-9da7-efc70de6f90c.jpg"
        },
        colors: ["W", "B"],
        rarity: "rare"
      },
      {
        name: "Fierce Guardianship",
        quantity: 1,
        mana_cost: "{2}{U}",
        cmc: 3,
        type_line: "Instant",
        oracle_text: "If you control a commander, you may cast this spell without paying its mana cost.",
        prices: { usd: "45.00" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/4/c/4c5ffa83-c88d-4f5d-851e-a642b229d596.jpg"
        },
        colors: ["U"],
        rarity: "rare"
      }
    ]
  },
  {
    title: "Sorceries",
    totalCards: 8,
    cards: [
      {
        name: "Kodama's Reach",
        quantity: 1,
        mana_cost: "{2}{G}",
        cmc: 3,
        type_line: "Sorcery — Arcane",
        oracle_text: "Search your library for up to two basic land cards, reveal those cards, put one onto the battlefield tapped and the other into your hand.",
        prices: { usd: "1.25" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/8/d/8da7c24e-a317-4503-9343-117569934b13.jpg"
        },
        colors: ["G"],
        rarity: "common"
      },
      {
        name: "Demonic Tutor",
        quantity: 1,
        mana_cost: "{1}{B}",
        cmc: 2,
        type_line: "Sorcery",
        oracle_text: "Search your library for a card, put that card into your hand, then shuffle.",
        prices: { usd: "35.00" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/3/b/3bdbc231-5316-4abd-9d8d-d87cff2c9847.jpg"
        },
        colors: ["B"],
        rarity: "rare"
      }
    ]
  },
  {
    title: "Artifacts",
    totalCards: 10,
    cards: [
      {
        name: "Sol Ring",
        quantity: 1,
        mana_cost: "{1}",
        cmc: 1,
        type_line: "Artifact",
        oracle_text: "{T}: Add {C}{C}.",
        prices: { usd: "3.00" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/5/8/58b26011-e103-45c4-a253-900f4e6b2eeb.jpg"
        },
        colors: [],
        rarity: "uncommon"
      },
      {
        name: "Astral Cornucopia",
        quantity: 1,
        mana_cost: "{X}{X}{X}",
        cmc: 0,
        type_line: "Artifact",
        oracle_text: "Astral Cornucopia enters the battlefield with X charge counters on it.",
        prices: { usd: "2.50" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/1/8/182864e1-81d9-4948-ae9c-d36651dd7eb2.jpg"
        },
        colors: [],
        rarity: "rare"
      }
    ]
  },
  {
    title: "Enchantments",
    totalCards: 6,
    cards: [
      {
        name: "Doubling Season",
        quantity: 1,
        mana_cost: "{4}{G}",
        cmc: 5,
        type_line: "Enchantment",
        oracle_text: "If an effect would create one or more tokens under your control, it creates twice that many of those tokens instead.",
        prices: { usd: "65.00" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/8/6/8676d164-c76e-402b-a649-6ded3f549b6e.jpg"
        },
        colors: ["G"],
        rarity: "rare"
      },
      {
        name: "Rhystic Study",
        quantity: 1,
        mana_cost: "{2}{U}",
        cmc: 3,
        type_line: "Enchantment",
        oracle_text: "Whenever an opponent casts a spell, you may draw a card unless that player pays {1}.",
        prices: { usd: "25.00" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/d/6/d6914dba-0d27-4055-ac34-b3ebf5802221.jpg"
        },
        colors: ["U"],
        rarity: "common"
      }
    ]
  },
  {
    title: "Lands",
    totalCards: 32,
    cards: [
      {
        name: "Command Tower",
        quantity: 1,
        mana_cost: "",
        cmc: 0,
        type_line: "Land",
        oracle_text: "{T}: Add one mana of any color in your commander's color identity.",
        prices: { usd: "1.00" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/b/5/b53a112c-671c-4312-af56-53fdb735829b.jpg"
        },
        colors: [],
        rarity: "common"
      },
      {
        name: "Breeding Pool",
        quantity: 1,
        mana_cost: "",
        cmc: 0,
        type_line: "Land — Forest Island",
        oracle_text: "({T}: Add {G} or {U}.) As Breeding Pool enters the battlefield, you may pay 2 life. If you don't, it enters the battlefield tapped.",
        prices: { usd: "14.50" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/b/b/bb54233c-0844-4965-9cde-e8a4ef3e11b8.jpg"
        },
        colors: [],
        rarity: "rare"
      },
      {
        name: "Forest",
        quantity: 4,
        mana_cost: "",
        cmc: 0,
        type_line: "Basic Land — Forest",
        oracle_text: "({T}: Add {G}.)",
        prices: { usd: "0.05" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/a/6/a6712361-976a-42fb-8fae-cb90c4f105a8.jpg"
        },
        colors: [],
        rarity: "common"
      },
      {
        name: "Island",
        quantity: 4,
        mana_cost: "",
        cmc: 0,
        type_line: "Basic Land — Island",
        oracle_text: "({T}: Add {U}.)",
        prices: { usd: "0.05" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/1/3/13ba42d7-2b72-4b59-92f0-4c8ebaf4e4b4.jpg"
        },
        colors: [],
        rarity: "common"
      },
      {
        name: "Plains",
        quantity: 2,
        mana_cost: "",
        cmc: 0,
        type_line: "Basic Land — Plains",
        oracle_text: "({T}: Add {W}.)",
        prices: { usd: "0.05" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/f/2/f28e5092-c5ac-4ac5-89a3-8c6f44e3f8c7.jpg"
        },
        colors: [],
        rarity: "common"
      },
      {
        name: "Swamp",
        quantity: 2,
        mana_cost: "",
        cmc: 0,
        type_line: "Basic Land — Swamp",
        oracle_text: "({T}: Add {B}.)",
        prices: { usd: "0.05" },
        image_uris: {
          normal: "https://cards.scryfall.io/normal/front/0/6/06e0edbb-9b85-4eb9-b8d7-9d5a233b0c42.jpg"
        },
        colors: [],
        rarity: "common"
      }
    ]
  }
];

// Calculate deck totals
export const deckTotals = {
  totalCards: mockDeckSections.reduce((sum, section) => sum + section.totalCards, 0) + 1, // +1 for commander
  totalValue: mockDeckSections.reduce((sum, section) =>
    sum + section.cards.reduce((sectionSum, card) =>
      sectionSum + (parseFloat(card.prices.usd) * card.quantity), 0
    ), 0
  ) + parseFloat(mockCommander.prices.usd)
};