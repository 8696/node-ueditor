const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(path.resolve(__dirname, '../public')));
const main = require('../main');

app.use(main({

  publicPath: path.resolve(__dirname, '../public'),
  uploadsPath: '/upload/',
  serverUrl: '/ueditor/php/controller.php'

}));

app.use(function (req, res, next) {
  console.log('next');
  next();
});
app.get('/next', (req, res) => {
  res.send({
    msg: 'next'
  });
});

app.listen(8031);
