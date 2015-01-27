var async = require('async');
var Twit = require('twit');
var config = require('./my-config');

var twitter = new Twit(config);

var RAYBAN = 'レイバン';
var user = 'tatsuyaoiw';

twitter.get('statuses/user_timeline', { screen_name: user }, function(err, tweets, res) {
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
    return tweet.text.indexOf(RAYBAN) > -1;
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
