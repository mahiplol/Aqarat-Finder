// backend/fanar.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const FANAR_API_KEY = process.env.FANAR_API_KEY;
const FANAR_HEADERS = {
  Authorization: `Bearer ${FANAR_API_KEY}`,
  'Content-Type': 'application/json',
};

export async function generateText(prompt) {
  const response = await axios.post(
    'https://api.fanar.qa/v1/chat/completions',
    {
      model: 'Fanar-S-1-7B',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
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
