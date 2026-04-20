# MTG App Ecosystem — Complete Feature Inventory

*Compiled from research across Moxfield, Archidekt, ManaBox, Dragon Shield, Delver Lens, Deckbox, TappedOut, Aetherhub, Deckstats, MTGGoldfish, EDHREC, Commander Spellbook, Scryfall, Untapped.gg, 17Lands, CubeCobra, SpellTable, MTG Companion (official), Lotus, Moxtopper, and others.*

Every row is something a real competitor actually ships today. Three-column format: **Feature** | **Where it exists** | **Priority for our app**.

Priority key: ⭐⭐⭐ = table stakes, must ship at launch; ⭐⭐ = expected by second wave; ⭐ = nice-to-have / niche; 🔥 = our differentiation opportunity.

## Summary — Priority Totals

| Priority | Count | What this represents |
|---|---|---|
| ⭐⭐⭐ Table stakes | ~75 | Must ship for launch to be credible |
| ⭐⭐ Expected | ~95 | Needed within 6-12 months or users churn |
| ⭐ Nice-to-have | ~35 | Long-tail / niche, year 2+ |
| 🔥 Differentiator | ~30 | Where AI-native gives us leverage |

## Strategic Implications

The ~75 table-stakes features fall into six buckets (card search, deck builder, collection, playtest, pricing, sharing). A well-designed data model means most are the same code paths, not distinct features.

The 🔥 differentiators cluster into 6-8 distinct AI agents: natural-language search, deck critique, collection valuation forecasting, trade scouting, meta prediction, rules judging, binder-page bulk scanning, combo discovery.

### Three standalone hook features nobody has solved:
1. **Binder-page bulk scan** — 9-up or 18-up scan in one shot
2. **Storage-location tracking** — "Where is my Rhystic Study?"
3. **Agentic trade scout** — continuous background agent watching for optimal trades

### What to explicitly NOT build:
- SpellTable competitor (WotC owns it)
- MTG Arena replacement (legally impossible)
- Proxy/print-at-home tools (WotC enforcement risk)
- Judge certification tooling (too niche, WotC territory)
- Betting / gambling features

---

## 1. Card Data & Search

| Feature | Where it exists | Priority |
|---|---|---|
| Full card database, every printing, every language | Scryfall, Moxfield, all | ⭐⭐⭐ |
| Oracle text + printed text (Universes Beyond flavor-text divergence) | Scryfall | ⭐⭐⭐ |
| Scryfall search syntax support | Moxfield, Archidekt, Scryfall | ⭐⭐⭐ |
| Advanced filters — color, CMC, rarity, set, type, keyword, legality | All | ⭐⭐⭐ |
| Legality flags for every format | Moxfield, Archidekt | ⭐⭐⭐ |
| Comprehensive Rules and card-specific rulings | Gatherer, Scryfall | ⭐⭐⭐ |
| Multi-language search | ManaBox, Dragon Shield, Delver | ⭐⭐ |
| Token and emblem database + auto-token-list for decks | Moxfield, Scryfall, Delver | ⭐⭐ |
| Default frame filter | Scryfall | ⭐⭐ |
| Set completion browsing | Deckbox, ManaBox, Dragon Shield | ⭐⭐ |
| Scryfall-style tagger | Scryfall Tagger | ⭐⭐ |
| Historical "what was legal when" lookup | — | 🔥 |
| Semantic / embedding search | — | 🔥 |
| Natural language search | — | 🔥 |

## 2. Deck Building

| Feature | Where it exists | Priority |
|---|---|---|
| Visual drag-and-drop builder | Archidekt, Moxfield | ⭐⭐⭐ |
| Text view with mana symbols and prices | All | ⭐⭐⭐ |
| Spreadsheet view | Archidekt | ⭐⭐ |
| Mainboard / sideboard / maybeboard | Moxfield, Archidekt | ⭐⭐⭐ |
| Custom categories / subcategories | Archidekt, Moxfield | ⭐⭐⭐ |
| Custom tags — global and deck-specific | Moxfield, Deckbox | ⭐⭐⭐ |
| Group by type, color, CMC, rarity, custom tags | Moxfield, Archidekt | ⭐⭐⭐ |
| Sort by name, mana cost, price, rarity, release date | Moxfield | ⭐⭐⭐ |
| Auto-enforced format legality + color identity for Commander | Moxfield | ⭐⭐⭐ |
| Import from file, URL, paste list, Arena/MTGO formats | All | ⭐⭐⭐ |
| Export to Arena, MTGO, plain text, CSV | All | ⭐⭐⭐ |
| Duplicate/fork any public deck | Moxfield, Archidekt | ⭐⭐⭐ |
| Version history of every card change | Moxfield, Archidekt | ⭐⭐⭐ |
| Private, public, unlisted visibility | Moxfield, Archidekt | ⭐⭐⭐ |
| Deck folders and nested folders | Moxfield, Archidekt | ⭐⭐⭐ |
| Switch printing, compare prices across printings | Moxfield, Archidekt | ⭐⭐⭐ |
| Update to cheapest printing | Moxfield, Archidekt | ⭐⭐⭐ |
| Collaboration — multiple editors | Archidekt | ⭐⭐ |
| Packages — reusable card bundles | Moxfield | ⭐⭐ |
| Markdown primer editor | Moxfield | ⭐⭐ |
| Basic land optimizer | Archidekt | ⭐⭐ |
| Keybind shortcuts | Archidekt, Moxfield | ⭐⭐ |
| Conversational deck builder | — | 🔥 |
| AI deck critique with swap reasoning | — | 🔥 |
| Meta-aware deck optimization | — | 🔥 |

