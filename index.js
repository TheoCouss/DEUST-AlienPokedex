const express = require('express');
const hbs = require('hbs');
const bp = require('body-parser');
const routes = require('./router');

var app = express();
var port = 3000;

app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/');

app.use(express.static(`public`));
app.use(bp.urlencoded({extended: false}));

app.use('/', routes);

app.listen(port, ()=>{
    console.log(`Server running on port ${port}!`);
});
