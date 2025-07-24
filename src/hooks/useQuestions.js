// src/hooks/useQuestions.js

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firestore.js';

/**
 * Shuffles an array in place.
 * @param {Array} array The array to shuffle.
 * @returns {Array} The shuffled array.
 */
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};


/**
 * Fetches a set of questions based on subjects and difficulty.
 * @returns {object} An object with questions, loading state, error, and a fetch function.
 */
export const useQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // eslint-disable-next-line no-undef
  const fetchQuestionsForLevel = useCallback(async (levelConfig) => {
    if (!levelConfig) return null;
    
    setLoading(true);
    setError(null);
    setQuestions([]);

    const { subjects, difficultyRange, questionCount } = levelConfig;
    let allFetchedQuestions = [];

    try {
      const queryPromises = subjects.map(subject => {
        // --- THIS IS THE CORRECTED PATH ---
        // It now correctly queries top-level collections like 'arithmetic', 'history', etc.
        const questionsRef = collection(db, subject); 
        // --- END OF CORRECTION ---

        const q = query(
          questionsRef, 
          where('difficulty', '>=', difficultyRange[0]),
          where('difficulty', '<=', difficultyRange[1])
        );
        return getDocs(q);
      });

      const querySnapshots = await Promise.all(queryPromises);

      querySnapshots.forEach(snapshot => {
        snapshot.docs.forEach(doc => {
          allFetchedQuestions.push({ id: doc.id, ...doc.data() });
        });
      });
      
      if (allFetchedQuestions.length === 0) {
        // This error is now more specific and helpful
        throw new Error(`No questions found in Firestore for subjects: [${subjects.join(', ')}] and difficulty: [${difficultyRange.join('-')}]. Please upload data.`);
      }

      const finalQuestions = shuffleArray(allFetchedQuestions).slice(0, questionCount);
      setQuestions(finalQuestions);
      setLoading(false);
      return finalQuestions; // Return the questions on success

    } catch (err) {
      console.error("Error fetching questions:", err);
      setError(err);
      setLoading(false);
      return null; // Return null on failure
    }
  }, []); // Empty dependency array as it has no external dependencies

  return { questions, loading, error, fetchQuestionsForLevel };
};