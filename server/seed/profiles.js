// Mock data for the demo. Photos are placeholder portraits from randomuser.me.
// `likesMe: true` means this profile has already liked the logged-in user, so
// liking them back creates a match. The flag only exists in the seed data and
// is never stored on the profile.

const photo = (gender, n) => `https://randomuser.me/api/portraits/${gender}/${n}.jpg`;

const currentUser = {
  name: 'Arjun',
  age: 22,
  photo: photo('men', 32),
  bio: 'Final-year CS student. Coffee, code and long walks.',
  city: 'Bengaluru',
  college: 'RV College of Engineering',
  interests: ['Coding', 'Coffee', 'Football'],
};

const profiles = [
  { name: 'Ananya', age: 21, photo: photo('women', 44), bio: 'Bookworm with a soft spot for rainy days and filter coffee.', city: 'Bengaluru', college: 'Christ University', interests: ['Reading', 'Coffee', 'Poetry'], likesMe: true },
  { name: 'Riya', age: 22, photo: photo('women', 65), bio: 'Will trade memes for momos. Learning the guitar, badly.', city: 'Delhi', college: 'Lady Shri Ram College', interests: ['Music', 'Memes', 'Food'] },
  { name: 'Kabir', age: 23, photo: photo('men', 75), bio: 'Weekend trekker, weekday debugger.', city: 'Pune', college: 'COEP', interests: ['Trekking', 'Tech', 'Photography'] },
  { name: 'Meera', age: 20, photo: photo('women', 12), bio: 'Classical dancer who secretly loves heavy metal.', city: 'Chennai', college: 'Stella Maris College', interests: ['Dance', 'Metal', 'Travel'], likesMe: true },
  { name: 'Ishaan', age: 24, photo: photo('men', 11), bio: 'Startup intern. Ask me about my 14 side projects.', city: 'Bengaluru', college: 'IIIT Bangalore', interests: ['Startups', 'Cycling', 'Chess'] },
  { name: 'Sanya', age: 22, photo: photo('women', 23), bio: 'Sunsets, sketchbooks and spontaneous road trips.', city: 'Mumbai', college: "St. Xavier's College", interests: ['Art', 'Road trips', 'Indie music'] },
  { name: 'Aditya', age: 21, photo: photo('men', 46), bio: 'Gym in the morning, anime at night.', city: 'Hyderabad', college: 'BITS Hyderabad', interests: ['Fitness', 'Anime', 'Gaming'] },
  { name: 'Tara', age: 23, photo: photo('women', 68), bio: 'Plant mom of 23. Yes, they all have names.', city: 'Bengaluru', college: 'NIFT Bengaluru', interests: ['Plants', 'Design', 'Thrifting'], likesMe: true },
  { name: 'Vikram', age: 25, photo: photo('men', 52), bio: 'Amateur chef. My biryani has fans.', city: 'Hyderabad', college: 'Osmania University', interests: ['Cooking', 'Cricket', 'Movies'] },
  { name: 'Nisha', age: 21, photo: photo('women', 33), bio: 'Debate team captain. I will win the argument about pineapple pizza.', city: 'Kolkata', college: 'Jadavpur University', interests: ['Debating', 'Pizza', 'Politics'] },
  { name: 'Rohan', age: 22, photo: photo('men', 22), bio: 'Drummer in a college band nobody has heard of (yet).', city: 'Mumbai', college: 'NMIMS', interests: ['Drums', 'Concerts', 'Football'], likesMe: true },
  { name: 'Diya', age: 20, photo: photo('women', 50), bio: 'Astronomy nerd. Let me show you Saturn through my telescope.', city: 'Pune', college: 'Fergusson College', interests: ['Astronomy', 'Science', 'Stargazing'] },
  { name: 'Karan', age: 24, photo: photo('men', 64), bio: 'Product designer who over-thinks fonts.', city: 'Gurugram', college: 'NID Ahmedabad', interests: ['Design', 'Typography', 'Coffee'] },
  { name: 'Aisha', age: 23, photo: photo('women', 79), bio: 'Med student surviving on chai and sarcasm.', city: 'Delhi', college: 'Maulana Azad Medical College', interests: ['Medicine', 'Chai', 'Stand-up comedy'] },
  { name: 'Dev', age: 21, photo: photo('men', 8), bio: 'Basketball, beats and bad puns.', city: 'Chandigarh', college: 'Punjab University', interests: ['Basketball', 'Music production', 'Puns'] },
  { name: 'Pooja', age: 22, photo: photo('women', 17), bio: 'Marathon runner. Next goal: a full 42K.', city: 'Bengaluru', college: 'PES University', interests: ['Running', 'Fitness', 'Podcasts'], likesMe: true },
  { name: 'Arnav', age: 23, photo: photo('men', 36), bio: 'Film buff. Will judge you (lovingly) by your Letterboxd.', city: 'Kolkata', college: 'Presidency University', interests: ['Cinema', 'Writing', 'Coffee'] },
  { name: 'Zoya', age: 21, photo: photo('women', 90), bio: 'Baker of very questionable but tasty cakes.', city: 'Lucknow', college: 'Lucknow University', interests: ['Baking', 'Cats', 'K-dramas'] },
  { name: 'Siddharth', age: 22, photo: photo('men', 85), bio: 'Robotics club lead. I build things that occasionally move.', city: 'Chennai', college: 'IIT Madras', interests: ['Robotics', 'Electronics', 'Sci-fi'] },
  { name: 'Kavya', age: 24, photo: photo('women', 5), bio: 'Travelled to 12 states and counting.', city: 'Jaipur', college: 'Manipal University Jaipur', interests: ['Travel', 'Photography', 'Food'], likesMe: true },
  { name: 'Yash', age: 20, photo: photo('men', 41), bio: 'Esports at night, economics by day.', city: 'Ahmedabad', college: 'Ahmedabad University', interests: ['Gaming', 'Economics', 'Esports'] },
  { name: 'Ira', age: 22, photo: photo('women', 37), bio: 'Writing my first novel, one coffee at a time.', city: 'Goa', college: 'Goa University', interests: ['Writing', 'Beaches', 'Jazz'] },
  { name: 'Neel', age: 23, photo: photo('men', 59), bio: 'Wildlife photographer in training.', city: 'Bhopal', college: 'MANIT Bhopal', interests: ['Wildlife', 'Photography', 'Hiking'] },
  { name: 'Shreya', age: 21, photo: photo('women', 26), bio: 'Bharatanatyam and bouldering. Balance is everything.', city: 'Bengaluru', college: 'Mount Carmel College', interests: ['Dance', 'Bouldering', 'Yoga'] },
  { name: 'Aryan', age: 24, photo: photo('men', 17), bio: 'Finance grad who would rather be surfing.', city: 'Mumbai', college: 'HR College', interests: ['Surfing', 'Finance', 'Travel'], likesMe: true },
  { name: 'Mahi', age: 20, photo: photo('women', 58), bio: 'Animal shelter volunteer. My dog approves of you already.', city: 'Indore', college: 'DAVV Indore', interests: ['Dogs', 'Volunteering', 'Music'] },
  { name: 'Reyansh', age: 22, photo: photo('men', 91), bio: 'Stand-up open mic regular. Laugh at my jokes, please.', city: 'Delhi', college: 'Hindu College', interests: ['Comedy', 'Writing', 'Cricket'] },
  { name: 'Anika', age: 23, photo: photo('women', 72), bio: 'UX researcher. I ask a lot of questions.', city: 'Hyderabad', college: 'IIIT Hyderabad', interests: ['UX', 'Psychology', 'Board games'] },
  { name: 'Veer', age: 21, photo: photo('men', 3), bio: 'Football on Sundays, biryani after.', city: 'Kochi', college: 'CUSAT', interests: ['Football', 'Food', 'Travel'] },
  { name: 'Lavanya', age: 22, photo: photo('women', 81), bio: 'Carnatic singer and part-time coder.', city: 'Chennai', college: 'Anna University', interests: ['Singing', 'Coding', 'Temples'] },
];

module.exports = { currentUser, profiles };
