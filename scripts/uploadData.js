// scripts/uploadData.js

// This is a Node.js script, not a React component.
// You run it from your terminal to upload data to Firestore one time.

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

// --- Import your local question data ---
import { arithmeticQuestions } from '../src/data/questions/arithmetic.js';
import { algebraQuestions } from '../src/data/questions/algebra.js';
import { geometryQuestions } from '../src/data/questions/geometry.js';
import { scienceQuestions } from '../src/data/questions/science.js';
import { historyQuestions } from '../src/data/questions/history.js';
import { geographyQuestions } from '../src/data/questions/geography.js';

// --- IMPORTANT: Paste your Firebase config here ---
// You can copy this from src/services/firebase.js
const firebaseConfig = {
    apiKey: "AIzaSyBz6Gr7k4XiMlwY1tJdb-rFBsarZJntdFY",
    authDomain: "railmind-express.firebaseapp.com",
    projectId: "railmind-express",
    storageBucket: "railmind-express.firebasestorage.app",
    messagingSenderId: "747203949995",
    appId: "1:747203949995:web:9477ff66753fe2a6a74eee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const collectionsToUpload = {
  'arithmetic': arithmeticQuestions,
  'algebra': algebraQuestions,
  'geometry': geometryQuestions,
  'science': scienceQuestions,
  'history': historyQuestions,
  'geography': geographyQuestions,
};

async function uploadCollection(collectionName, data) {
  console.log(`Uploading to collection: ${collectionName}...`);
  const collectionRef = collection(db, collectionName);
  let count = 0;
  for (const item of data) {
    const docRef = doc(collectionRef, item.id);
    await setDoc(docRef, item);
    count++;
  }
  console.log(`✅ Successfully uploaded ${count} documents to ${collectionName}.`);
}

async function uploadAllData() {
  console.log('Starting data upload...');
  for (const [collectionName, data] of Object.entries(collectionsToUpload)) {
    await uploadCollection(collectionName, data);
  }
  console.log('\n--- All data uploaded successfully! ---');
  process.exit(0);
}

uploadAllData().catch(error => {
  console.error('❌ Upload failed:', error);
  process.exit(1);
});