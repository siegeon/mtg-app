# MTG App MVP Feature Specification & Phased Roadmap

**Product Discovery Analysis by Product Discovery Agent**  
**Date:** April 19, 2026  
**Source:** [BES-342](/BES/issues/BES-342)

## Executive Summary

This specification defines a disciplined MVP scope for the AI-native MTG app, selecting 40 critical features from 78 table-stakes options to achieve competitive parity with Moxfield (deck building) and ManaBox (collection management) within a 2-month launch timeline.

**Key Decisions:**
- **MVP Scope:** 40 features across 6 core buckets (down from 78 table-stakes)
- **AI Strategy:** Prototype binder-page bulk scan, include storage tracking, defer trade scout
- **Launch Target:** Minimum credible product that enables deck building + collection workflows
- **Competitive Goal:** Match core functionality of existing leaders, differentiate with AI features

## Phase 1: MVP Features (Months 0-2)

### 1. Card Search and Discovery (6 features)
- **Full card database** — Every printing, every language (Scryfall integration)
- **Scryfall search syntax** — Advanced query language support
- **Advanced filters** — Color, CMC, rarity, set, type, keyword, legality
- **Format legality flags** — Standard, Modern, Commander, etc.
- **Oracle text + printed text** — Handle Universes Beyond flavor divergence
- **Comprehensive Rules** — Card-specific rulings integration

### 2. Deck Builder and Management (14 features)
- **Visual drag-and-drop builder** — Primary deck construction interface
- **Text view with mana symbols** — Secondary list-based interface  
- **Mainboard/sideboard/maybeboard** — Standard deck organization
- **Custom categories** — User-defined card groupings
- **Import/export support** — Arena, MTGO, text formats
- **Format legality enforcement** — Auto-validation for Commander color identity
- **Visibility controls** — Private, public, unlisted deck sharing
- **Deck folders** — Nested organization system
- **Deck duplication** — Fork any public deck
- **Printing selection** — Choose specific card versions
- **Custom tags** — Global and deck-specific tagging
- **Grouping options** — By type, color, CMC, rarity, tags
- **Sorting options** — Name, cost, price, rarity, date
- **Price comparison** — Switch between printings for cost optimization

### 3. Collection Tracking and Management (8 features)
- **Multiple binders/folders** — Organized collection structure
- **Quantity and variants** — Foil, etched, condition tracking
- **Card condition** — NM, LP, MP, HP, DMG classification
- **Bulk import** — CSV, TXT, competitor export support
- **Missing cards analysis** — Gap analysis per deck
- **Build with owned cards** — Filter deck builder to collection
- **Purchase tracking** — Cost basis and acquisition dates
- **P&L analysis** — Current value vs purchase price

### 4. Playtest and Analysis Tools (8 features)
- **Mana curve visualization** — Distribution analysis
- **Type breakdown** — Creature, spell, land ratios
- **Sample hand generator** — Statistical opening hands
- **Legality validation** — Format compliance with explanations
- **Total deck pricing** — Aggregate cost across vendors
- **Life tracking** — 1v1 up to 10 players
- **Commander damage** — Dedicated tracking
- **Dice roller** — D4-D20 support

### 5. Pricing and Market Data (3 features)
- **TCGplayer pricing** — Primary US market data
- **Card Kingdom pricing** — Secondary vendor data
- **Foil toggle** — Switch between foil/non-foil prices

### 6. Social and Community Features (1 feature)
- **Battery-friendly dark mode** — Essential for mobile gaming sessions

**Total: 40 MVP features**

## Phase 2: Enhancement Features (Months 2-6)

### Core Enhancements (⭐⭐ Priority)
- **Version history** — Track all deck changes over time
- **Collaboration** — Multiple editors per deck
- **Markdown primers** — Rich deck descriptions
- **Advanced collection** — Tradelist/wishlist separation, bulk editing
- **Enhanced analytics** — Hypergeometric probability, salt scores, power level
- **Trading system** — Match inventory vs wishlists, auto-balance trades
- **Token database** — Auto-generate token lists for decks
- **Draft simulator** — Limited format practice

### AI Features (if prototypes succeed)
- **Binder-page bulk scan** — 9-up or 18-up card recognition
- **Natural language search** — "Show me cheap red removal"
- **Collection insights** — AI-powered portfolio analysis

## Phase 3: Advanced Features (Months 6-12)

