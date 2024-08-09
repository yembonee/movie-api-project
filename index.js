const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const fileupload = require("express-fileupload");
const path = require("path");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { pipeline } = require("stream");
const { promisify } = require("util");
/*const AWS = require("aws-sdk");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
*/

//mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI || "mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/*
const s3 = new AWS.S3();
const bucketName = "my-image-bucket-2-6";
*/

const app = express();
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");

let allowedOrigins = [
  "http://localhost:1234",
  "http://localhost:7070",
  "http://localhost:4200",
  "https://myflixforus.netlify.app",
  "https://rendermovieapi.onrender.com",
  "https://meek-alfajores-f2f0db.netlify.app",
  "https://65dcf1ce9879f7263035522a--meek-alfajores-f2f0db.netlify.app",
  "https://my-career-foundry-exercise-bucket-site-us-west-2.s3.us-west-2.amazonaws.com",
  "http://35.94.33.77",
];

//app.use(cors());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let message =
          "The CORS policy for this application doesn't allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

let auth = require("./auth.js")(app);
const passport = require("passport");
const { S3 } = require("aws-sdk");
const { exit } = require("process");
require("./passport.js");

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

let users = [
  {
    id: 1,
    Username: "austin321",
    Password: "password123",
    Email: "austint2002@gmail.com",
    Birthday: "2002-07-27",
    FavoriteMovies: ["Rango"],
  },
  {
    id: 2,
    Username: "andrew.27",
    Password: "testing321",
    Email: "andrewjrhogue123@gmail.com",
    Birthday: "2003-09-27",
    FavoriteMovies: ["Interstellar"],
  },
  {
    id: 3,
    Username: "yemson101",
    Password: "chickenburger321",
    Email: "yemidowu247@gmail.com",
    Birthday: "2001-07-24",
    FavoriteMovies: ["Akira"],
  },
  {
    id: 4,
    Username: "marypoppins707",
    Password: "passcode321",
    Email: "sleepingdog@gmail.com",
    Birthday: "1992-02-13",
    FavoriteMovies: ["A Silent Voice"],
  },
];

