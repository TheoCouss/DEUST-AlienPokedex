const express = require('express');
const router = express.Router();
const fs = require('fs');

var alienTemplate = {alienId:"", alienName:"", alienDescription: "", createdAt: ""};
var currentData = [];

function reloadFile() {
  console.log('Reloading file...');
  let RAW = fs.readFileSync('aliens.json');
  currentData = JSON.parse(RAW);
}

function formatIP(ip) {
  ip.substr(ip.length-11, 11);
  return ip;
}

function saveFile() {
  console.log('Saving file...');
  let stringyfied = JSON.stringify(currentData);
  fs.writeFileSync('aliens.json', stringyfied);
}

function convertDate(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat)
  return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
}

function remapIDs() {
  reloadFile();
  for (var i = 0; i < currentData.length; i++) {
    currentData[i].alienId = i;
  }
  saveFile();
}

router.get(`/`, (req, res) => {
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    console.log(`GET / from ${formatIP(ip)}`);
    reloadFile();

    res.render('layout', {data: currentData});
});

router.get(`/remap`, function(req, res) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  console.log(`GET /remap from ${formatIP(ip)}`);

  remapIDs();
  res.send('done');
})

router.get(`/new`, (req, res) => {
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    console.log(`GET /new from ${ip}`);

    reloadFile();


    res.render('new', {layout: false, data: currentData});
});

router.post(`/new`, (req, res) => {
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    console.log(`POST /new from ${ip}`);

    reloadFile();

    alienTemplate.alienId = currentData.length;
    alienTemplate.alienName = req.body.nom;
    alienTemplate.alienDescription = req.body.description;
    alienTemplate.createdAt = convertDate(new Date());

    currentData.push(alienTemplate);

    saveFile();

    res.redirect('/');

});

router.get(`/del`, function (req, res) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  console.log(`GET /del from ${ip}`);

  let id = parseInt(req.query.id);

  if (Number.isInteger(id)) {

    reloadFile();

    if (currentData[id] != null) {

      currentData.splice(id, 1);
      saveFile();
      res.redirect('/');

    } else {

      res.send('This ID does not exists!');

    }

  } else {

    res.send("Wrong query.");

  }
});

router.get(`/details`, function (req, res) {

  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

  console.log(`GET /details from ${ip}`);

  let id = parseInt(req.query.id);

  if (Number.isInteger(id)) {

    reloadFile();

    if (currentData[id] != null) {

      res.render('details', {layout: false, data: currentData[id], id: id});

    } else {

      res.send('This ID does not exists!');

    }

  } else {

    res.send("Wrong query.");

  }
});

module.exports = router;
