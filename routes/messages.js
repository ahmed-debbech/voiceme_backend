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

router.get('/voice', async function(req, res, next) {
    
    let voices = await db.getLast10();

    res.json({
        voices: voices
    })
});
router.get('/voice/content/:id', async function(req, res, next) {
    
    let voice = await db.getVoice(req.params.id)
    if(voice == null) {res.json({content: null}); return;}

    let content = null;
    try{
        content = fs.readFileSync('voices/'+voice.date+ "-" + voice.user ).toString();
    }catch(e){
        console.log(e)
        res.json({content: null}); return;
    }
    res.json({
        content: content
    })
});

module.exports = router;