let movies = [
  {
    Title: "Interstellar",
    Genre: {
      Name: "Drama",
      Description:
        "Is a genre in which the composition and build up by the characters and/or director is heightened and put on display so the viewer can emotionally feel more of what is going on as well as staying invested in the story",
    },
    Director: {
      Name: "Christopher Nolan",
      Birth: 1970.0,
      Bio: "Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made.",
    },
    ImageURL:
      "https://www.originalfilmart.com/cdn/shop/products/interstellar_2014_advance_original_film_art_682852f2-23f6-46de-a1db-4029d5b6f0b4_5000x.jpg?v=1574284010",
    Description:
      "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    Featured: true,
  },
  {
    Title: "Rango",
    Genre: {
      Name: "Western",
      Description:
        "Is a genre in which it ecapsulates the early ages of american culture based during the western times, typically containing cowboys and native americans.",
    },
    Director: {
      Name: "Gore Verbinksi",
      Birth: 1964.0,
      Bio: "Gore Verbinski, one of American cinema's most inventive directors who was a punk-rock guitarist as a teenager and had to sell his guitar to buy his first camera, is now the director of Pirates of the Caribbean: Dead Man's Chest (2006) which made the industry record for highest opening weekend of all time ($135,600,000) and grossed over $1 billion dollars worldwide.",
    },
    ImageURL:
      "https://www.moviepostersetc.com/_staticProxy/content/ff808081163c05b001169d6655243ae9/Rango_movie_poster_one-sheet.jpg",
    Description:
      "Rango is an ordinary chameleon who accidentally winds up in the town of Dirt, a lawless outpost in the Wild West in desperate need of a new sheriff.",
    Featured: true,
  },
  {
    Title: "Django Unchained",
    Genre: {
      Name: "Western",
      Description:
        "Is a genre in which it ecapsulates the early ages of american culture based during the western times, typically containing cowboys and native americans.",
    },
    Director: {
      Name: "Quentin Tarantino",
      Birth: 1963.0,
      Bio: "Quentin Jerome Tarantino was born in Knoxville, Tennessee. His father, Tony Tarantino, is an Italian-American actor and musician from New York, and his mother, Connie (McHugh), is a nurse from Tennessee. Quentin moved with his mother to Torrance, California, when he was four years old.",
    },
    ImageURL:
      "https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_FMjpg_UX1000_.jpg",
    Description:
      "With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation owner in Mississippi.",
    Featured: true,
  },
  {
    Title: "Midsommar",
    Genre: {
      Name: "Horror",
      Description:
        "Is a genre in which the point of the movie is to scare or disturb the audience. Typically containing jump-scares, sounds, and other directing techniques to make the viewer on edge.",
    },
    Director: {
      Name: "Ari Aster",
      Birth: 1986.0,
      Bio: "Ari Aster is an American film director, screenwriter, and producer. He is known for writing and directing the A24 horror films Hereditary (2018) and Midsommar (2019). Aster was born into a Jewish family in New York City on July 15, 1986, the son of a poet mother and musician father. He has a younger brother. He recalled going to see his first movie, Dick Tracy, when he was four years old",
    },
    ImageURL:
      "https://m.media-amazon.com/images/M/MV5BMzQxNzQzOTQwM15BMl5BanBnXkFtZTgwMDQ2NTcwODM@._V1_.jpg",
    Description:
      "A couple travels to Northern Europe to visit a rural hometown's fabled Swedish mid-summer festival. What begins as an idyllic retreat quickly devolves into an increasingly violent and bizarre competition at the hands of a pagan cult.",
    Feature: true,
  },
  {
    Title: "Akira",
    Genre: {
      Name: "Action",
      Description:
        "Is a genre in which the movie is very theatrical and makes sure the viewer is always entertained. From explosions and gunfire, to romance and thievery, the action drama is a great genre where plenty of themes are apparent.",
    },
    Director: {
      Name: "Katsuhiro Ôtomo",
      Birth: 1954.0,
      Bio: "Katsuhiro Ôtomo is a Japanese manga artist, screenwriter and film director. He is best known as the creator of the manga Akira and its animated film adaptation.",
    },
    ImageURL:
      "https://www.limitedruns.com/media/cache/69/6d/696d915cd0690bd32801924937f5207a.jpg",
    Description:
      "A secret military project endangers Neo-Tokyo when it turns a biker gang member into a rampaging psychic psychopath who can only be stopped by a teenager, his gang of biker friends and a group of psychics.",
    Feature: true,
  },
  {
    Title: "1917",
    Genre: {
      Name: "War",
      Description:
        "Is a genre in which it is set during a war, typically WW1 or WW2 but not only contained to those two. War movies are supposed to be quite realistic and show the heroism or terrorism for what took place.",
    },
    Director: {
      Name: "Sam Mendes",
      Birth: 1965.0,
      Bio: "Samuel Alexander Mendes was born on August 1, 1965 in Reading, England, UK to parents James Peter Mendes, a retired university lecturer, and Valerie Helene Mendes, an author who writes children's books.",
    },
    ImageURL:
      "https://m.media-amazon.com/images/I/61yYNBjFRjL._AC_UF894,1000_QL80_.jpg",
    Description:
      "April 6th, 1917. As an infantry battalion assembles to wage war deep in enemy territory, two soldiers are assigned to race against time and deliver a message that will stop 1,600 men from walking straight into a deadly trap.",
    Feature: true,
  },
  {
    Title: "Prisoners",
    Genre: {
      Name: "Crime",
      Description:
        "Is a genre where a crime is the main theme of the movie, whether that be murder, fraud, or kid-napping. Typically these movies go through the perspective of the crime-doer or the person dealing with the crime.",
    },
    Director: {
      Name: "Denis Villeneuve",
      Birth: 1967.0,
      Bio: "Denis Villeneuve is a French Canadian film director and writer. He was born in 1967, in Trois-Rivières, Québec, Canada. He started his career as a filmmaker at the National Film Board of Canada. He is best known for his feature films Arrival (2016), Sicario (2015), Prisoners (2013), Enemy (2013), and Incendies (2010). He is married to Tanya Lapointe.",
    },
    ImageURL:
      "https://m.media-amazon.com/images/I/71vRDJdr14L._AC_UF894,1000_QL80_.jpg",
    Description:
      "When Keller Dover's daughter and her friend go missing, he takes matters into his own hands as the police pursue multiple leads and the pressure mounts.",
    Feature: true,
  },
  {
    Title: "Soul",
    Genre: {
      Name: "Adventure",
      Description:
        "Is a genre in which the movie typically follows a protagonist on their journey. The journey can vary between many things, but overall it goes over what the protagonist does and the obstacles in their way.",
    },
    Director: {
      Name: "Pete Docter",
      Birth: 1968.0,
      Bio: "Pete Docter is the Oscar®-winning director of 'Monsters, Inc.,' 'Up,' and 'Inside Out,' and Chief Creative Officer at Pixar Animation Studios. He is currently directing Pixar's feature film 'Soul' with producer Dana Murray, which is set to release June 19, 2020.",
    },
    ImageURL:
      "https://i0.wp.com/pixarpost.com/wp-content/uploads/2020/10/b4786-pixar-soul-poster.jpg?fit=1182%2C1478&ssl=1",
    Description:
      "After landing the gig of a lifetime, a New York jazz pianist suddenly finds himself trapped in a strange land between Earth and the afterlife.",
    Feature: false,
  },
  {
    Title: "A Silent Voice",
    Genre: {
      Name: "Drama",
      Description:
        "Is a genre in which the composition and build up by the characters and/or director is heightened and put on display so the viewer can emotionally feel more of what is going on as well as staying invested in the story",
    },
    Director: {
      Name: "Naoko Yamada",
      Birth: 1984.0,
      Bio: "Naoko Yamada is a Japanese animator, television and film director. Working at Kyoto Animation, she directed the K-On! and Tamako Market anime series and the anime film A Silent Voice.",
    },
    ImageURL:
      "https://m.media-amazon.com/images/M/MV5BZGRkOGMxYTUtZTBhYS00NzI3LWEzMDQtOWRhMmNjNjJjMzM4XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    Description:
      "A young man is ostracized by his classmates after he bullies a deaf girl to the point where she moves away. Years later, he sets off on a path for redemption.",
    Feature: true,
  },
  {
    Title: "Oppenheimer",
    Genre: {
      Name: "Drama",
      Description:
        "Is a genre in which the composition and build up by the characters and/or director is heightened and put on display so the viewer can emotionally feel more of what is going on as well as staying invested in the story",
    },
    Director: {
      Name: "Christopher Nolan",
      Birth: 1970.0,
      Bio: "Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made.",
    },
    ImageURL:
      "https://m.media-amazon.com/images/I/71xDtUSyAKL._AC_UF894,1000_QL80_.jpg",
    Description:
      "The story of American scientist, J. Robert Oppenheimer, and his role in the development of the atomic bomb.",
    Feature: true,
  },
];

