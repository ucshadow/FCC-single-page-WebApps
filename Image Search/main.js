const express = require('express');
const app = express();
const mongoose = require('mongoose');
const db = mongoose.connection;
const urlSchema = new mongoose.Schema({term: String, date: String});
const URL = mongoose.model('URL', urlSchema);
const Crawler = require('./scripts/crawler');

mongoose.connect('mongodb://heroku_');
app.use(express.static(__dirname));

db.on('error',  console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are in!')
});

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.get('/a', function(req, res) {
  new Crawler("https://www.google.ro/search?q=minah&tbm=isch", res).getUrl();
});

app.get('/search/:url(*)', function(req, res) {
  let term = req.params.url;
  let offset = parseInt(req.query.offset) || 0;
  addToDb(term);
  let crawler = new Crawler("https://www.google.com/search?q=" + term + "&tbm=isch", offset, res);
  return crawler.getUrl()
});

app.get('/latest', function(req, res) {
  URL.find({}, {_id: 0, __v: 0}).sort('-date').limit(10).exec(function(err, data) {
    if(err) throw err;
    res.json(data);
  })
});

app.listen(process.env.PORT || 3000, function () {
  console.log('running...');
});

function addToDb(term) {
  u = URL({term: term, date: new Date().toString()});
  u.save(function(err) {
    if(err) throw err;
    console.log("added ", term, " to db");
  })
}