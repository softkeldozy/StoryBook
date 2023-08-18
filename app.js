const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo'); //must be below session
const connectDB = require('./config/db');

const app = express();

// logging request process to the console
// if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev'));
// }

// Load config file
dotenv.config({path:'./config/config.env'});

// Passport configuration
require('./config/passport')(passport)

// connecting to DB
connectDB();

// handlebars extension
app.engine('.hbs', exphbs.engine({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// static folder path
app.use(express.static(path.join(__dirname, "public")));

// Routes
// app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/', require('./routes/index'))

// Express sessions ---> should come before passport session
app.use(
  session({
  secret: 'keyboard cat',
  resave: false,  //dont save a session if nothing is modified
  saveUninitialized: false, // Dont create a session if nothing is stored
  store: MongoStore.create({mongoUrl: process.env.MONGO_URI})

}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());



// Port
const PORT = process.env.PORT || 4000
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`));
