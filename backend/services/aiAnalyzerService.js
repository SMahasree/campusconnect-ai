/**
 * AI Description Analyzer Service
 * Uses Ollama for natural language processing
 * Fallback to regex-based extraction if Ollama unavailable
 */

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';

/**
 * Try to connect to Ollama and extract structured data
 */
export async function analyzeDescription(description) {
  // Try Ollama first
  const ollamaResult = await tryOllamaAnalysis(description);
  if (ollamaResult) {
    return ollamaResult;
  }

  // Fallback to regex-based extraction
  return regexBasedAnalysis(description);
}

/**
 * Attempt Ollama-based analysis
 */
async function tryOllamaAnalysis(description) {
  try {
    const prompt = `Extract structured data from this lost/found item description. Return only valid JSON.

Description: "${description}"

Return JSON with fields: itemType, color, brand, otherDetails (array).
If a field is not mentioned, use null. Be concise.`;

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    // Parse the response
    try {
      const jsonMatch = data.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          source: 'ollama',
          itemType: parsed.itemType || null,
          color: parsed.color || null,
          brand: parsed.brand || null,
          otherDetails: Array.isArray(parsed.otherDetails) ? parsed.otherDetails : []
        };
      }
    } catch (e) {
      console.error('Failed to parse Ollama response:', e);
    }

    return null;
  } catch (err) {
    console.warn('Ollama unavailable, falling back to regex analysis:', err.message);
    return null;
  }
}

/**
 * Regex-based analysis (fallback)
 */
function regexBasedAnalysis(description) {
  const text = description.toLowerCase();
  
  // Common colors
  const colors = ['black', 'white', 'red', 'blue', 'green', 'silver', 'gold', 'grey', 'gray', 'pink', 'purple', 'yellow', 'orange', 'brown'];
  const foundColor = colors.find(c => text.includes(c));

  // Common brands
  const brands = ['samsung', 'iphone', 'apple', 'nokia', 'sony', 'lg', 'dell', 'hp', 'lenovo', 'realme', 'xiaomi', 'oneplus'];
  const foundBrand = brands.find(b => text.includes(b));

  // Item types
  const itemTypes = {
    'phone|mobile|iphone|smartphone': 'Phone',
    'wallet|purse': 'Wallet',
    'bag|backpack|suitcase': 'Bag',
    'watch': 'Watch',
    'glasses|specs|sunglasses': 'Glasses',
    'laptop|computer|notebook': 'Laptop',
    'charger|cable': 'Charger',
    'book|notebook|journal': 'Book',
    'keys|keychain': 'Keys',
    'headphone|earphone|airpods|earpods': 'Headphones'
  };

  let foundItemType = null;
  for (const [pattern, type] of Object.entries(itemTypes)) {
    if (new RegExp(pattern).test(text)) {
      foundItemType = type;
      break;
    }
  }

  return {
    source: 'regex',
    itemType: foundItemType,
    color: foundColor || null,
    brand: foundBrand || null,
    otherDetails: []
  };
}

/**
 * Generate match reason based on structured data
 */
export function generateMatchReason(structuredData1, structuredData2) {
  const reasons = [];

  if (structuredData1.itemType && structuredData2.itemType && 
      structuredData1.itemType === structuredData2.itemType) {
    reasons.push(`Both are ${structuredData1.itemType}s`);
  }

  if (structuredData1.color && structuredData2.color && 
      structuredData1.color === structuredData2.color) {
    reasons.push(`Same color: ${structuredData1.color}`);
  }

  if (structuredData1.brand && structuredData2.brand && 
      structuredData1.brand === structuredData2.brand) {
    reasons.push(`Same brand: ${structuredData1.brand}`);
  }

  return reasons.length > 0 ? reasons.join(', ') : 'Keyword similarity match';
}
