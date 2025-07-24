// src/utils/validation.js

/**
 * Validates an email address format.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email format is valid.
 */
export const validateEmail = (email) => {
    if (!email) return false;
    // A standard, robust regex for email validation.
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  /**
   * Validates password strength.
   * Criteria: at least 8 characters long.
   * @param {string} password - The password to validate.
   * @returns {{isValid: boolean, message: string}} - An object indicating validity and an error message.
   */
  export const validatePassword = (password) => {
    if (!password || password.length < 8) {
      return {
        isValid: false,
        message: 'Password must be at least 8 characters long.',
      };
    }
    // You can add more complex rules here (e.g., require numbers, symbols)
    // const hasNumber = /\d/.test(password);
    // if (!hasNumber) return { isValid: false, message: 'Password must include a number.' };
  
    return { isValid: true, message: '' };
  };
  
  /**
   * Validates a user's display name.
   * @param {string} name - The display name to validate.
   * @returns {{isValid: boolean, message: string}} - An object indicating validity and an error message.
   */
  export const validateDisplayName = (name) => {
    if (!name || name.trim().length < 3) {
      return {
        isValid: false,
        message: 'Name must be at least 3 characters long.',
      };
    }
    if (name.length > 20) {
      return {
        isValid: false,
        message: 'Name cannot be longer than 20 characters.',
      };
    }
    return { isValid: true, message: '' };
  };