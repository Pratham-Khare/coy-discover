// The only fields of a user that ever leave the server.
//
// This is a whitelist on purpose: if a field is added to the User model later
// (or someone attaches swipe data to a profile object), it is not sent to the
// client unless it is added here. No profile ever carries "liked you" information.
function publicProfile(user) {
  return {
    id: String(user._id),
    name: user.name,
    age: user.age,
    photo: user.photo,
    bio: user.bio,
    city: user.city,
    college: user.college,
    interests: user.interests,
  };
}

module.exports = publicProfile;
