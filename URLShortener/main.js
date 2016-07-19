const express = require('express');
const app = express();
const mongoose = require('mongoose');
const db = mongoose.connection;
const urlSchema = new mongoose.Schema({url: String, tag: String});
const URL = mongoose.model('URL', urlSchema);
const validUrl = require('valid-url');


mongoose.connect('mongodb://heroku_0j1kcbhh:lcjsj2a46mug642e8gm063da9c@ds023425.mlab.com:23425/heroku_0j1kcbhh');
app.use(express.static(__dirname));


db.on('error',  console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are in!')
});

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.get('/new/:url(*)', function(req, res) {
  let u = req.params.url;
  console.log(u);
  if(!validUrl.isUri(u)) {
    return res.json({error: u, reason: "Not an url"})
  }
  URL.findOne({url: u}, function(err, url) {
    if(err) throw err;
    if(!url) {
      addToDb(u, res);
    } else {
      console.log(url);
      return res.json({url: u, short: "https://ucshadow-short.herokuapp.com/sh/" + url.tag});
    }
  });
});

app.get('/sh/:id', function(req, res) {
  let u = req.params.id;
  console.log(u);
  URL.findOne({tag: u}, function (err, url) {
    if(err) throw err;
    console.log(url);
    if(url) {
      return res.redirect(url.url)
    } else {
      return res.json({error: u, reason: "No url associated with that tag"})
    }
  })
});

app.listen(process.env.PORT || 3000, function () {
  console.log('running...');
});


function addToDb(url, res) {
  let tag = generateRandomSequence();
  u = URL({url: url, tag: tag});
  u.save(function(err, u) {
    if(err) throw err;

    console.log("added ", url, " to db");
    return res.json({url: url, short: "https://ucshadow-short.herokuapp.com/sh/" + tag});
  })
}

function generateRandomSequence() {
  let str = "abcdefghijklmnopqrstuvwxyz";
  let num = "0123456789";
  let res = "";
  while(res.length <= 6) {
    let letter = str[Math.floor((Math.random() * str.length) + 1) - 1];
    let number = num[Math.floor((Math.random() * num.length) + 1) - 1];
    res += letter + number
  }
  return res
}