var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var compression = require('compression');
var fs = require('fs');
var qs = require('querystring');
var mysql = require('mysql');
var homeRouter = require('./routes/home');
var authRouter = require('./routes/auth');
var FileStore = require('session-file-store')(session)
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store:new FileStore()
}));

var authData = {
    id:'harry06',
    password:'1111',
    nickname:'harry'
  };
  
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
  
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    done(null, authData);
  });

  passport.use(new LocalStrategy(
    {
      usernameField: 'id',
      passwordField: 'password' 
    },
    function(username, password, done) {
      if(username == authData.id){
        if(password == authData.password){
          return done(null, authData);
        } else{
          return done(null, false, {
            message: 'Incorrect password.'
          });
        }
      } else{
        return done(null, false, {
          message: 'Incorrect name.'
        });
      }
    }
  ));
  
  app.post('/auth/login_process',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login'
    }));

app.use('/', homeRouter);
app.use('/auth', authRouter);

app.use(function(req, res, next) {
    res.status(404).send('404 error!');
  });

app.use(function(err, req, res, next){
    console.error(err.stack)
    res.status(500).send('Something broke!')
  });

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  });

