// backend/fanar.js
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const FANAR_API_KEY = process.env.FANAR_API_KEY;
const FANAR_HEADERS = {
  Authorization: `Bearer ${FANAR_API_KEY}`,
  'Content-Type': 'application/json',
};

// 🧠 Load the strict system prompt from external file
const SYSTEM_PROMPT = fs.readFileSync('./fanar_prompt.txt', 'utf-8');

export async function generateTextWithSystem(systemPrompt, userPrompt) {
  const response = await axios.post(
    'https://api.fanar.qa/v1/chat/completions',
    {
      model: 'Fanar-S-1-7B',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]
    },
    { headers: FANAR_HEADERS }
  );
  return response.data.choices[0].message.content;
}

export async function translateText(text, targetLang) {
  const direction = targetLang === 'ar' ? 'Translate the following to Arabic:' : 'Translate the following to English:';
  const response = await axios.post(
    'https://api.fanar.qa/v1/chat/completions',
    {
      model: 'Fanar-S-1-7B',
      messages: [
        { role: 'system', content: direction },
        { role: 'user', content: text },
      ]
    },
    { headers: FANAR_HEADERS }
  );
  return response.data.choices[0].message.content;
}

export { SYSTEM_PROMPT };
