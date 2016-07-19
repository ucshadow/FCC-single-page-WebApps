const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();

const app = express();


const upload = multer({storage: storage});


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/api', upload.single('file'), function(req, res) {
  if(!req.file) {
    res.json({error: 'cannot read file size', reason: 'no file'})
  } else {
    res.json({size: req.file.size});
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log('running...');
});
