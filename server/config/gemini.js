const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

let aiInstance = null;

if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-google-gemini-api-key') {
  try {
    aiInstance = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (err) {
    console.warn('Gemini API client initialization warning:', err.message);
  }
}

module.exports = {
  ai: aiInstance,
  isGeminiConfigured: () => Boolean(aiInstance)
};
