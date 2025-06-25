import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getSemanticMatches, generateAnswer } from './search.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
  res.send('Fanar-powered search server is running');
});

// POST /search { query: "some input", lang: "en" | "ar" }
app.post('/search', async (req, res) => {
  const { query, lang } = req.body;

  if (!query || !lang) {
    return res.status(400).json({ error: 'Missing query or lang' });
  }

  try {
    const matches = await getSemanticMatches(query);
    const answer = await generateAnswer(query, matches, lang);
    res.json({ answer, matches });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});