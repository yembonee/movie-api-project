const express = require('express'),
 morgan = require('morgan'),
 fs = require('fs'),
 path = require('path'),
 bodyParser = require('body-parser'),
 uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

let users = [
    {
        id: 1,
        name: "Kim",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "Joe",
        favoriteMovies: ["Interstellar"]
    }
]

let topMovies = [
    {
        "Title":"Interstellar",
        "Genre": {
            "Name": "Drama",
            "Description": "Is a genre in which the composition and build up by the characters and/or director is heightened and put on display so the viewer can emotionally feel more of what is going on as well as staying invested in the story"
        },
        "Director": {
            "Name":"Christopher Nolan",
            "Birth":1970.0,
            "Bio":"Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made."
        },
        "ImageURL": "https://www.originalfilmart.com/cdn/shop/products/interstellar_2014_advance_original_film_art_682852f2-23f6-46de-a1db-4029d5b6f0b4_5000x.jpg?v=1574284010",
        "Description": "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
        "Featured": true
    },
    {
        "Title":'Rango',
        "Genre": {
            "Name": "Western Comedy",
            "Description": "Is a sub-form genre in which the style of movie is shot and setup as a classic western movie, with some comedic elements to give the movie more relief and less seriousness."
        },
        "Director": {
            "Name": "Gore Verbinksi",
            "Birth": 1964.0,
            "Bio": "Gore Verbinski, one of American cinema's most inventive directors who was a punk-rock guitarist as a teenager and had to sell his guitar to buy his first camera, is now the director of Pirates of the Caribbean: Dead Man's Chest (2006) which made the industry record for highest opening weekend of all time ($135,600,000) and grossed over $1 billion dollars worldwide."
        },
        "ImageURL": "https://www.moviepostersetc.com/_staticProxy/content/ff808081163c05b001169d6655243ae9/Rango_movie_poster_one-sheet.jpg",
        "Description": 'Rango is an ordinary chameleon who accidentally winds up in the town of Dirt, a lawless outpost in the Wild West in desperate need of a new sheriff.',
        "Featured": true
    },
    {
        "Title": 'Django Unchained',
        "Genre": {
            "Name": "Western",
            "Description": "Is a genre in which it ecapsulates the early ages of american culture based during the western times, typically containing cowboys and native americans."
        },
        "Director": {
            "Name": "Quentin Tarantino",
            "Birth": 1963.0,
            "Bio": "Quentin Jerome Tarantino was born in Knoxville, Tennessee. His father, Tony Tarantino, is an Italian-American actor and musician from New York, and his mother, Connie (McHugh), is a nurse from Tennessee. Quentin moved with his mother to Torrance, California, when he was four years old."
        },
        "ImageURL": "https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_FMjpg_UX1000_.jpg",
        "Description": 'With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation owner in Mississippi.',
        "Featured": true 
    },
    {
        "Title": 'Midsommar',
        "Genre": {
            "Name": "Horror",
            "Description": "Is a genre in which the point of the movie is to scare or disturb the audience. Typically containing jump-scares, sounds, and other directing techniques to make the viewer on edge."
        },
        "Director": {
            "Name": "Ari Aster",
            "Birth": 1986.0,
            "Bio": "Ari Aster is an American film director, screenwriter, and producer. He is known for writing and directing the A24 horror films Hereditary (2018) and Midsommar (2019). Aster was born into a Jewish family in New York City on July 15, 1986, the son of a poet mother and musician father. He has a younger brother. He recalled going to see his first movie, Dick Tracy, when he was four years old"
        },
        "ImageURL": "https://m.media-amazon.com/images/M/MV5BMzQxNzQzOTQwM15BMl5BanBnXkFtZTgwMDQ2NTcwODM@._V1_.jpg",
        "Description": "A couple travels to Northern Europe to visit a rural hometown's fabled Swedish mid-summer festival. What begins as an idyllic retreat quickly devolves into an increasingly violent and bizarre competition at the hands of a pagan cult.",
        "Feature": true 
    },
    {
        "Title": 'Akira',
        "Genre": {
            "Name": "Action",
            "Description": "Is a genre in which the movie is very theatrical and makes sure the viewer is always entertained. From explosions and gunfire, to romance and thievery, the action drama is a great genre where plenty of themes are apparent."
        },
        "Director": {
            "Name": 'Katsuhiro Ôtomo',
            "Birth": 1954.0,
            "Bio": "Katsuhiro Ôtomo is a Japanese manga artist, screenwriter and film director. He is best known as the creator of the manga Akira and its animated film adaptation."
        },
        "ImageURL": "https://www.limitedruns.com/media/cache/69/6d/696d915cd0690bd32801924937f5207a.jpg",
        "Description": 'A secret military project endangers Neo-Tokyo when it turns a biker gang member into a rampaging psychic psychopath who can only be stopped by a teenager, his gang of biker friends and a group of psychics.',
        "Feature": true
    },
    {
        "Title": '1917',
        "Genre": {
            "Name": "War",
            "Description": "Is a genre in which it is set during a war, typically WW1 or WW2 but not only contained to those two. War movies are supposed to be quite realistic and show the heroism or terrorism for what took place."
        },
        "Director": {
            "Name": "Sam Mendes",
            "Birth": 1965.0,
            "Bio": "Samuel Alexander Mendes was born on August 1, 1965 in Reading, England, UK to parents James Peter Mendes, a retired university lecturer, and Valerie Helene Mendes, an author who writes children's books. "
        },
        "ImageURL": "https://m.media-amazon.com/images/I/61yYNBjFRjL._AC_UF894,1000_QL80_.jpg",
        "Description": 'April 6th, 1917. As an infantry battalion assembles to wage war deep in enemy territory, two soldiers are assigned to race against time and deliver a message that will stop 1,600 men from walking straight into a deadly trap.',
        "Feature": true 
    },
    {
        "Title": 'Prisoners',
        "Genre": {
            "Name": "Crime",
            "Description": "Is a genre where a crime is the main theme of the movie, whether that be murder, fraud, or kid-napping. Typically these movies go through the perspective of the crime-doer or the person dealing with the crime."
        },
        "Director": {
            "Name": "Denis Villeneuve",
            "Birth": 1967.0,
            "Bio": "Denis Villeneuve is a French Canadian film director and writer. He was born in 1967, in Trois-Rivières, Québec, Canada. He started his career as a filmmaker at the National Film Board of Canada. He is best known for his feature films Arrival (2016), Sicario (2015), Prisoners (2013), Enemy (2013), and Incendies (2010). He is married to Tanya Lapointe."
        },
        "ImageURL": "https://m.media-amazon.com/images/I/71vRDJdr14L._AC_UF894,1000_QL80_.jpg",
        "Description": "When Keller Dover's daughter and her friend go missing, he takes matters into his own hands as the police pursue multiple leads and the pressure mounts.",
        "Feature": true
    },
    {
        "Title": 'Soul',
        "Genre": {
            "Name": "Adventure",
            "Description": "Is a genre in which the movie typically follows a protagonist on their journey. The journey can vary between many things, but overall it goes over what the protagonist does and the obstacles in their way."
        },
        "Director": {
            "Name": 'Pete Docter',
            "Birth": 1968.0,
            "Bio": "Pete Docter is the Oscar®-winning director of 'Monsters, Inc.,' 'Up,' and 'Inside Out,' and Chief Creative Officer at Pixar Animation Studios. He is currently directing Pixar's feature film 'Soul' with producer Dana Murray, which is set to release June 19, 2020."
        },
        "ImageURL": "https://i0.wp.com/pixarpost.com/wp-content/uploads/2020/10/b4786-pixar-soul-poster.jpg?fit=1182%2C1478&ssl=1",
        "Description": 'After landing the gig of a lifetime, a New York jazz pianist suddenly finds himself trapped in a strange land between Earth and the afterlife.',
        "Feature": false
    },
    {
        "Title": 'A Silent Voice',
        "Genre": {
            "Name": "Drama",
            "Description": "Is a genre in which the composition and build up by the characters and/or director is heightened and put on display so the viewer can emotionally feel more of what is going on as well as staying invested in the story"
        },
        "Director": {
            "Name": 'Naoko Yamada',
            "Birth": 1984.0,
            "Bio": "Naoko Yamada is a Japanese animator, television and film director. Working at Kyoto Animation, she directed the K-On! and Tamako Market anime series and the anime film A Silent Voice."
        },
        "ImageURL": "https://m.media-amazon.com/images/M/MV5BZGRkOGMxYTUtZTBhYS00NzI3LWEzMDQtOWRhMmNjNjJjMzM4XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        "Description": 'A young man is ostracized by his classmates after he bullies a deaf girl to the point where she moves away. Years later, he sets off on a path for redemption.',
        "Feature": true 
    },
    {
        "Title": 'Oppenheimer',
        "Genre": {
            "Name": "Drama",
            "Description": "Is a genre in which the composition and build up by the characters and/or director is heightened and put on display so the viewer can emotionally feel more of what is going on as well as staying invested in the story"
        },
        "Director": {
            "Name":"Christopher Nolan",
            "Birth":1970.0,
            "Bio":"Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made."
        },
        "ImageURL": "https://m.media-amazon.com/images/I/71xDtUSyAKL._AC_UF894,1000_QL80_.jpg",
        "Description": 'The story of American scientist, J. Robert Oppenheimer, and his role in the development of the atomic bomb.',
        "Feature": true 
    }
];

app.use(morgan('combined', {stream: accessLogStream}));
//app.use(express.static('public'));
app.use('/public', express.static(path.join(__dirname, 'public')));


//CREATE
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('users need names')
    }
});

app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
        res.status(400).send('no such movie');
    }
});

// READ
app.get('/movies', (req, res) => {
    res.status(200).json(topMovies);
});

app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = topMovies.find( movie => movie.Title === title );

    if (movie) {
        res.status(200).json(movie);
    } else {
        req.status(400).send('no such movie')
    }
});

app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = topMovies.find( movie => movie.Genre.Name === genreName ).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        req.status(400).send('no such genre')
    }
});


app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = topMovies.find( movie => movie.Director.Name === directorName ).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        req.status(400).send('no such director')
    }
});

app.get('/users', (req, res) => {
    res.status(200).json(users);
})

//UPDATE

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id );

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user');
    }
});

//DELETE

app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    } else {
        res.status(400).send('no such movie');
    }
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`User ${id} has been deleted`);
    } else {
        res.status(400).send('no such user');
    }
});


app.get('/', (req, res) => {
    res.send('Welcome to my Movie Site!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something Broke!');
});

app.listen(7070, () => {
    console.log('Your app is listening on port 7070');
});
