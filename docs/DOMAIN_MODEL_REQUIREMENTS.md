# MTG App Core Domain Model — Business Requirements

**Document Type:** Product Discovery Requirements  
**Created:** 2026-04-19  
**Author:** Product Discovery Agent  
**For:** CTO Technical Design (next phase)  
**Status:** Draft for Review

## Executive Summary

This document defines business requirements for the 8 core domain entities that underpin all ~230 features in the MTG App ecosystem. These requirements inform the technical design phase and establish key business rules before implementation.

**Core Design Principle:** Support competitive parity with Moxfield (deckbuilding) + ManaBox (collection) at launch, with differentiation through AI-native features (binder scan, storage tracking, trade scout).

---

## 1. Card vs Printing Entity Separation

### Business Context
Magic cards have a fundamental duality: **Oracle identity** (the abstract game piece) vs **Physical variants** (specific printings with different art, foil treatments, languages).

### Requirements

#### Card (Oracle Identity)
- **Definition:** The abstract game object with consistent rules text
- **Key Attributes:**
  - Oracle name (canonical identifier)
  - Current oracle text (updated for functional errata)
  - Mana cost, type line, power/toughness
  - Color identity (for Commander format)
  - Keywords and mechanics
  - Legality status per format
- **Scryfall Mapping:** Maps to `oracle_id` in Scryfall API
- **Business Rule:** One Card entity can have many Printing entities

#### Printing (Physical Variant)
- **Definition:** A specific physical manifestation of a card
- **Key Attributes:**
  - Set code and collector number
  - Artist and artwork variant
  - Foil/etched/textured treatment
  - Frame style (retro, extended art, borderless)
  - Language and translated name
  - Original printed text (for flavor/collectibility)
  - Release date
  - Rarity in this set
- **Scryfall Mapping:** Maps to individual card objects with unique `id`
- **Business Rule:** Each Printing belongs to exactly one Card (oracle identity)

### Key Business Decisions

1. **Search Strategy:** Users search by oracle name but can filter by printing attributes (set, foil, language)
2. **Deck Building:** Decks reference Cards (oracle identity) but track preferred Printing for each slot
3. **Collection:** Collections track Printings (physical copies) with quantities per variant
4. **Pricing:** Prices are per Printing (foil 1st edition costs more than non-foil reprint)

---

## 2. Deck Management

### Business Context
Decks are the primary creative artifact. Users spend significant time organizing, versioning, and sharing deck ideas.

### Requirements

#### Core Deck Structure
- **Zones:**
  - Mainboard (60/100 cards depending on format)
  - Sideboard (0-15 cards for competitive formats)
  - Maybeboard (unlimited consideration pile)
  - Command zone (Commander, companion, etc.)

#### Custom Organization
- **Custom Categories:** Users create arbitrary groupings within mainboard
  - Examples: "Ramp", "Removal", "Win Cons", "Politics"
  - Business Rule: Categories are deck-specific, not global
- **Tags:** Both deck-wide tags and per-card tags
  - Deck tags: "Budget", "Competitive", "Casual", "Work in Progress"
  - Card tags: "Remove if meta shifts", "Flex slot", "Never cut"

#### Versioning Strategy
**Business Decision Required:** Granularity of change tracking

**Option A: Full History (Moxfield style)**
- Track every individual card add/remove as a timestamped change
- Allows rollback to any historical state
- Supports "compare two versions" feature
- Storage cost: High but acceptable for user value

**Option B: Snapshot Versioning**
- User manually creates named snapshots ("V1.0 Pre-Tournament", "Post-meta adjustment")
- Only stores user-initiated save points
- Storage cost: Low but may miss important incremental changes

**Recommendation: Option A (Full History)**
- Deck versioning is a key differentiator in the space
- Users frequently want to see "what did I change after last FNM"
- Storage cost is manageable (text data, not images)

#### Deck Visibility & Sharing
- **Private:** Only deck owner can view
- **Unlisted:** Viewable by direct link only
- **Public:** Listed in user profile and searchable
- **Friends Only:** Viewable by followed users only
- **Business Rule:** Deck primer/description supports markdown formatting

#### Import/Export Requirements
**Must support formats:**
- Arena decklist format (.txt)
- MTGO decklist format (.dek)
- Plain text (name + quantity)
- CSV with metadata
- Competitor formats (Moxfield, Archidekt URLs)

**Export requirements:**
- All above formats plus
- Proxy sheet generation (9-card sheets for testing)
- Shopping cart format (TCGplayer mass entry)

---

## 3. Collection/Binder Management

### Business Context
Collection tracking is complex due to physical variants, condition tracking, and financial portfolio requirements.

### Requirements

#### Inventory Organization
- **Multiple Binders/Lists:** Users maintain separate collections
  - "Collection" (owned cards)
  - "Tradelist" (available for trade)
  - "Wishlist" (want to acquire)
  - Custom binders (themed collections, sets to complete)

#### Per-Copy Tracking
Each copy in collection requires:
- **Printing variant** (set, foil, language)
- **Condition** (NM, LP, MP, HP, DMG following TCGplayer standards)
- **Quantity** (multiple copies of same printing+condition)
- **Purchase price** and acquisition date
- **Source** (pulled from pack, purchased, traded)
- **Notes** (free text for special circumstances)

