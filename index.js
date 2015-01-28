var async = require('async');
var Twit = require('twit');

var config = require('./config');
var auth = config.auth;
var params = config.params;

var twitter = new Twit(auth);

twitter.get('statuses/user_timeline', params, function(err, tweets, res) {
  if (err) {
    console.log(err);
    return;
  }
  if (res.statusCode !== 200) {
    console.log('Failed to retrieve tweeets');
    return;
  }

  // Collect Ray-Ban Tweet IDs
  var ids = tweets.filter(function(tweet) {
    return isRayBan(tweet.text);
  }).map(function(tweet) {
    return tweet.id_str;
  });

  // Destroy tweets asynchronously
  async.map(ids, destroy, function(err, results) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(results);
  });
});

function isRayBan(text) {
  var RAYBAN = 'レイバンのサングラス';
  return text.indexOf(RAYBAN) > -1;
}

function destroy(id, callback) {
  twitter.post('statuses/destroy/:id', { id: id }, function(err, data, res) {
    if (err) {
      return callback(err);
    }
    if (res.statusCode !== 200) {
      return callback('Failed to remove tweet: ' + id);
    }
    callback(null, 'Removed tweet: ' + id);
  });
}
