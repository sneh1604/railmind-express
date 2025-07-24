// src/services/gemini.js

import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Get the API Key from your environment variables.
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Throw an error if the API key is missing, to prevent runtime failures.
if (!GEMINI_API_KEY) {
  console.error("Gemini API key is missing. Please add REACT_APP_GEMINI_API_KEY to your .env.local file.");
}

// 2. Initialize the Generative AI client with the API key.
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

/**
 * Generates a new, adaptive educational question using the Gemini API.
 * This function creates a detailed prompt to get a well-structured response.
 *
 * @param {string} topic - The subject of the question (e.g., 'Algebra', 'Indian History').
 * @param {number} difficulty - A number from 1 (easy) to 5 (hard) to guide the AI.
 * @param {Array<string>} [previousQuestions=[]] - An array of previous question texts to ensure the new question is unique.
 * @returns {Promise<object|null>} A promise that resolves to a question object in the format
 * { question: string, answer: string, options?: string[], explanation: string }
 * or null if an error occurs.
 */
export const generateAdaptiveQuestion = async (topic, difficulty, previousQuestions = []) => {
  // 3. Construct a clear, detailed prompt for the AI.
  const prompt = `
    You are an expert quizmaster for a fun children's educational game called "RailMind Express".
    Your task is to create one new, unique, and engaging quiz question.

    **Instructions:**
    1.  **Topic:** The question must be about: "${topic}".
    2.  **Difficulty:** The difficulty level should be ${difficulty} out of 5.
        - Level 1: Very simple, common knowledge.
        - Level 5: Requires deeper understanding.
    3.  **Uniqueness:** The question must NOT be similar to any of these previous questions: ${previousQuestions.join('; ')}.
    4.  **Format:** Provide the response ONLY in a clean JSON format.
        - If it's a multiple-choice question, include an "options" array with 4 choices, where one is the correct answer.
        - If it's a direct answer question, do not include the "options" field.
    5.  **Content:** The question, answer, and explanation should be kid-friendly and easy to understand.

    **Example JSON format for multiple-choice:**
    {
      "question": "What is the capital of France?",
      "options": ["London", "Berlin", "Paris", "Madrid"],
      "answer": "Paris",
      "explanation": "Paris is the famous capital city of France, known for the Eiffel Tower."
    }

    **Example JSON format for direct answer:**
    {
      "question": "How many sides does a hexagon have?",
      "answer": "6",
      "explanation": "A hexagon is a polygon with exactly six sides."
    }

    Now, generate the question based on my instructions.
  `;

  try {
    // 4. Call the Gemini API to generate content.
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Clean and parse the JSON response from the AI.
    // The AI might wrap the JSON in markdown, so we remove it.
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const questionObject = JSON.parse(jsonString);

    // Basic validation of the received object
    if (!questionObject.question || !questionObject.answer || !questionObject.explanation) {
      throw new Error("Received incomplete data from Gemini API.");
    }

    return questionObject;

  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    // Return null so the calling component can handle the error gracefully.
    return null;
  }
};