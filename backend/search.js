import fs from 'fs';
import path from 'path';
import { translateText, generateText } from './fanar.js';

const LISTINGS_PATH = path.resolve('./listings.json');

function keywordMatchScore(query, text) {
  const queryWords = query.toLowerCase().split(/\s+/);
  const textContent = text.toLowerCase();
  return queryWords.reduce((score, word) => (
    textContent.includes(word) ? score + 1 : score
  ), 0);
}

export async function getSemanticMatches(userQuery, topN = 10) {
  const listings = JSON.parse(fs.readFileSync(LISTINGS_PATH, 'utf-8'));

  // 👇 Translate Arabic queries
  const queryInEnglish = /[\u0600-\u06FF]/.test(userQuery)
    ? await translateText(userQuery, 'en')
    : userQuery;

  const queryLower = queryInEnglish.toLowerCase();

  const inferredDistrict = ['lusail', 'west bay', 'the pearl', 'wakra', 'al khor'].find(d =>
    queryLower.includes(d)
  );

  const inferredType = ['apartment', 'studio', 'villa', 'office'].find(t =>
    queryLower.includes(t)
  );

  const priceMatch = queryLower.match(/([0-9]{3,6})\s*(qar|riyal|qatari riyal)?/i);
  const inferredMaxPrice = priceMatch ? parseInt(priceMatch[1]) : null;

  let priceOp = null;
  if (queryLower.includes('above')) priceOp = 'min';
  if (queryLower.includes('under') || queryLower.includes('less than')) priceOp = 'max';

  const filtered = listings.filter(listing => {
    const districtOk = inferredDistrict ? listing.district.toLowerCase().includes(inferredDistrict) : false;
    const typeOk = inferredType ? listing.type.toLowerCase().includes(inferredType) : true;

    const priceOk =
      !inferredMaxPrice ? true :
      priceOp === 'min' ? listing.price >= inferredMaxPrice :
      priceOp === 'max' ? listing.price <= inferredMaxPrice : true;

    return districtOk && typeOk && priceOk;
  });

  const scored = filtered.map((listing) => {
    const fullText = `${listing.title}. ${listing.description}`;
    const score = keywordMatchScore(queryLower, fullText);
    return { listing, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(entry => entry.listing);
}

export async function generateAnswer(userQuery, listings, lang) {
  const summary = listings.map((l, i) => (
    `${i + 1}. ${l.title} — ${l.description} (QAR ${l.price}, ${l.bedrooms} bed, ${l.district})`
  )).join('\n');

  const prompt = `
User asked: ${userQuery}
Here are ${listings.length} listings that match the request:

${summary}

Please respond ONLY based on the listings provided above.
- Do NOT add any extra or fake listings.
- Summarize only the actual listings.
- Be friendly and concise.
- If no listings are shown, say: "No matching properties found."

Respond in a clear paragraph format.
`;

  let output = await generateText(prompt);

  if (lang === 'ar') {
    output = await translateText(output, 'ar');
  }

  return output;
}