// src/services/firestore.js

import { getFirestore } from 'firebase/firestore';
import { app } from './firebase.js'; // Import the initialized Firebase app

// Initialize the Firestore database service and get a reference to it.
const db = getFirestore(app);

// Export the database instance to be used throughout the application.
export { db };