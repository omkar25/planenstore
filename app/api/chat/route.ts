import { groq } from '@ai-sdk/groq';
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse } from 'ai';

export const maxDuration = 30;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Product type for API response
interface Product {
  code: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  listPrice?: number;
  category?: { name: string };
  brand?: string;
  countInStock?: number;
  salesUnit?: string;
  tags?: string[];
  sizes?: string[];
  colors?: string[];
}

interface ProductsResponse {
  content: Product[];
}

// Cache for products (refreshes every 5 minutes)
let productsCache: Product[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch products from API
async function fetchProducts(): Promise<Product[]> {
  const now = Date.now();
  
  // Return cached products if still valid
  if (productsCache && (now - lastFetchTime) < CACHE_DURATION) {
    return productsCache;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/products?page=0&size=50`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!response.ok) {
      console.error('Failed to fetch products:', response.status);
      return productsCache || [];
    }
    
    const data: ProductsResponse = await response.json();
    productsCache = data.content || [];
    lastFetchTime = now;
    return productsCache;
  } catch (error) {
    console.error('Error fetching products:', error);
    return productsCache || [];
  }
}

const SITE_DOMAIN = 'https://www.toriplanen.de';

// Calculate price statistics
function getPriceStats(products: Product[]): { min: number; max: number; avg: number } {
  const prices = products.filter(p => p.price > 0).map(p => p.price);
  if (!prices.length) return { min: 0, max: 0, avg: 0 };
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: prices.reduce((a, b) => a + b, 0) / prices.length
  };
}

// Format products for the AI prompt
function formatProductsForPrompt(products: Product[]): string {
  if (!products.length) return 'Keine Produkte verfügbar.';
  
  return products.map(p => {
    const price = p.price ? `${p.price.toFixed(2)}€` : 'Preis auf Anfrage';
    const listPrice = p.listPrice && p.listPrice > p.price ? ` (statt ${p.listPrice.toFixed(2)}€)` : '';
    const category = p.category?.name || 'Allgemein';
    const stock = p.countInStock && p.countInStock > 0 ? 'Auf Lager' : 'Auf Anfrage';
    const unit = p.salesUnit ? ` pro ${p.salesUnit}` : '';
    const sizes = p.sizes?.length ? `Größen: ${p.sizes.join(', ')}` : '';
    const colors = p.colors?.length ? `Farben: ${p.colors.join(', ')}` : '';
    
    return `- **${p.name}** (Slug: ${p.slug})
  Kategorie: ${category} | Preis: ${price}${listPrice}${unit} | ${stock}
  ${p.description ? `Beschreibung: ${p.description.substring(0, 150)}...` : ''}
  ${sizes} ${colors}
  Produktlink: ${SITE_DOMAIN}/shop/${p.slug}`;
  }).join('\n\n');
}

// Primary: Groq (free tier), Fallback: Google Gemini
const getModel = () => {
  if (process.env.GROQ_API_KEY) {
    return groq('llama-3.3-70b-versatile');
  }
  return google('gemini-2.0-flash');
};

// Build dynamic system prompt with real product data
function buildSystemPrompt(products: Product[]): string {
  const productList = formatProductsForPrompt(products);
  const priceStats = getPriceStats(products);
  const totalProducts = products.length;
  
  // Get cheapest and most expensive products
  const sortedByPrice = [...products].filter(p => p.price > 0).sort((a, b) => a.price - b.price);
  const cheapestProduct = sortedByPrice[0];
  const expensiveProduct = sortedByPrice[sortedByPrice.length - 1];
  
  return `Du bist ein freundlicher und hilfreicher Kundenservice-Assistent für Tori Planen, einen deutschen Online-Shop für hochwertige PVC-Planen, Gerüstplanen und Kederplanen.

=== ÜBER DAS UNTERNEHMEN ===
- Tori Planen ist spezialisiert auf maßgefertigte Planen für Industrie, Handwerk und Privatkunden
- Alle Produkte werden in Deutschland hergestellt
- Wir bieten individuelle Größen und Farben an
- Schnelle Lieferung innerhalb Deutschlands

=== PREIS-ÜBERSICHT (ECHTE DATEN) ===
- Gesamtanzahl Produkte im Shop: ${totalProducts}
- Günstigstes Produkt: ${cheapestProduct ? `${cheapestProduct.name} für ${cheapestProduct.price.toFixed(2)}€ - ${SITE_DOMAIN}/shop/${cheapestProduct.slug}` : 'N/A'}
- Teuerstes Produkt: ${expensiveProduct ? `${expensiveProduct.name} für ${expensiveProduct.price.toFixed(2)}€ - ${SITE_DOMAIN}/shop/${expensiveProduct.slug}` : 'N/A'}
- Preisspanne: ${priceStats.min.toFixed(2)}€ bis ${priceStats.max.toFixed(2)}€
- Durchschnittspreis: ${priceStats.avg.toFixed(2)}€

=== WEBSITE-SEITEN (verwende diese Links in deinen Antworten) ===
**Schnellzugriff:**
- Startseite: /
- Portfolio: /portfolio
- Über uns: /ueber-uns
- Referenzen: /referenzen
- Kontaktformular: /kontakt

**Shop & Produkte:**
- Shop/Alle Produkte: /shop
- PVC-Planen: /pvc-planen
- Gerüstplanen: /geruestplanen
- Kederplanen: /kederplanen

**Leistungen/Services:**
- PVC-Planen Montage: /pvc-planen (Montageservice verfügbar)
- Keder-Planen Montage: /kederplanen (Montageservice verfügbar)
- Gerüstband Montage: /geruestplanen (Montageservice verfügbar)
- Strahlschutznetze: /shop (Kategorie: Strahlschutznetze)
- Staubschutznetze: /shop (Kategorie: Staubschutznetze)
- Personenauffangnetze: /shop (Kategorie: Personenauffangnetze)

**Rechtliches:**
- Impressum: /impressum
- Datenschutz: /datenschutz

=== AKTUELLE PRODUKTE AUS DEM SHOP (ECHTE DATEN) ===
${productList}

=== KONTAKTMÖGLICHKEITEN ===
Wenn Kunden Kontakt aufnehmen möchten:
- **Kontaktformular**: Verweise auf /kontakt - "Sie können uns über unser Kontaktformular erreichen: /kontakt"
- **E-Mail**: info@toriplanen.de
- **Website**: www.toriplanen.de

=== ANTWORTREGELN ===
1. Bei Produktfragen: Nutze die ECHTEN Produktdaten oben! Nenne den genauen Namen, Preis und den VOLLSTÄNDIGEN Produktlink
2. Bei Kontaktanfragen: Verweise IMMER auf das Kontaktformular (${SITE_DOMAIN}/kontakt) ODER E-Mail (info@toriplanen.de)
3. Antworte auf Deutsch, es sei denn, der Kunde schreibt auf Englisch
4. Sei höflich, professionell und hilfsbereit
5. Halte Antworten kurz und präzise (2-3 Sätze)
6. Wenn ein Produkt nicht in der Liste ist, verweise auf den Shop (${SITE_DOMAIN}/shop) oder Kundenservice
7. Verwende keine Emojis übermäßig
8. WICHTIG: Nenne immer den VOLLSTÄNDIGEN Produktlink mit Domain: ${SITE_DOMAIN}/shop/{slug}
9. Bei Preisfragen: Nutze die PREIS-ÜBERSICHT für min/max/durchschnitt Preise

=== BEISPIELANTWORTEN ===
- Frage: "Was kostet eine PVC-Plane?" → Schaue in den AKTUELLEN PRODUKTEN und nenne den echten Preis mit vollständigem Link (${SITE_DOMAIN}/shop/...)
- Frage: "Was ist euer günstigstes Produkt?" → Nutze die PREIS-ÜBERSICHT und nenne das günstigste Produkt mit Link
- Frage: "Was ist euer teuerstes Produkt?" → Nutze die PREIS-ÜBERSICHT und nenne das teuerste Produkt mit Link
- Frage: "Wie teuer sind eure Produkte?" → "Unsere Produkte kosten zwischen X€ und Y€. Der Durchschnittspreis liegt bei Z€."
- Frage: "Wie kann ich euch kontaktieren?" → "Sie können uns über unser Kontaktformular erreichen: ${SITE_DOMAIN}/kontakt oder per E-Mail an info@toriplanen.de"
- Frage: "Habt ihr Gerüstplanen?" → Schaue in den AKTUELLEN PRODUKTEN und liste passende Produkte mit Preisen und vollständigen Links`;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Fetch real product data from API
    const products = await fetchProducts();
    const systemPrompt = buildSystemPrompt(products);

    const result = streamText({
      model: getModel(),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return createUIMessageStreamResponse({
      stream: createUIMessageStream({
        execute({ writer }) {
          writer.merge(result.toUIMessageStream());
        },
      }),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
