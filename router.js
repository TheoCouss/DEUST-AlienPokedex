const express = require('express');
const router = express.Router();
const fs = require('fs');

var alienTemplate = {alienId:"", alienName:"", alienDescription: "", createdAt: ""};
var currentData = [];

function reloadFile() {
  let RAW = fs.readFileSync('aliens.json');
  currentData = JSON.parse(RAW);
}

function saveFile() {
  let stringyfied = JSON.stringify(currentData);
  fs.writeFileSync('aliens.json', stringyfied);
}

function convertDate(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat)
  return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
}

router.get(`/`, (req, res) => {

    reloadFile();

    console.log("GET /");

    res.render('layout', {data: currentData});
});

router.get(`/new`, (req, res) => {

    reloadFile();

    console.log('GET /new');

    res.render('new', {layout: false, data: currentData});
});

router.post(`/new`, (req, res) => {

    console.log("POST /new");

    reloadFile();

    alienTemplate.alienId = currentData.length;
    alienTemplate.alienName = req.body.nom;
    alienTemplate.alienDescription = req.body.description;
    alienTemplate.createdAt = convertDate(new Date());

    currentData.push(alienTemplate);

    saveFile();

});

module.exports = router;
