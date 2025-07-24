// src/utils/randomizer.js

/**
 * Shuffles an array in place using the Fisher-Yates (aka Knuth) Shuffle algorithm.
 * This is an efficient and unbiased way to shuffle.
 * @param {Array} array - The array to be shuffled.
 * @returns {Array} The same array, now shuffled.
 */
export const shuffleArray = (array) => {
    let currentIndex = array.length;
    let randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  
    return array;
  };