var express = require('express');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../data/js/schema/user');

module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, email, password, done) {
		User.findOne({
			'email' : email
		}, function(err, user) {
			if (err) {
				return done(err);
			} if (user) {
				return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
			} else {
				var newUser = new User();
				newUser.email = email;
				newUser.password = newUser.generateHash(password);
				newUser.save(function(err) {
					if (err) {
						throw err;
					}
					return done(null, newUser);
				});
			}

		});

	}));

	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, email, password, done) {
		User.findOne({
			'email' : email
		}, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, req.flash('loginMessage', 'No user found.'));
			}
			if (!user.validPassword(password)) {
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
			}
			return done(null, user);
		});

	}));

	var router = express.Router();
	
	function isAuthenticated(req, res, next) {
		if (!req.isAuthenticated())
	        return next();
	    res.redirect('/usermovie/search');
	}

	router.post('/login', isAuthenticated, passport.authenticate('local-login', {
		successRedirect : '/usermovie/search',
		failureRedirect : '/user/login',
		failureFlash : true
	}));

	router.get('/', isAuthenticated, function(req, res, next) {
		res.redirect('/user/login');
	});

	router.get('/login', isAuthenticated, function(req, res, next) {
		res.render('userlogin', { loginMessage: req.flash('loginMessage') });
		
	});

	router.get('/register', isAuthenticated, function(req, res, next) {
		res.render('usercreate', { signupMessage: req.flash('signupMessage') });
	});

	router.get('/logout', isAuthenticated, function(req, res, next) {
		req.logOut();
		req.session.destroy();
		req.user=null;
		res.redirect('/');
	});

	router.post('/register', isAuthenticated, passport.authenticate('local-signup', {
		successRedirect : '/usermovie/search',
		failureRedirect : '/user/register',
		failureFlash : true
	}));

	return router;
}