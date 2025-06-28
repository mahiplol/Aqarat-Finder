import fs from 'fs';
import path from 'path';
import { SYSTEM_PROMPT, translateText, generateTextWithSystem } from './fanar.js';

const LISTINGS_PATH = path.resolve('./listings.json');

function keywordMatchScore(query, text) {
  const queryWords = query.toLowerCase().split(/\s+/);
  const textContent = text.toLowerCase();
  return queryWords.reduce((score, word) => (
    textContent.includes(word) ? score + 1 : score
  ), 0);
}

// 🔧 Helper to normalize strings like "Al Khor" vs "alkhor"
const normalize = str => str.toLowerCase().replace(/\s+/g, '');

export async function getSemanticMatches(userQuery, topN = 10) {
  const listings = JSON.parse(fs.readFileSync(LISTINGS_PATH, 'utf-8'));

  const queryInEnglish = /[\u0600-\u06FF]/.test(userQuery)
    ? await translateText(userQuery, 'en')
    : userQuery;

  const queryLower = queryInEnglish.toLowerCase();

  const inferredDistrict = ['lusail', 'west bay', 'the pearl', 'wakra', 'al khor'].find(d =>
    normalize(queryLower).includes(normalize(d))
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
    const districtOk = inferredDistrict
      ? normalize(listing.district).includes(normalize(inferredDistrict))
      : true;

    const typeOk = inferredType
      ? listing.type.toLowerCase().includes(inferredType)
      : true;

    const priceOk = !inferredMaxPrice
      ? true
      : priceOp === 'min'
        ? listing.price >= inferredMaxPrice
        : priceOp === 'max'
          ? listing.price <= inferredMaxPrice
          : true;

    return districtOk && typeOk && priceOk;
  });

  // Score only truly filtered listings
  const scored = filtered.map((listing) => {
    const fullText = `${listing.title}. ${listing.description}`;
    const score = keywordMatchScore(queryLower, fullText);
    return { listing, score };
  });

  // Sort and return top N matches (if more than N)
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(entry => entry.listing);
}

export async function generateAnswer(userQuery, listings, lang) {
  const summary = listings.map((l, i) => (
    `${i + 1}. ${l.title} — ${l.description} (QAR ${l.price}, ${l.bedrooms} bed, ${l.district})`
  )).join('\n');

  const fullPrompt = `User asked: ${userQuery}\nListings:\n${summary}`;

  let output = await generateTextWithSystem(SYSTEM_PROMPT, fullPrompt);

  if (lang === 'ar') {
    output = await translateText(output, 'ar');
  }

  return output;
}