## 3. Deck Stats & Analysis

| Feature | Where it exists | Priority |
|---|---|---|
| Mana curve | Moxfield, Archidekt | ⭐⭐⭐ |
| Type breakdown | All | ⭐⭐⭐ |
| Color identity distribution | All | ⭐⭐⭐ |
| Sample hand generator | Moxfield, Archidekt | ⭐⭐⭐ |
| Total deck price across vendors | All | ⭐⭐⭐ |
| Legality validation with explanation | Moxfield, Archidekt | ⭐⭐⭐ |
| Produced vs required mana ratio | Moxfield | ⭐⭐ |
| Hypergeometric draw probability | Delver Lens, Moxfield | ⭐⭐ |
| Salt score | EDHREC, Archidekt | ⭐⭐ |
| Power level estimator | EDHPowerLevel | ⭐⭐ |
| Commander bracket classification | EDHREC | ⭐⭐ |
| Deck comparison tool | Archidekt, Moxfield | ⭐⭐ |
| AI deck health report | — | 🔥 |
| Win condition coverage analysis | — | 🔥 |

## 4. Collection Management

| Feature | Where it exists | Priority |
|---|---|---|
| Multiple binders / lists / folders | ManaBox, Dragon Shield, Deckbox | ⭐⭐⭐ |
| Inventory / Tradelist / Wishlist separation | Deckbox | ⭐⭐⭐ |
| Track quantity, foil/etched variants | All | ⭐⭐⭐ |
| Card condition tracking | ManaBox, Deckbox, Archidekt | ⭐⭐⭐ |
| Language per copy | ManaBox, Dragon Shield | ⭐⭐⭐ |
| Purchase price per copy + acquired date | ManaBox, Dragon Shield | ⭐⭐⭐ |
| Current value vs purchase price P&L | ManaBox, Dragon Shield | ⭐⭐⭐ |
| Bulk import from CSV, TXT, competitor exports | All | ⭐⭐⭐ |
| Bulk edit | ManaBox | ⭐⭐⭐ |
| Missing cards per deck | Deckbox, ManaBox, Archidekt | ⭐⭐⭐ |
| Build with only cards I own mode | Archidekt, Moxfield | ⭐⭐⭐ |
| Sort by multiple criteria | Dragon Shield, ManaBox | ⭐⭐ |
| Aggregate collection statistics | ManaBox, Dragon Shield | ⭐⭐ |
| Physical storage location tracking | — partial | 🔥 |
| AI collection insights | — | 🔥 |

## 5. Card Scanning & Recognition

| Feature | Where it exists | Priority |
|---|---|---|
| Single-card camera scan | ManaBox, Delver, Dragon Shield | ⭐⭐⭐ |
| Multi-card bulk scanning | Delver Lens, ManaBox | ⭐⭐⭐ |
| Foil detection | Most | ⭐⭐⭐ |
| Set auto-detection | Dragon Shield, Delver | ⭐⭐⭐ |
| Works through sleeves | Delver, ManaBox | ⭐⭐⭐ |
| Manual correction of scanned card | All | ⭐⭐⭐ |
| Scanned cards queue | ManaBox | ⭐⭐⭐ |
| Binder-page scan (9-up) | — | 🔥 |
| Shelf/storage-box scan | — | 🔥 |

## 6. Pricing & Market Data

| Feature | Where it exists | Priority |
|---|---|---|
| TCGplayer pricing | All | ⭐⭐⭐ |
| Card Kingdom pricing | All | ⭐⭐⭐ |
| Cardmarket pricing (EU) | All | ⭐⭐⭐ |
| Multiple currency support | Moxfield, ManaBox | ⭐⭐⭐ |
| Foil vs non-foil pricing toggle | All | ⭐⭐⭐ |
| Price history charts | Dragon Shield, MTGGoldfish | ⭐⭐⭐ |
| Price alerts | MTGGoldfish | ⭐⭐⭐ |
| Top movers / gainers and losers | Dragon Shield, MTGGoldfish | ⭐⭐ |
| Portfolio value over time | Dragon Shield, MTGGoldfish | ⭐⭐ |
| Price forecasting with confidence bands | — | 🔥 |
| Sell/hold recommendation | — | 🔥 |

## 7. Trading

