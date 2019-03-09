let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let bodyParser = require('body-parser');
let flash    = require('connect-flash');
let session = require('express-session');


let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;


// Routes
let routes = require('./routes/index');
let userRoutes = require('./routes/user')(passport);
let userMovieRoutes = require('./routes/usermovie');


const app = express();

// view engine setup
let ejs = require('ejs');
app.set('views', path.join(__dirname, 'views'));

//app.set('view engine', 'html');
//app.engine('html', ejs.renderFile);
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html'); 

//app.set('view engine', 'jade');
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());

// Mongoose
var dbConfig = require('./config/db.js');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

//Passport init
app.use(passport.initialize());
app.use(passport.session());


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/user', userRoutes);
app.use('/usermovie', userMovieRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
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

module.exports = app;