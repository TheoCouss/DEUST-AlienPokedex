const express = require('express');
const router = express.Router();
const fs = require('fs');

var currentData = [];

var timeLoop = setInterval(function () {
  saveChanges();

}, 10000);

var start = function () {
  loadFile();
};

function loadFile() {
  console.log('Loading file...');
  let RAW = fs.readFileSync('aliens.json');
  currentData = JSON.parse(RAW);
}

function formatIP(ip) {
  ip.substr(ip.length-11, 11);
  return ip;
}

function saveChanges() {
  let RAW = fs.readFileSync('aliens.json');
  let current = JSON.stringify(currentData);

  if (RAW != current) {
    saveFile();
  }

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

router.get(`/`, (req, res) => {
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    console.log(`GET / from ${formatIP(ip)}`);
    res.render('layout', {data: currentData});
});

router.get(`/API`, (req, res) => {
  res.send(currentData);
});

router.get(`/new`, (req, res) => {
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    console.log(`GET /new from ${ip}`);
    res.render('new', {layout: false, data: currentData});
});

router.post(`/new`, (req, res) => {
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    console.log(`POST /new from ${ip}`);

    currentData.push({
      alienName: String(req.body.nom),
      alienDescription: String(req.body.description),
      createdAt: convertDate(new Date())});

    res.redirect('/');
});

router.get(`/del`, function (req, res) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

  console.log(`GET /del from ${ip}`);

  let id = parseInt(req.query.id);

  if (Number.isInteger(id)) {
    if (currentData[id] != null) {
      currentData.splice(id, 1);
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
    if (currentData[id] != null) {
      res.render('details', {layout: false, data: currentData[id], id: id});
    } else {
      res.send('This ID does not exists!');
    }
  } else {
    res.send("Wrong query.");
  }
});

module.exports = {
  router,
  timeLoop,
  start
};
