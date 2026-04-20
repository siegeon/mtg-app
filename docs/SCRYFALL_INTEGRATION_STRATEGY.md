# Scryfall API Integration Strategy

**Document Type:** Product Discovery Research  
**Created:** 2026-04-19  
**Author:** Product Discovery Agent  
**For:** CTO Technical Implementation  
**Status:** Final

## Executive Summary

Scryfall provides an exceptional API for MTG card data with generous rate limits, comprehensive bulk data, and proper caching infrastructure. **Recommended approach:** Hybrid bulk sync + real-time queries with aggressive local caching.

**Key Findings:**
- No authentication required, completely free
- 171MB daily bulk downloads provide complete card database
- 10 req/sec standard rate limit, 2 req/sec for search
- Proper HTTP caching with 16-hour cache headers
- Production-ready CDN infrastructure for images

---

## 1. API Limits & Best Practices

### Rate Limits (Production Impact)
- **Standard endpoints**: 10 requests/second (card lookups, sets, autocomplete)
- **Heavy endpoints**: 2 requests/second (search, collections)
- **No daily limits**: Unlike many APIs, no throttling after high usage
- **No authentication**: Removes complexity of API key management

### Required Implementation
```http
User-Agent: MTGApp/1.0 (contact@yourapp.com)
Accept: application/json
```

### Rate Limit Handling Strategy
```csharp
// Recommended .NET implementation pattern
public class ScryfallClient 
{
    private readonly SemaphoreSlim _searchSemaphore = new(2, 2); // 2 req/sec for search
    private readonly SemaphoreSlim _standardSemaphore = new(10, 10); // 10 req/sec for standard
    
    public async Task<SearchResult> SearchCardsAsync(string query)
    {
        await _searchSemaphore.WaitAsync();
        try
        {
            // Execute search with automatic retry on 429
            return await ExecuteWithRetry(() => _httpClient.GetAsync($"/cards/search?q={query}"));
        }
        finally 
        {
            _searchSemaphore.Release();
        }
    }
}
```

---

## 2. Data Strategy: Bulk vs Real-Time

### Recommended Hybrid Approach

#### Phase 1: Bulk Foundation (Day 1)
- **Daily sync of Oracle Cards bulk file** (171MB gzipped → 1.8GB uncompressed)
- ~76,000 card records covering every unique game piece
- Provides offline-first capability and eliminates rate limit concerns for core data

