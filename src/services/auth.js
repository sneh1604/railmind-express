// src/services/auth.js

import { getAuth } from 'firebase/auth';
import { app } from './firebase.js'; // Import the initialized Firebase app

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };