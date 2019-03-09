var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserFavMovies = new Schema({
  userid:  String,
  favmovies : [{ movie: Object }],
  createdate: { type: Date, default: Date.now },
  lastmodifieddate: { type: Date, default: Date.now }
  
});

module.exports = mongoose.model('UserFavMovies', UserFavMovies );