#### Physical Storage Location
**Major Differentiation Opportunity**
- **Location hierarchy:** Room → Shelf → Binder → Page → Slot
- **Examples:** 
  - "Office → Bookshelf → Red Binder → Page 12 → Top-left"
  - "Bedroom → Desk Drawer → Modern Staples Box"
- **Search capability:** "Where is my Rhystic Study?"
- **Move tracking:** Log when cards change locations

#### P&L Reporting Requirements
**Financial tracking for collection investment:**
- **Total collection value** (purchase price vs current market)
- **Per-card P&L** (unrealized gain/loss)
- **Set completion tracking** with remaining cost
- **Portfolio diversification** (how much value in Reserved List vs reprints)
- **Tax reporting** support for sales/trades

### Key Business Decisions

1. **Condition Granularity:** Use TCGplayer condition standards for consistency with pricing data
2. **Location Tracking:** Implement as optional feature with flexible hierarchy (not enforced structure)
3. **Purchase Price:** Required field with $0 default for "unknown" historical acquisitions
4. **Bulk Operations:** Critical for usability — bulk condition updates, bulk moves, bulk pricing

---

## 4. User & Social Features

### Business Context
MTG is inherently social. The app must balance content discovery with user privacy preferences.

### Requirements

#### User Profiles
- **Display name** (can differ from login username)
- **Avatar** (uploaded image or default)
- **Bio** (markdown-formatted)
- **Preferred formats** (Commander, Modern, Standard, etc.)
- **Location** (optional, for local playgroup discovery)
- **Social links** (Twitter, Discord, etc.)

#### Privacy Controls
- **Profile visibility:** Public, Friends Only, Private
- **Deck visibility defaults:** What new decks default to
- **Collection visibility:** Whether binders are viewable by others
- **Activity feed:** Whether deck updates appear in followers' feeds

#### Social Interactions
- **Following/Followers:** Asymmetric follow model (like Twitter)
- **Deck interactions:** Like, comment, fork (duplicate with attribution)
- **Activity feed:** Recent deck updates from followed users
- **Playgroup support:** Private groups with shared decklists

### Key Business Decisions

1. **Real Name Policy:** Not required — display names sufficient for MTG community
2. **Content Moderation:** Community reporting + admin review for inappropriate content
3. **Data Export:** Users can export all their data (decks, collection) per privacy regulations

---

## 5. Pricing & Market Data

### Business Context
Pricing data drives purchasing decisions and collection valuations. Multiple vendors required for completeness.

### Requirements

#### Multi-Vendor Price Aggregation
**Primary Sources:**
- **TCGplayer** (US primary market)
- **Card Kingdom** (US, reliable stock)
- **Cardmarket** (European primary market)

**Price Types per Printing:**
- Market price (current median)
- Low price (cheapest available with shipping)
- Foil premium percentage
- Historical price (daily snapshots for trending)

#### Price History & Analytics
- **Daily price snapshots** for trending analysis
- **Price change percentages** (24h, 7d, 30d, 1y)
- **Volatility indicators** (how stable is this price)
- **Price alerts:** User-defined thresholds for specific printings

#### Market Intelligence Features
- **Top movers:** Biggest gainers/losers today
- **Format impact tracking:** Price changes correlating with tournament results
- **Reprint impact:** Price drops when cards are reprinted in new sets
- **Reserved List premium:** Special tracking for never-to-be-reprinted cards

### Key Business Decisions

1. **Price Refresh Frequency:** Daily for most cards, hourly for high-volatility cards during events
2. **Currency Support:** USD primary, EUR secondary, other currencies by exchange rate
3. **Shipping Costs:** Include estimated shipping in total cost calculations
4. **Data Licensing:** All vendor relationships must allow this usage pattern

---

## 6. Format & Legality System

### Business Context
MTG has 15+ official formats plus countless community variants. Legality changes frequently.

### Requirements

#### Format Definitions
**Core Formats (must support at launch):**
- **Standard:** Most recent 2 years of sets, rotates annually
- **Pioneer:** Cards from Return to Ravnica forward
- **Modern:** Cards from 8th Edition/Mirrodin forward
- **Legacy:** All cards except ante/dexterity/silver-border
- **Vintage:** All cards, with restricted list
- **Commander (EDH):** 100-card singleton with commander restrictions
- **Pauper:** Common-rarity only
- **Historic:** Arena format including rebalanced cards

#### Legality Tracking
- **Per-card legality status:** Legal, Banned, Restricted per format
- **Effective dates:** When bans/restrictions take effect
- **Rotation tracking:** Advance notice of Standard rotation
- **Rebalanced cards:** Arena-specific text changes

#### Format-Specific Rules
**Commander-specific requirements:**
- **Color identity enforcement:** Deck can only contain cards matching commander colors
- **Singleton enforcement:** No more than 1 copy except basic lands
- **Commander damage tracking:** 21 damage from any single commander
- **Partner mechanics:** Multiple commanders when both have Partner

### Key Business Decisions

