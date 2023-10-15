const express = require('express'),
 morgan = require('morgan'),
 fs = require('fs'),
 path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

let topMovies = [
    {
        name: 'Interstellar',
        director: 'Christopher Nolan',
        summary: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.' 
    },
    {
        name: 'Rango',
        director: 'Gore Verbinski',
        summary: 'Rango is an ordinary chameleon who accidentally winds up in the town of Dirt, a lawless outpost in the Wild West in desperate need of a new sheriff.' 
    },
    {
        name: 'Django Unchained',
        director: 'Quentin Tarantino',
        summary: 'With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation owner in Mississippi.' 
    },
    {
        name: 'Midsommar',
        director: 'Ari Aster',
        summary: "A couple travels to Northern Europe to visit a rural hometown's fabled Swedish mid-summer festival. What begins as an idyllic retreat quickly devolves into an increasingly violent and bizarre competition at the hands of a pagan cult." 
    },
    {
        name: 'Akira',
        director: 'Katsuhiro Ôtomo',
        summary: 'A secret military project endangers Neo-Tokyo when it turns a biker gang member into a rampaging psychic psychopath who can only be stopped by a teenager, his gang of biker friends and a group of psychics.' 
    },
    {
        name: '1917',
        director: 'Sam Mendes',
        summary: 'April 6th, 1917. As an infantry battalion assembles to wage war deep in enemy territory, two soldiers are assigned to race against time and deliver a message that will stop 1,600 men from walking straight into a deadly trap.' 
    },
    {
        name: 'Prisoners',
        director: 'Denis Villeneuve',
        summary: "When Keller Dover's daughter and her friend go missing, he takes matters into his own hands as the police pursue multiple leads and the pressure mounts." 
    },
    {
        name: 'Soul',
        director: 'Pete Docter and Kemp Powers',
        summary: 'After landing the gig of a lifetime, a New York jazz pianist suddenly finds himself trapped in a strange land between Earth and the afterlife.' 
    },
    {
        name: 'A Silent Voice: The Movie',
        director: 'Naoko Yamada',
        summary: 'A young man is ostracized by his classmates after he bullies a deaf girl to the point where she moves away. Years later, he sets off on a path for redemption.' 
    },
    {
        name: 'Oppenheimer',
        director: 'Christopher Nolan',
        summary: 'The story of American scientist, J. Robert Oppenheimer, and his role in the development of the atomic bomb.' 
    }
];

app.use(morgan('combined', {stream: accessLogStream}));
//app.use(express.static('public'));
app.use('/public', express.static(path.join(__dirname, 'public')));


app.get('/movies', (req, res) => {
    res.json(topMovies);
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
