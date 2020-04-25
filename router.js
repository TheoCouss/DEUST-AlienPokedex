const express = require('express');
const router = express.Router();
const fs = require('fs');

var currentData = []; //Contient le tableau des données contenues dans aliens.json

var timeLoop = setInterval(function () {
  saveChanges();
}, 5000);

var start = function () {
  loadFile();
};

function loadFile() {
  console.log('Loading file...');
  let RAW = fs.readFileSync('aliens.json');
  currentData = JSON.parse(RAW);
}

function saveChanges() {
  let RAW = fs.readFileSync('aliens.json');
  let current = JSON.stringify(currentData);
  if (RAW != current) {
    console.log('Saving file...');
    let stringyfied = JSON.stringify(currentData);
    fs.writeFileSync('aliens.json', stringyfied);;
  }
}

function convertDate(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat)
  return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
}

// Sectoin du router

router.get(`/`, (req, res) => {
    console.log(`GET / from ${req.connection.remoteAddress}`);
    res.render('layout', {data: currentData});
});

router.get(`/API`, (req, res) => {
  res.send(currentData);
});

router.get(`/new`, (req, res) => {
    console.log(`GET /new from ${req.connection.remoteAddress}`);
    res.render('new', {layout: false, data: currentData});
});

router.post(`/new`, (req, res) => {
    console.log(`POST /new from ${req.connection.remoteAddress}`);

    currentData.push({
      alienName: String(req.body.nom),
      alienDescription: String(req.body.description),
      createdAt: convertDate(new Date())
    });

    res.redirect('/');
});

router.get(`/del`, function (req, res) {
  let id = parseInt(req.query.id);
  console.log(`GET /del from ${req.connection.remoteAddress}`);

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
  let id = parseInt(req.query.id);
  console.log(`GET /del from ${req.connection.remoteAddress}`);

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

//Export du router, la boucle de vérifications de modifications et de la séquence d'initialisation
module.exports = {
  router,
  timeLoop,
  start
};
