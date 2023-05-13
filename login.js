var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var compression = require('compression');
var fs = require('fs');
var qs = require('querystring');
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

var passport = require('./lib/passport')(app);

var homeRouter = require('./routes/home');
var authRouter = require('./routes/auth')(passport);

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
