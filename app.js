// const express = require('express');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const morgan = require('morgan');
// const exphbs = require('express-handlebars');
// const path = require('path');
// const passport = require('passport');
// const session = require('express-session');
// const MongoStore = require('connect-mongo'); //must be below session
// const connectDB = require('./config/db');

const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo'); //must be below session
const connectDB = require('./config/db')

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

// logging request process to the console
// if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev'));
// }

// Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require('./helpers/hb')

// Load config file
dotenv.config({path:'./config/config.env'});

// Passport configuration
require('./config/passport')(passport)

// connecting to DB
connectDB();

// handlebars extension
app.engine('.hbs', exphbs.engine({helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },defaultLayout: 'main', 
      extname: '.hbs'}));
app.set('view engine', '.hbs');

// static folder path
app.use(express.static(path.join(__dirname, "public")));

// Express sessions ---> should come before passport session
app.use(
  session({
  secret: 'keyboard cat',
  resave: false,  //dont save a session if nothing is modified
  saveUninitialized: false, // Dont create a session if nothing is stored
  store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
  })
)

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

// Port
const PORT = process.env.PORT || 4000
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`));
