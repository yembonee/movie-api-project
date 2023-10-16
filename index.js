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
            "Name":"Chrisopher Nolan",
            "Birth":1970.0,
            "Bio":"Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made."
        },
        "ImageURL": "https://www.originalfilmart.com/cdn/shop/products/interstellar_2014_advance_original_film_art_682852f2-23f6-46de-a1db-4029d5b6f0b4_5000x.jpg?v=1574284010",
        "Description": "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
        "Featured": true 
    },
    {
        title: 'Rango',
        director: 'Gore Verbinski',
        summary: 'Rango is an ordinary chameleon who accidentally winds up in the town of Dirt, a lawless outpost in the Wild West in desperate need of a new sheriff.' 
    },
    {
        title: 'Django Unchained',
        director: 'Quentin Tarantino',
        summary: 'With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation owner in Mississippi.' 
    },
    {
        title: 'Midsommar',
        director: 'Ari Aster',
        summary: "A couple travels to Northern Europe to visit a rural hometown's fabled Swedish mid-summer festival. What begins as an idyllic retreat quickly devolves into an increasingly violent and bizarre competition at the hands of a pagan cult." 
    },
    {
        title: 'Akira',
        director: 'Katsuhiro Ôtomo',
        summary: 'A secret military project endangers Neo-Tokyo when it turns a biker gang member into a rampaging psychic psychopath who can only be stopped by a teenager, his gang of biker friends and a group of psychics.' 
    },
    {
        title: '1917',
        director: 'Sam Mendes',
        summary: 'April 6th, 1917. As an infantry battalion assembles to wage war deep in enemy territory, two soldiers are assigned to race against time and deliver a message that will stop 1,600 men from walking straight into a deadly trap.' 
    },
    {
        title: 'Prisoners',
        director: 'Denis Villeneuve',
        summary: "When Keller Dover's daughter and her friend go missing, he takes matters into his own hands as the police pursue multiple leads and the pressure mounts." 
    },
    {
        title: 'Soul',
        director: 'Pete Docter and Kemp Powers',
        summary: 'After landing the gig of a lifetime, a New York jazz pianist suddenly finds himself trapped in a strange land between Earth and the afterlife.' 
    },
    {
        title: 'A Silent Voice: The Movie',
        director: 'Naoko Yamada',
        summary: 'A young man is ostracized by his classmates after he bullies a deaf girl to the point where she moves away. Years later, he sets off on a path for redemption.' 
    },
    {
        title: 'Oppenheimer',
        director: 'Christopher Nolan',
        summary: 'The story of American scientist, J. Robert Oppenheimer, and his role in the development of the atomic bomb.' 
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
