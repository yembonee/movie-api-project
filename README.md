# Movie-API-App

## myFlix API
- API Live at https://rendermovieapi.onrender.com/

## Overview

This is a server side web application (for now) that provides users with information about different movies, directors, and genres. Users will be allowed to register and make an account, update their information, along with adding and removing movies from their Favorite Movie's list.

## App Usage
- Node.js
- MongoDB (used mongo shell for db)
- Postman (For CRUD testing)

## Features 
- Returns a List of Movies to the user
- Returns specific data of a single movie (by title) to the user
- Returns data about a genre (by name) to the user
- Returns information about a director (by name) to the user
- Allows new users to register
- Allows Users to update their personal information
- Allows users to add a movie to their Favorite Movie's list
- Allows users to remove a movie from their Favorite Movie's list
- Allows users to Deregister from the site

## Tasks Performed
- Created an Express Server from scratch
- Designed a REST API with "CRUD" functions
- Made a package.json file to track the libraries and depencies used in the app
- Built using MongoDB
- Movie Information coded in JSON format
- Error-Free Code
- All endpoints succesfully tested in Postman
- Code represents user authentication and authorization
- Meets data security regulations
- API deployed to Render

## Dependencies

### Frameworks
- Express.js

### Middleware
- Body-Parser: Used for handling the JSON and URL-encoded data
- CORS: Used for controlling acces to certain domains
- Morgan: Used to halde HTTP requests

### Libraries
- Bcrypt: Used for hashing passwords, making the security measures overall better
- JSONWebToken: Used for creating web tokens for users when they register, integrates authentication
- Mongoose: Used for MongoDB and some modeling in Node.js

## Email if any questions
> yemsonidowu@gmail.com