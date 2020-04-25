const express = require('express');
const hbs = require('hbs');
const bp = require('body-parser');
const routes = require('./router.js').router;
const start = require('./router.js').start;

start();

var app = express();
var port = 3000;

app.set('view engine', 'hbs');
app.use(express.static('public'));

hbs.registerPartials(__dirname + '/views/');
hbs.registerHelper('limit', function(str) {
  if (str.length > 144)
    return str.substring(0,144) + '...';
  return str;
});
hbs.registerHelper('limitusername', function(str) {
  if (str.length > 16)
    return str.substring(0,16) + '...';
  return str;
});

app.use(bp.urlencoded({extended: false}));

app.use('/', routes);

app.listen(port, ()=>{
    console.log(`Server running on port ${port}!`);
});