1. **Update Frequency:** Check for format changes weekly (WotC B&R announcements)
2. **Historical Legality:** Track what was legal when for historical analysis
3. **Community Formats:** Support major community formats (Canadian Highlander, etc.)
4. **Arena Integration:** Separate tracking for Arena-specific rebalanced versions

---

## 7. Combo & Synergy Discovery

### Business Context
MTG has thousands of card interactions. Players want both known combos and synergy discovery.

### Requirements

#### Combo Database Integration
- **Commander Spellbook API:** Existing database of known infinite combos
- **Combo Components:** Which cards are required for each combo
- **Prerequisites:** What setup is needed (specific permanents, mana, etc.)
- **Results:** What the combo achieves (infinite mana, infinite damage, etc.)

#### Deck Combo Analysis
- **Find My Combos:** Parse submitted deck, identify all possible combos
- **Near-Miss Combos:** "Add 1-2 cards to enable combo X"
- **Combo Disruption:** Which removal spells break which combos

#### AI-Powered Synergy Discovery
**Differentiation Opportunity**
- **Semantic card matching:** AI finds cards that work well together
- **Archetype-aware suggestions:** Recommendations based on deck theme
- **Meta-aware combos:** Combos that are strong in current competitive meta

### Key Business Decisions

1. **Combo Definition:** Focus on infinite combos first, synergistic interactions second
2. **AI Integration:** Use embeddings to find subtle card synergies beyond rules text
3. **Community Contributions:** Allow users to submit new combo discoveries
4. **Competitive Focus:** Prioritize combos viable in tournament play

---

## 8. Trading System

### Business Context
Card trading is a core MTG community activity. Digital tools can make this much more efficient.

### Requirements

#### Trade Infrastructure
- **Tradelist Management:** Cards available for trade with desired quantities
- **Wishlist Management:** Cards wanted with priority levels
- **Trade Matching:** Algorithm to find mutually beneficial trades
- **Value Balancing:** Automatic price equalization with cash/credit differences

#### Trade Execution
- **Trade Proposals:** Send trade offers with expiration dates
- **Counter-Offers:** Negotiate by modifying proposed trades
- **Trade History:** Complete log of all completed trades
- **Partner Ratings:** Reputation system for trading partners

#### Advanced Trading Features
**Major Differentiation Opportunity**
- **Agentic Trade Scout:** AI agent continuously monitoring for optimal trades
- **Deck Completion Routes:** "To finish this deck, trade with user A for cards X, then user B for cards Y"
- **Market Efficiency:** Identify trades where both parties benefit vs buying from stores

### Key Business Decisions

1. **Transaction Facilitation:** App facilitates discovery only, not shipping/payment
2. **Verification System:** Photo verification for high-value trades
3. **Dispute Resolution:** Community-based mediation for trade disputes
4. **Geographic Matching:** Prefer local trades to reduce shipping costs

---

## Cross-Entity Relationships

### Primary Relationships
```
User 1--* Collection
User 1--* Deck
User 1--* Tradelist
User 1--* Wishlist
User M--M User (following)

Deck 1--* DeckCard
DeckCard *--1 Card (oracle)
DeckCard *--1 Printing (preferred variant)

Collection 1--* CollectionItem
CollectionItem *--1 Printing
CollectionItem *--1 Location

Card 1--* Printing
Card 1--* Legality (per format)
Card M--M Combo

Price *--1 Printing
Price *--1 Vendor
```

### Critical Business Rules

1. **Deck-Collection Integration:** "Missing cards" feature requires linking DeckCard to CollectionItem
2. **Price-Printing Relationship:** Every printing can have multiple prices (per vendor, per condition)
3. **Location Hierarchy:** Flexible nesting allows both simple ("Red Binder") and complex ("Office → Shelf → Binder → Page") storage tracking
4. **Trade Value Calculations:** Must account for condition differences and shipping costs

---

## Success Metrics

### Launch Criteria (Table Stakes)
- Support 40+ core features from FEATURE_INVENTORY.md
- Competitive parity with Moxfield (deckbuilding) + ManaBox (collection)
- All 8 core entities implemented with basic CRUD operations

### Differentiation Validation (6 months post-launch)
- **Binder Scan:** 10,000+ cards scanned via 9-up bulk scanning
- **Storage Tracking:** 1,000+ users actively tracking card locations
- **Trade Scout:** 500+ successful trades facilitated by AI recommendations

### Technical Success Metrics
- **Data Model Stability:** No breaking schema changes after v1.0
- **Query Performance:** 95% of collection/deck queries under 200ms
- **Bulk Import Success:** 99%+ success rate for CSV/competitor imports

---

## Next Phase: Technical Design

This requirements document should inform the CTO's technical design decisions:

1. **EF Core Entity Design:** How these business entities map to database schema
2. **API Surface:** Which operations need REST endpoints vs internal services
3. **Caching Strategy:** Where to cache pricing, legality, and card data
4. **Data Migration:** How to handle schema changes as requirements evolve
5. **Performance Optimization:** Indexing strategy for collection queries and deck searches

**Deliverable for CTO:** EF Core entity models with relationships, ready for database migration.