app.use(morgan("combined", { stream: accessLogStream }));
//app.use(express.static('public'));
app.use("/public", express.static(path.join(__dirname, "public")));

//CREATE

/**
 * @description Create User
 * @name POST /users
 * @example
 * Authentication: none
 * @example
 * Request Data format
 * {
 *  "Username": "",
 *  "Password": "",
 *  "Email": "",
 *  "Birthday": ""
 * }
 * @example
 * Response data format
 * {
 *  "Username": "",
 *  "Password": "",
 *  "Email": "",
 *  "Birthday": Date,
 *  "FavoriteMovies: [ObjectID]"
 * }
 */

app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error:" + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error" + error);
      });
  }
);

/**
 * @description Puts Movie in user's favorite movie list
 * @name POST /users/:Username/movies/:MovieID
 * @example
 * Authentication: Bearer Token (JWT)
 * @example
 * Request Data format
 * {
 *  "Username": "",
 *  "MovieID": ObjectID
 * }
 * @example
 * Response data format
 * {
 *  "FavoriteMovies: [ObjectID]"
 * }
 */

app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error " + err);
      });
  }
);

/**
 * @description Adding a Rating to a movie
 * @name POST /movies/:MovieID/rate
 * @example
 * Authentication: Bearer Token (jwt)
 * @example
 * Request Data Format
 * {
 *  "Rating": 5
 * }
 * @example
 * Response data Format
 * {
 *  "Movie": {
 *    "Ratings": [
 *      {
 *        "User": ObjectId,
 *        "Rating": 5
 *     }
 *   ]
 *  }
 * }
 */

app.post(
  "/movies/:MovieID/rate",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { Rating } = req.body;
    const userId = req.user._id;

    if (!Rating || Rating < 0 || Rating > 5) {
      return res
        .status(400)
        .send("Invalid Rating. Rating must be between 0 and 5.");
    }

    try {
      const movie = await Movies.findById(req.params.MovieID);
      if (!movie) {
        return res.status(404).send("Moive not Found!");
      }

      const existingRating = movie.Ratings.find(
        (rating) => rating.User.toString() === userId.toString()
      );

      if (existingRating) {
        existingRating.Rating = Rating;
      } else {
        movie.Ratings.push({ User: userId, Rating });
      }

      await movie.save();
      return res.status(200).json(movie);
    } catch {
      console.error(err);
      return res.status(500).send("Error: " + err);
    }
  }
);

// READ

/**
 * @description Get all movies
 * @name GET /movies
 * @example
 * Authentication: Bearer Token (JWT)
 * @example
 * Request data format
 * none
 * @example
 * Response data format
 * [
 *  {
      "_id: ObjectID",
      "Title": "",
      "Genre": ObjectID,
      "Director": ObjectID,
      "ImageURL": "",
      "Description": ObjectID,
      "Featured": Boolean
 *  }
 * ]
 *
 */

app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @description Get One movie by title
 * @name GET /movies/:Title
 * @example
 * Authentication: Bearer Token (JWT)
 * @example
 * Request data format
 * none
 * @example
 * Response data format
 * {
    "_id: ObjectID",
    "Title": "",
    "Genre": ObjectID,
    "Director": ObjectID,
    "ImageURL": "",
    "Description": ObjectID,
    "Featured": Boolean
 * }
 */

