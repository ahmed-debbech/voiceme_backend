var express = require('express');
var router = express.Router();
let db = require("../db")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("HELLO!")
});

router.get('/whitelist', async function(req, res, next) {
  let list = await db.whitelist();
  console.log(list)
  res.render('dash', {list: list});
});

router.post('/allow/:pin', function(req, res, next) {
  db.allow(req.params.pin);
  res.send("s");
});

router.put('/deny/:pin', function(req, res, next) {
  db.deny(req.params.pin);
  res.send("s");
});

router.put('/voice/', function(req, res, next) {
  db.deny(req.params.pin);
  res.send("s");
});

module.exports = router;
