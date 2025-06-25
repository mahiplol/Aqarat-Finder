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

export async function getSemanticMatches(userQuery, topN = 5) {
  const listings = JSON.parse(fs.readFileSync(LISTINGS_PATH, 'utf-8'));

  // 👇 Translate Arabic queries
  const queryInEnglish = /[\u0600-\u06FF]/.test(userQuery)
    ? await translateText(userQuery, 'en')
    : userQuery;

  const queryLower = queryInEnglish.toLowerCase();

  const inferredDistrict = ['lusail', 'west bay', 'the pearl', 'wakra'].find(d =>
    queryLower.includes(d)
  );

  const inferredType = ['apartment', 'studio', 'villa', 'office'].find(t =>
    queryLower.includes(t)
  );

  const priceMatch = queryLower.match(/([0-9]{3,6})\s*(qar|riyal|qatari riyal)?/i);
  const inferredMaxPrice = priceMatch ? parseInt(priceMatch[1]) : null;

  const filtered = listings.filter(listing => {
    const districtOk = inferredDistrict ? listing.district.toLowerCase().includes(inferredDistrict) : false; // strict
    const typeOk = inferredType ? listing.type.toLowerCase().includes(inferredType) : true;
    const priceOk = inferredMaxPrice ? listing.price <= inferredMaxPrice : true;
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

  const prompt = `User asked: ${userQuery}\nHere are matching listings:\n${summary}\n\nSummarize the best options in a helpful, friendly tone.`;

  let output = await generateText(prompt);

  if (lang === 'ar') {
    output = await translateText(output, 'ar');
  }

  return output;
}