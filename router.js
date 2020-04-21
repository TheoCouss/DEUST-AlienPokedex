const express = require('express');
const router = express.Router();
const fs = require('fs');

var alienTemplate = {alienId:"", alienName:"", alienDescription: "", createdAt: ""};
var currentData = [];

function reloadFile() {
  let RAW = fs.readFileSync('aliens.json');
  currentData = JSON.parse(RAW);
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

    console.log(req.body.nom);
    console.log(new Date());
});

module.exports = router;
