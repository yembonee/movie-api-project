const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  ImageURL: String,
  Ratings: [
    {
      UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      Value: { type: Number, min: 1, max: 5 },
    },
  ],
  AverageRating: { type: Number, default: 0 },
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

userSchema.statics.hashPassword = (Password) => {
  return bcrypt.hashSync(Password, 10);
};

userSchema.methods.validatePassword = function (Password) {
  return bcrypt.compareSync(Password, this.Password);
};

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
