const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
//FAcebook utilities
const FacebookStrategy = require('passport-facebook').Strategy;
const passport          =     require('passport');
const config            =     require('./config')
console.log('Loading environement variable');
dotenv.load();


//googleapi configuration
const {google} = require('googleapis');

const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: process.env.GOOGLE_REDIRECT_URL // this must match your google api settings
};
// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');
// Creates a client
const storage = new Storage();

console.log('Loading express configuration');
const app = express();


// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
// Use the FacebookStrategy within Passport.
passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret:config.facebook_api_secret ,
    callbackURL: config.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      //Further DB code.
      return done(null, profile);
    });
  }
));
//authentication with facebook
app.use(passport.initialize());
app.use(passport.session());
//authentication with facebook

// view engine setup
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set("view options", { layout: false })

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/img/', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    cookie: { maxAge: 60000*60*60 },
    secret: 'bscars_sid',
    resave: true,
    saveUninitialized: false
  })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

//==================Count of user

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Accept", 'application/json');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});


//==================Count of user

function getGooglePlusApi(auth) {
  return google.plus({ version: 'v1', auth });
} 

/**
 * Create the google url to be sent to the client.
 */
function urlGoogle() {
  const auth = createConnection(); // this is from previous step
  const url = getConnectionUrl(auth);
  return url;
}
/**
 * Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
 */
function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
    scope: defaultScope
  });
}
/**
 * This scope tells google what information we want to request.
 */
const defaultScope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
];
/**
 * Create the google auth object which gives us access to talk to google's apis.
 */
function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

// Handle auth failure error messages
app.use(function(req, res, next) {
 if (req && req.query && req.query.error) {
   req.flash("error", req.query.error);
 }
 if (req && req.query && req.query.error_description) {
   req.flash("error_description", req.query.error_description);
 }
 next();
});

// Check logged in
app.use(function(req, res, next) {
  res.locals.loggedIn = false;
  if (req.session.passport && typeof req.session.passport.user != 'undefined') {
    res.locals.loggedIn = true;
  }
  next();
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() || req.session.user != undefined) { return next(); }
  res.redirect('/login')
}

/*========================
========================== Application routes
==========================
=========================*/

const api = require('./routes/api');
const routes = require('./routes/index');
const cars = require('./controllers/CarsController');

app.use('/', routes);
app.use('/api/v1', api);
app.use('/cars', cars);

//Facebook Account
// app.get('/account', ensureAuthenticated, function(req, res){

//Passport Router
app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

//
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { 
     successRedirect : '/', 
     failureRedirect: '/login' 
  }),
function(req, res) {
  res.redirect('/');
});
//Lougout
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
/*========================
==========================
==========================
=========================*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  if (!req.session.userId) {
    req.session.user = null;        
  };
});

module.exports = app;
