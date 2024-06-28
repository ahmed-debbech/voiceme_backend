var express = require('express');
var router = express.Router();
let db = require("../db")
var fs = require("fs");

router.post('/voice', async function(req, res, next) {
    
    let encodedVoice = req.body.voice;
    let duration = req.body.duration;
    let user = req.headers.pin;
    let date = Date.now();
    let status = "sent"

    db.addVoice(duration, user, date, status);
    fs.writeFileSync("voices/" + date+"-"+user, encodedVoice)

    res.json({
        sent : true
    })
});



module.exports = router;
