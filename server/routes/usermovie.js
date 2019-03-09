
var express = require('express');
var tmdb = require('../scripts/tmdb_api');

var userfav = require('../data/js/userfav_model');

var router = express.Router();


//router.use(isAuthenticated());

function isAuthenticated(req, res, next) {
	if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

router.get('/', isAuthenticated, function(req, res, next) {
	res.redirect('/usermovie/search');
});

router.get('/search', isAuthenticated, function(req, res, next) {
	res.render('search', {
		user : req.user
	});
});

router.post('/search', isAuthenticated, function(req, res, next) {
	var query = req.body.search;
	var user_id = req.user._id
	tmdb.searchMovie(query, 1).then(function(pres) {
		// Fav movies - callback hell
		userfav.find(user_id, function(resp) {
			var favmovies =  resp;
			var total_pages = Math.ceil(favmovies.length/10)
			var total_results = favmovies.length;
			var data = { total_pages:total_pages, total_results: total_results, results:favmovies }
			var datastr = JSON.stringify(data);
			res.render('search', { data: pres, userfav: datastr, mode:'search', input:query, user : req.user });
		});
	});
});

router.get('/search/:query/:page', isAuthenticated, function(req, res, next) {
	var query = req.params.query;
	var page = req.params.page;
	
	var user_id = req.user._id
	
	tmdb.searchMovie(query, page).then(function(pres) {
		// Fav movies - callback hell
		userfav.find(user_id, function(resp) {
			var favmovies =  resp;
			var total_pages = Math.ceil(favmovies.length/10)
			var total_results = favmovies.length;
			var data = { total_pages:total_pages, total_results: total_results, results:favmovies }
			var datastr = JSON.stringify(data);
			res.render('search', { data: pres, userfav: datastr, mode:'search', input:query, user : req.user });
		});
		
	});
});

router.get('/favourites', isAuthenticated, function(req, res, next) {
	var user_id = req.user._id
	userfav.find(user_id, function(resp) {
		var favmovies =  resp;
		var total_pages = Math.ceil(favmovies.length/10)
		var total_results = favmovies.length;
		var data = { total_pages:total_pages, total_results: total_results, results:favmovies }
		var datastr = JSON.stringify(data);
		res.render('search', { data: datastr, mode:'favmovies', userfav: datastr, input:'', user : req.user });
	});
});

router.post('/favourites/add', isAuthenticated, function(req, res, next) {
	var movie_obj = req.body.movie_obj;
	var user_id = req.user._id
	userfav.update(movie_obj, user_id);
	res.redirect('/usermovie/search/' + req.body.query_str + '/' + req.body.page_number);
});

router.post('/favourites/remove', isAuthenticated, function(req, res, next) {
	var movie_obj_id = req.body.movie_obj_id;
	var user_id = req.user._id
	userfav.del(movie_obj_id, user_id);
	if (req.body.mode == 'favmovies') {
		res.redirect('/usermovie/favourites')
	} else {
		res.redirect('/usermovie/search/' + req.body.query_str + '/' + req.body.page_number);
	}
});


module.exports = router;