### Power User Features (⭐ Priority)
- **Multi-language support** — International card names/search
- **Advanced trading** — Partner reputation, trade history
- **Tournament integration** — Results tracking, meta analysis
- **Content creator tools** — Video recording, deck tech templates
- **API access** — Third-party integrations

### AI Differentiation (if proven viable)
- **Agentic trade scout** — Continuous background optimization
- **Combo discovery** — ML-powered synergy detection
- **Meta prediction** — AI-driven format forecasting

## AI Differentiator Analysis

### 1. Binder-Page Bulk Scan
**Status:** PROTOTYPE IMMEDIATELY  
**Feasibility:** HIGH — Computer vision technology is mature  
**Market Impact:** VERY HIGH — No competitor offers this  
**User Value:** VERY HIGH — 9-18x faster collection digitization  
**Implementation:** Medium complexity, requires CV model training  

### 2. Physical Storage Tracking
**Status:** INCLUDE IN MVP  
**Feasibility:** HIGH — Straightforward database/UX problem  
**Market Impact:** MEDIUM-HIGH — Basic location tracking exists, but not central  
**User Value:** HIGH — Solves "where is my card" problem  
**Implementation:** Low complexity, easy win  

### 3. Agentic Trade Scout  
**Status:** DEFER TO PHASE 2/3  
**Feasibility:** MEDIUM — Requires API partnerships, complex infrastructure  
**Market Impact:** VERY HIGH — No automated trade discovery exists  
**User Value:** HIGH for traders, limited appeal for casual players  
**Implementation:** High complexity, significant backend required  

## Success Criteria

### Launch Metrics (Month 2)
- **Feature Parity:** 95% of core Moxfield deck building workflows supported
- **Collection Management:** 90% of ManaBox collection features matched
- **Performance:** <2s page load, <500ms card search
- **User Onboarding:** Complete deck import + collection scan in <10 minutes

### Growth Metrics (Month 6)
- **User Retention:** 40%+ monthly active users
- **Deck Creation:** 10,000+ public decks in database
- **Collection Size:** 1M+ cards tracked across all users
- **AI Feature Adoption:** 60%+ of users try binder scan (if shipped)

## Risk Assessment

### High Risk
- **Binder scan accuracy** — CV model may not achieve required precision
- **Scryfall API limits** — Rate limiting could impact user experience  
- **Mobile performance** — Card image rendering at scale

### Medium Risk  
- **Feature scope creep** — Pressure to include more table-stakes features
- **Data model complexity** — Collection + deck + pricing relationships
- **Competitive response** — Moxfield/ManaBox may accelerate AI features

### Low Risk
- **User acquisition** — MTG market is large and underserved
- **Technical feasibility** — Core features are proven in market
- **Business model** — Freemium with premium features is established

## Competitive Positioning

### Launch Position
- **vs Moxfield:** Equal deck building, superior collection management
- **vs ManaBox:** Equal collection management, superior deck building  
- **vs Both:** AI differentiation (binder scan + storage tracking)

### 6-Month Position
- **vs All Competitors:** Only app with conversational AI interface
- **vs Trading Platforms:** Only automated trade discovery  
- **vs Collection Apps:** Only bulk scanning solution

## Implementation Notes

### Technical Priorities
1. **Data model design** — Support all 6 buckets with shared entities
2. **Scryfall integration** — Reliable, cached card data pipeline  
3. **Mobile-first UI** — 80% of MTG app usage is mobile
4. **Performance optimization** — Large datasets require careful indexing

### AI Implementation Sequence  
1. **Month 0:** Begin binder scan prototype (parallel to MVP)
2. **Month 1:** Integrate storage tracking into collection management
3. **Month 2:** Evaluate binder scan prototype for Phase 2 inclusion
4. **Month 3:** Design trade scout architecture (if moving to Phase 2)

## Conclusion

This specification provides a disciplined MVP scope that achieves competitive parity while preserving resources for AI differentiation. The 40 selected features represent the minimum credible product for serious MTG players while enabling the core workflows that drive user retention.

The phased approach allows for market validation before heavy AI investment, while the early binder scan prototype provides a clear differentiation opportunity that no competitor can quickly replicate.

**Next Steps:**
1. Technical architecture design for MVP features
2. Binder scan prototype development  
3. User research validation of priority rankings
4. Development timeline and resource allocation