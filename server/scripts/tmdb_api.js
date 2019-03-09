//var http = require('https');
var http = require('http');

var TMDB_API_KEY = "a922d92273e59be013407a25e646a039";

var TMDB_API_URL = "api.themoviedb.org";

var TMDB_API_PATH = "/3/search/movie"

var searchMovie = function(query, page) {
	return (new Promise(function(resolve, reject) {
		var str = '';
		query = query.replace(/ /g, '%20');
		var options = {
			host : TMDB_API_URL,
			path : TMDB_API_PATH+"?"+"api_key="+TMDB_API_KEY+"&language=en-US&query="+query+"&page="+page+"&include_adult=false"
		};
		var callback = function(response) {
			response.on('data', function(chunk) {
				str += chunk;
			});
			response.on('end', function() {
				resolve(str);
			});
		}
		var req = http.request(options, callback);
		req.end();
	}));
};

module.exports = {
	searchMovie : searchMovie
}