#### Phase 2: Real-Time Augmentation
- **Search API for user queries** (advanced filters, fuzzy matching)
- **Price updates** via daily API calls (prices don't update more frequently)
- **New card releases** detected via bulk file timestamp changes

### Bulk Data Implementation Strategy

```csharp
public class BulkSyncService
{
    public async Task SyncDailyAsync()
    {
        // 1. Check bulk data timestamps
        var bulkInfo = await _scryfallClient.GetBulkDataAsync("oracle_cards");
        
        if (bulkInfo.UpdatedAt > _lastSyncTime)
        {
            // 2. Download and process (~171MB)
            using var stream = await _httpClient.GetStreamAsync(bulkInfo.DownloadUri);
            using var gzip = new GZipStream(stream, CompressionMode.Decompress);
            
            // 3. Streaming JSON parse to avoid memory issues
            await foreach (var card in JsonSerializer.DeserializeAsyncEnumerable<ScryfallCard>(gzip))
            {
                await UpsertCardAsync(card);
            }
            
            // 4. Update price data separately
            await UpdatePricesAsync();
        }
    }
}
```

### Data Freshness Requirements
- **Card database**: 12-hour sync (Scryfall updates every 12 hours)
- **Prices**: 24-hour max (TCGplayer/Card Kingdom don't update more frequently)
- **New sets**: Weekly check during preview season, daily during spoiler season
- **Errata/bans**: Weekly check of bulk data for oracle text changes

---

## 3. Caching Architecture

### Multi-Layer Caching Strategy

#### Layer 1: PostgreSQL (Primary Storage)
```sql
-- Optimized for MTG App domain model
CREATE TABLE Cards (
    oracle_id UUID PRIMARY KEY,           -- Scryfall oracle_id
    name VARCHAR(255) NOT NULL,
    mana_cost VARCHAR(50),
    type_line TEXT,
    oracle_text TEXT,
    power VARCHAR(10),
    toughness VARCHAR(10),
    color_identity CHAR(5)[],             -- Array of color letters
    cmc INTEGER,
    scryfall_updated_at TIMESTAMP,
    last_synced_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Printings (
    scryfall_id UUID PRIMARY KEY,        -- Scryfall card id
    oracle_id UUID REFERENCES Cards(oracle_id),
    set_code VARCHAR(10),
    collector_number VARCHAR(10),
    rarity VARCHAR(20),
    foil BOOLEAN,
    nonfoil BOOLEAN,
    image_uris JSONB,                     -- Store all image variants
    prices JSONB,                         -- Store price history
    last_price_update TIMESTAMP
);
```

#### Layer 2: Redis (Query Caching)
```csharp
public class CachedScryfallService
{
    public async Task<IEnumerable<Card>> SearchAsync(string query)
    {
        var cacheKey = $"search:{Convert.ToBase64String(Encoding.UTF8.GetBytes(query))}";
        
        // Check cache first (16-hour TTL matching Scryfall headers)
        var cached = await _redis.GetStringAsync(cacheKey);
        if (cached != null)
        {
            return JsonSerializer.Deserialize<IEnumerable<Card>>(cached);
        }
        
        // Fall back to API with rate limiting
        var results = await _scryfallClient.SearchAsync(query);
        await _redis.SetStringAsync(cacheKey, JsonSerializer.Serialize(results), 
            TimeSpan.FromHours(16));
        
        return results;
    }
}
```

#### Layer 3: CDN (Image Caching)
- **Scryfall images** already CDN-optimized (`cards.scryfall.io`)
- **Store image URLs**, not images themselves
- **Proxy through your CDN** for consistent branding and analytics
- **Lazy loading** with placeholder images for better UX

### Storage Requirements (Production Planning)
- **Oracle Cards DB**: ~2GB uncompressed for full card database
- **With Printings**: ~5-8GB (multiple printings per card)
- **Monthly Growth**: ~500MB (new sets + reprints)
- **Redis Cache**: 1-2GB for hot query results
- **Image Cache**: No local storage needed (leverage Scryfall CDN)

---

## 4. Image Hosting Strategy

### Current Scryfall Infrastructure
- **CDN**: Cloudflare-powered `cards.scryfall.io`
- **Formats**: small (146x204), normal (488x680), large (672x936), png (745x1040)
- **Average size**: ~135KB per normal image
- **Availability**: 99%+ uptime observed

### Recommended Implementation

#### Option A: Direct Scryfall Integration (Recommended for MVP)
```csharp
public class ImageService
{
    public string GetImageUrl(Printing printing, ImageSize size = ImageSize.Normal)
    {
        // Use stored image_uris from Scryfall
        return printing.ImageUris[size.ToString().ToLower()];
    }
    
    public async Task<bool> ValidateImageAsync(string imageUrl)
    {
        // Health check for broken image links
        var response = await _httpClient.SendAsync(new HttpRequestMessage(HttpMethod.Head, imageUrl));
        return response.IsSuccessStatusCode;
    }
}
```

#### Option B: Proxy Through Your CDN (Phase 2)
```csharp
public class ProxiedImageService
{
    public string GetImageUrl(Printing printing, ImageSize size = ImageSize.Normal)
    {
        // Route through your CDN for analytics and consistent domain
        return $"https://cdn.yourdomain.com/cards/{printing.ScryfallId}/{size.ToString().ToLower()}.jpg";
    }
}
```

**Benefits of proxying:**
- Consistent domain for security policies
- Analytics on image usage
- Fallback to placeholder for missing images
- Future flexibility for image optimization

**Costs of proxying:**
- CDN bandwidth costs (~135KB × daily active users × avg cards viewed)
- Increased complexity for minimal benefit at launch

**Recommendation**: Start with direct Scryfall URLs, migrate to proxied approach when scale justifies the complexity.

---

## 5. Search Integration

### Scryfall Search Syntax Mapping

#### Core Search Patterns
```csharp
public class SearchQueryBuilder
{
    public string BuildQuery(CardSearchRequest request)
    {
        var parts = new List<string>();
        
        if (!string.IsNullOrEmpty(request.Name))
            parts.Add($"\"{request.Name}\"");
            
        if (request.Colors?.Any() == true)
            parts.Add($"c:{string.Join("", request.Colors)}");
            
        if (request.MinCmc.HasValue)
            parts.Add($"cmc>={request.MinCmc}");
            
        if (request.Format != null)
            parts.Add($"legal:{request.Format.ToLower()}");
            
        return string.Join(" ", parts);
    }
}
```

#### Advanced Filters Supported
- **Color identity**: `c:wubrg`, `id<=wu` (exact vs subset)
- **Mana cost**: `cmc=3`, `cmc>=7`, `mv:odd` (even/odd costs)
- **Card types**: `t:creature`, `t:"legendary creature"`, `t:instant OR t:sorcery`
- **Format legality**: `legal:commander`, `banned:standard`
- **Set membership**: `set:mid`, `year:2021`, `date>=2020`
- **Power/toughness**: `pow>=5`, `tou<=3`, `pt:*/1`
- **Keywords**: `kw:flying`, `kw:storm`, `o:"whenever ~ enters"`

### Search Performance Optimization

#### Query Optimization Strategy
```csharp
public class OptimizedSearchService
{
    public async Task<SearchResult> SearchAsync(string query, int page = 1)
    {
        // 1. Check local cache first
        var cacheKey = $"search:{query.ToLower()}:page:{page}";
        var cached = await _redis.GetAsync<SearchResult>(cacheKey);
        if (cached != null) return cached;
        
        // 2. Check if we can fulfill from local DB (for exact name searches)
        if (IsExactNameQuery(query))
        {
            var localResults = await _dbContext.Cards
                .Where(c => c.Name.ToLower().Contains(query.ToLower()))
                .ToListAsync();
                
            if (localResults.Any())
            {
                return MapToSearchResult(localResults);
            }
        }
        
        // 3. Fall back to Scryfall API with rate limiting
        return await _scryfallClient.SearchAsync(query, page);
    }
}
```

#### Pagination Strategy
- **Scryfall standard**: 175 cards per page
- **UI recommendation**: Show 20-50 cards per page for better UX
- **Pre-fetch**: Load next page in background for smooth scrolling
- **Cache full pages**: Don't cache partial results to avoid inconsistency

---

## 6. Data Modeling Integration

### Mapping to MTG App Domain Model

#### Card vs Printing Relationship
```csharp
// Maps directly to domain model defined in DOMAIN_MODEL_REQUIREMENTS.md
public class Card // Oracle identity
{
    public Guid OracleId { get; set; }           // Scryfall oracle_id
    public string Name { get; set; }
    public string ManaCost { get; set; }
    public string OracleText { get; set; }
    public string[] ColorIdentity { get; set; }  // ["W", "U"] format
    public int ConvertedManaCost { get; set; }
    public DateTime ScryfallUpdatedAt { get; set; }
    
    public virtual ICollection<Printing> Printings { get; set; }
    public virtual ICollection<Legality> Legalities { get; set; }
}

public class Printing // Specific printing
{
    public Guid ScryfallId { get; set; }         // Scryfall card id
    public Guid OracleId { get; set; }
    public string SetCode { get; set; }
    public string CollectorNumber { get; set; }
    public bool Foil { get; set; }
    public bool NonFoil { get; set; }
    public Dictionary<string, string> ImageUris { get; set; } // JSON mapping
    public Dictionary<string, decimal?> Prices { get; set; }  // usd, eur, etc.
    
    public virtual Card Card { get; set; }
}
```

#### Set and Legality Integration
```csharp
public class MTGSet
{
    public string Code { get; set; }             // Scryfall set code
    public string Name { get; set; }
    public DateTime ReleasedAt { get; set; }
    public string SetType { get; set; }          // "expansion", "core", etc.
    public int CardCount { get; set; }
    public bool Digital { get; set; }
    public string ScryfallUri { get; set; }
}

public class Legality
{
    public Guid OracleId { get; set; }
    public string Format { get; set; }           // "standard", "modern", etc.
    public string Status { get; set; }           // "legal", "banned", "restricted"
    public DateTime EffectiveDate { get; set; }
    
    public virtual Card Card { get; set; }
}
```

### Version Tracking Strategy
```csharp
public class SyncLog
{
    public DateTime SyncedAt { get; set; }
    public string DataType { get; set; }         // "oracle_cards", "rulings", etc.
    public string ScryfallUpdatedAt { get; set; }
    public int RecordsProcessed { get; set; }
    public TimeSpan Duration { get; set; }
    public bool Success { get; set; }
}
```

---

## Implementation Priorities

### Phase 1: Foundation (Week 1-2)
1. **Bulk data sync service** - Daily Oracle Cards download
2. **Basic card lookup** - By name, by Scryfall ID
3. **Image URL resolution** - Direct Scryfall integration
4. **EF Core entities** - Match domain model from requirements doc

### Phase 2: Search & Caching (Week 3-4)
5. **Search API integration** - Full Scryfall query syntax
6. **Redis caching layer** - Query results and card lookups
7. **Rate limiting infrastructure** - Semaphore-based approach
8. **Health monitoring** - Track sync success and API availability

### Phase 3: Advanced Features (Month 2)
9. **Price tracking** - Historical price storage and alerting
10. **Set completion** - Track which cards are available in each set
11. **Format rotation** - Automatic Standard rotation handling
12. **Image optimization** - CDN proxy and lazy loading

### Phase 4: Performance (Month 3)
13. **Query optimization** - Hybrid local/remote search
14. **Bulk operations** - Efficient deck import/export
15. **Background updates** - Non-blocking sync processes
16. **Monitoring & alerting** - Production readiness

---

## Technical Constraints & Risks

### API Dependency Risks
- **Single point of failure**: Scryfall downtime affects all card data
- **Rate limit changes**: No SLA guarantees on current limits
- **Terms of service**: Could change to restrict commercial usage

**Mitigation Strategies:**
- Aggressive local caching (48-hour stale data acceptable)
- Bulk data provides offline capability
- Monitor for alternative APIs (MTG Developers Discord community)

### Storage Growth
- **Current**: 76K cards → ~2GB database
- **Annual growth**: ~500MB per year (new sets)
- **With price history**: 10x storage growth over 5 years
- **Image caching**: 76K × 135KB = ~10GB if caching locally

### Performance Bottlenecks
- **Bulk sync duration**: 171MB download + processing takes 5-15 minutes
- **Search response time**: 200-500ms for complex queries
- **Database queries**: N+1 problems with printing relationships

---

## Success Metrics

### Technical KPIs
- **Sync success rate**: >99% for daily bulk updates
- **API response time**: P95 <500ms for card lookups
- **Cache hit rate**: >80% for search queries
- **Data freshness**: <24 hours for card data, <12 hours for new releases

### Business KPIs
- **Search accuracy**: Users find target card in <3 queries
- **Image load time**: <2 seconds for card images
- **Deck import success**: >95% success rate for competitor formats
- **Data completeness**: 100% coverage of tournament-legal cards

---

## Conclusion

Scryfall's API design makes it exceptionally well-suited for production MTG applications. The combination of generous rate limits, comprehensive bulk data, and proper HTTP caching enables building robust, scalable card databases.

**Key Success Factors:**
1. **Start with bulk data** for reliable foundation
2. **Cache aggressively** at every layer
3. **Plan for growth** in storage and bandwidth
4. **Monitor API health** and have fallback strategies

This integration strategy provides a solid foundation for the MTG App's card data needs while maintaining flexibility for future enhancements and scaling requirements.