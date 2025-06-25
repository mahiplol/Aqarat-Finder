import fs from 'fs';
import path from 'path';
import { generateText, translateText } from './fanar.js';

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

  const scored = listings.map((listing) => {
    const fullText = `${listing.title}. ${listing.description}`;
    const score = keywordMatchScore(userQuery, fullText);
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