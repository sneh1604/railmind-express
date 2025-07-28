// src/data/levels.js

export const levels = [
  {
    levelNumber: 1,
    journeyName: 'The Deccan Start',
    startCity: 'Mumbai',
    endCity: 'Pune',
    stations: ['Mumbai', 'Pune'],
    badgeReward: 'first-journey', // Level 1 = First Journey badge
    subjects: ['geography', 'arithmetic'],
    difficultyRange: [1, 2],
    questionCount: 5,
    imageUrl: 'https://live.staticflickr.com/4196/34454753533_ea6353ca87_b.jpg', // Pune
  },
  {
    levelNumber: 2,
    journeyName: 'Southern Sprint',
    startCity: 'Pune',
    endCity: 'Bengaluru',
    stations: ['Pune', 'Hyderabad', 'Bengaluru'],
    badgeReward: 'royal-rider', // Level 2 = Royal Rider (Rajasthan/royal cities theme)
    subjects: ['science', 'algebra'],
    difficultyRange: [2, 3],
    questionCount: 8,
    imageUrl: 'https://lp-cms-production.imgix.net/2019-06/9483508eeee2b78a7356a15ed9c337a1-bengaluru-bangalore.jpg',
   }, // Bengaluru
  {
    levelNumber: 3,
    journeyName: 'Coromandel Coast',
    startCity: 'Bengaluru',
    endCity: 'Kolkata',
    stations: ['Bengaluru', 'Chennai', 'Kolkata'],
    badgeReward: 'eastern-express', // Level 3 = Eastern Express (to Kolkata)
    subjects: ['history', 'geometry'],
    difficultyRange: [3, 4],
    questionCount: 10,
    imageUrl: 'https://s7ap1.scene7.com/is/image/incredibleindia/howrah-bridge-howrah-west-bengal-city-1-hero?qlt=82&ts=1742154305591', // Kolkata
  },
  {
    levelNumber: 4,
    journeyName: 'The Grand Trunk',
    startCity: 'Kolkata',
    endCity: 'Jaipur',
    stations: ['Kolkata', 'Delhi', 'Jaipur'],
    badgeReward: 'coastal-cruiser', // Level 4 = Coastal Cruiser
    subjects: ['science', 'history', 'arithmetic'],
    difficultyRange: [3, 4],
    questionCount: 12,
    imageUrl: 'https://www.worldtribune.org/wp-content/uploads/sites/2/2024/01/GettyImages-1191232894.jpg', // Jaipur
  },
  {
    levelNumber: 5,
    journeyName: 'The Final Run',
    startCity: 'Jaipur',
    endCity: 'Mumbai',
    stations: ['Jaipur', 'Ahmedabad', 'Mumbai'],
    badgeReward: 'rail-master', // Updated to match badges.js
    subjects: ['geography', 'algebra', 'geometry'],
    difficultyRange: [4, 5],
    questionCount: 15,
    imageUrl: 'https://www.andbeyond.com/wp-content/uploads/sites/5/Chhatrapati-Shivaji-Terminus-railway-station-mumbai.jpg', // Mumbai
  },
];