| Feature | Where it exists | Priority |
|---|---|---|
| Trade tool: match inventory vs partner wishlist | Deckbox, Dragon Shield | ⭐⭐⭐ |
| Auto-balance trade value | ManaBox, Dragon Shield, Deckbox | ⭐⭐⭐ |
| Trade history / log | Deckbox | ⭐⭐ |
| Trade partner reputation | Deckbox | ⭐⭐ |
| Auto-find trade opportunities | Deckbox | ⭐⭐ |
| Agentic trade scout | — | 🔥 |
| Route optimization for deck completion | — | 🔥 |

## 8. Playtesting / Game Simulation

| Feature | Where it exists | Priority |
|---|---|---|
| Sandbox goldfish mode | Moxfield, Archidekt | ⭐⭐⭐ |
| Drag-and-drop card movement between zones | Moxfield | ⭐⭐⭐ |
| Auto-track life, poison, energy, commander tax | Moxfield | ⭐⭐⭐ |
| Counters on permanents | Moxfield, Archidekt | ⭐⭐⭐ |
| Token creation | Moxfield | ⭐⭐⭐ |
| Library search panel | Archidekt | ⭐⭐⭐ |
| Mulligan tracking | Moxfield | ⭐⭐⭐ |
| Dice roller, coin flip | All | ⭐⭐ |
| Draft simulator | CubeCobra, Draftsim | ⭐⭐ |
| AI coach mode | — | 🔥 |
| Realistic opponent bot | — | 🔥 |

## 9. Analytics, Meta & Recommendations

| Feature | Where it exists | Priority |
|---|---|---|
| Commander recommendations | EDHREC | ⭐⭐⭐ |
| Archetype-aware card suggestions | EDHREC | ⭐⭐⭐ |
| Cards most often played with X | EDHREC | ⭐⭐⭐ |
| Tournament results ingestion | MTGGoldfish, MTGTop8 | ⭐⭐⭐ |
| Metagame breakdown by archetype | MTGGoldfish, Untapped | ⭐⭐⭐ |
| Win-rate data | Untapped, 17Lands | ⭐⭐ |
| Personal deck performance over time | Untapped | ⭐⭐ |
| Limited set stats (GIHWR, ALSA, etc.) | 17Lands | ⭐⭐ |
| Personal meta recommender | — | 🔥 |
| Weekly AI meta digest | — | 🔥 |

## 10. Combo & Synergy Tools

| Feature | Where it exists | Priority |
|---|---|---|
| Combo database | Commander Spellbook | ⭐⭐⭐ |
| Find my combos — paste deck, all combos listed | Commander Spellbook | ⭐⭐⭐ |
| Near-miss combos | Commander Spellbook | ⭐⭐⭐ |
| Combo steps, prerequisites, results | Commander Spellbook | ⭐⭐ |
| AI combo explanation | — | 🔥 |
| Combo discovery | — | 🔥 |

## 11. Rules & Judging

| Feature | Where it exists | Priority |
|---|---|---|
| Full Comprehensive Rules browsable | Magic Judge apps | ⭐⭐ |
| Card-specific rulings | Gatherer, Scryfall | ⭐⭐⭐ |
| Conversational rules judge with comp rules citations | — | 🔥 |
| Stack resolution walkthrough | — | 🔥 |
| Layers explainer | — | 🔥 |

## 12. Life Counter & In-Game Tools

| Feature | Where it exists | Priority |
|---|---|---|
| Life tracking 1v1 up to 10 players | Lotus, Moxtopper | ⭐⭐⭐ |
| Commander damage tracking | Lotus, Moxtopper | ⭐⭐⭐ |
| Partner commander damage | Lotus | ⭐⭐⭐ |
| Custom starting life | All | ⭐⭐⭐ |
| Poison / infect counters | All | ⭐⭐⭐ |
| Energy, experience, storm counters | Lotus | ⭐⭐ |
| Commander tax counter | Lotus, Moxtopper | ⭐⭐ |
| Dice roller (D4-D20) | All | ⭐⭐⭐ |
| High-roll for turn order | Lotus, Moxtopper | ⭐⭐ |
| Match log / life change history | Lotus | ⭐⭐ |
| Life-total graph | Moxtopper | ⭐⭐ |
| Battery-friendly dark mode | All | ⭐⭐⭐ |
| Natural-language rules lookup in-game | — | 🔥 |

## 13-20. Additional Feature Categories

See full inventory for: Tournament & Event Tools, Remote/Webcam Play, Arena/MTGO Tools, Draft & Limited Tools, Social & Community, Content Creator Tools, Integrations & Data, Misc/Power-User features.

---

## MVP Cut Guidance

The right ~40 table-stakes features get you to "competitive with Moxfield for deckbuilding + ManaBox for collection." Phase 1 scope:

1. **Card search** — Scryfall-powered, advanced filters, legality
2. **Deck builder** — visual + text view, mainboard/sideboard, categories, import/export
3. **Deck stats** — mana curve, type breakdown, sample hand, price
4. **Collection** — binders, conditions, bulk import, missing cards
5. **Pricing** — TCGplayer + Card Kingdom, price history
6. **Social** — profiles, public decks, follow/like, comments

Then prototype the 3 wedge features (binder scan, storage tracking, trade scout) before committing to them.
