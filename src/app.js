import log from 'gutil-color-log'
import express from 'express'
import path from 'path'
// import favicon from 'serve-favicon'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import passport from 'passport'
const GithubStrategy = require('passport-github').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
import session from 'express-session'
const MongoStore = require('connect-mongo')(session)

import User from './models/user'
import routes from './routes/index'
import auth from './routes/auth'

const generateOrFindUser = (accessToken, refreshToken, profile, done) => {
  if (profile.emails[0]) {
    User.findOneAndUpdate({
      email: profile.emails[0].value
    }, {
      name: profile.displayName || profile.username,
      email: profile.emails[0].value,
      photo: profile.photos[0].value
    }, {
      upsert: true
    }, done)
  } else {
    done(new Error('Your email privacy settings are invalid.'), null)
  }
}

// Configure GitHub Strategy
passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/github/return'
}, generateOrFindUser))

// Configure FacebookStrategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/return',
  profileFields: ['id', 'displayName', 'photos', 'email']
}, generateOrFindUser))

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser((userId, done) => {
  User.findById(userId, done)
})

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// mongodb connection
mongoose.connect('mongodb://localhost:27017/bookworm-oauth')
const db = mongoose.connection

// Session config for Passport and MongoDB
const sessionOptions = {
  secret: 'this is super secret weoweowee',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: db
  })
}

app.use(session(sessionOptions))

// Initialize passport
app.use(passport.initialize())

// Restore session
app.use(passport.session())

// mongo error
db.on('error', e => log('red', `Connection error: ${e}`))

app.use('/', routes)
app.use('/auth', auth)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

export default app
