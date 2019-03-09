var exports = module.exports = {};
var UserFav = require('./schema/userfav');

exports.create = function(movie_fav, user_id) {
	var userFav = new UserFav({
		userid : user_id,
		favmovies : [ movie_fav ]
	});

	userFav.save(function(err) {
		if (err) {
			throw err;
		}
		console.log('Movie added created!');
	});

}
exports.find = function(user_id, done) {
	UserFav.findOne({userid : user_id}, function(err, userfav) {
		done(userfav.favmovies);
	});
}

exports.del = function(movie_obj_id, user_id) {
	
	UserFav.findOne({userid : user_id}, function(err, userfav) {

		if (err) {
			throw err;
		}
		
		var movie_favs = userfav.favmovies.filter(function(fav){
			  var movieObj = null
			  try {
				  movieObj = JSON.parse(fav.movie);
				  if (movieObj.id != movie_obj_id) {
					  return true;
				  }
			  } catch(er){
			  }
			  return false;
		});
		
		userfav.favmovies = movie_favs;
		console.log('movie_favs' + movie_favs);
		userfav.save(function(err) {
			if (err)
				throw err;
			console.log('Movie deleted!');
		});
	})

}

exports.update = function(movie_fav, user_id) {
	UserFav.findOne({userid : user_id}, function(err, userfav) {
		if (err)
			throw err;
		
		if (userfav == null) {
			
			var userFav = new UserFav({
				userid : user_id
			});
			userFav.favmovies = [];
			userFav.favmovies.push({movie: movie_fav});

			userFav.save(function(err) {
				if (err) {
					throw err;
				}
				console.log('Movie added created! -  First Time');
			});
			
		} else {
			
			userfav.favmovies.push({movie: movie_fav});
			userfav.save(function(err) {
				if (err)
					throw err;
				console.log('Movie added created!');
			});
			
		}
		
	});
}