app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @description Get Genre by name
 * @name GET /movies/genre/:genreName
 * @example
 * Authentication: Bearer Token (JWT)
 * @example
 * Request data format
 * none
 * @example
 * Response data format
 * {
    "Name": "",
    "Description": ""
 * }
 */

app.get(
  "/movies/genre/:genreName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ "Genre.Name": req.params.genreName })
      .then((movie) => {
        res.status(200).json(movie.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @description Get Director by name
 * @name GET /movies/director/:directorName
 * @example
 * Authentication: Bearer Token (JWT)
 * @example
 * Request data format
 * none
 * @example
 * Response data format
 * {
    "Name": "",
    "Birth": Date,
    "Bio": ""
 * }
 */

app.get(
  "/movies/director/:directorName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ "Director.Name": req.params.directorName })
      .then((movie) => {
        res.status(200).json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @description Get all users
 * @name GET /users
 * @example
 * Authentication: Bearer Token (JWT)
 * @example
 * Request data format
 * none
 * @example
 * Response data format
 * [
 *  {
      "_id: ObjectID",
      "Username": "",
      "Password": "",
      "Email": "",
      "Birthday": Date,
      "FavoriteMovies": [ObjectID]
 *  }
 * ]
 *
 */

app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @description Get one user by username
 * @name GET /users/:Username
 * @example
 * Authentication: Bearer Token (JWT)
 * @example
 * Request data format
 * none
 * @example
 * Response data format
 *  {
      "_id: ObjectID",
      "Username": "",
      "Password": "",
      "Email": "",
      "Birthday": Date,
      "FavoriteMovies": [ObjectID]
 *  }
 */

app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//UPDATE

/**
 * @description Updates user info
 * @name PUT /users/:Username
 * @example
 * Authentication: Bearer Token (JWT)
 * @example
 * Request Data format
 * {
 *  "Username": "",
 *  "Password": "",
 *  "Email": "",
 *  "Birthday": ""
 * }
 * @example
 * Response data format
 * {
 *  "Username": "",
 *  "Password": "",
 *  "Email": "",
 *  "Birthday": Date,
 *  "FavoriteMovies: [ObjectID]"
 * }
 */

app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission Denied");
    }
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error ", +err);
      });
  }
);

/**
 * @description Get the average rating of a movie
 * @name GET /movies/:MovieID/average-rating
 * @example
 * Authentication: none
 * @example
 * Response data format
 * {
 *  "AverageRating": 4.5
 * }
 */

app.get("/movies/:MovieID/average-rating", async (req, res) => {
  try {
    const movie = await Movies.findById(req.params.MovieID);

    if (!movie) {
      return res.status(404).send("Movie not Found.");
    }

    const ratings = movie.Ratings.map((rating) => rating.Rating);
    const averageRating =
      ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length || 0;
    return res.status(200).json({ AverageRating: averageRating });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error: " + err);
  }
});

//DELETE

/**
 * @description Removes movie from user's favorite movie list
 * @name DELETE /users/:Username/movie/:MovieID
 * @example
 * Authentication: Bearer Token (JWT)
 * @example
 * Request Data format
 * {
 *  "Username": "",
    "MovieID": ObjectID
 * }
 * @example
 * Response data format
 * {
 *  "FavoriteMovies: [ObjectID]"
 * }
 */

app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User doesn't exist");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @description Removes user
 * @name DELETE /users/:Username
 * @example
 * Authentication: Bearer Token (JWT)
 * @example
 * Request Data format
 * {
 *  "Username": "",
 * }
 * @example
 * Response data format
 * none
 */

app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @description Welcome Page
 * @name GET /
 * @example
 * Authentication: None
 */

app.get("/", (req, res) => {
  res.send("Welcome to my Movie Site!");
});

/*

// THIS IS THE START OF MY AWS IMPLEMENTAION

app.get("/retrieve/:key", (req, res) => {
  const key = req.params.key;

  const params = {
    Bucket: bucketName,
    Key: key,
  };

  s3.getObject(params, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(data.Body);
  });
});

app.get("/list", (req, res) => {
  const params = {
    Bucket: bucketName,
  };

  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(data.Contents);
  });
});

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  const fileContent = fs.readFileSync(file.path);

  const params = {
    Bucket: bucketName,
    Key: file.originalname,
    Body: fileContent,
  };

  s3.upload(params, (err, data) => {
    fs.unlinkSync(file.path);
    if (err) {
      return res.status(500).send(err);
    }
    res.send(`File uploaded successfully. ${data.Location}`);
  });
});
*/

// THIS IS THE END OF MY AWS IMPLEMENTAION

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke!");
});

const port = process.env.PORT || 7070;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
