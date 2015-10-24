var express = require('express');
var router = express.Router();
var mainBet = require('../api/mainBet');

/* GET bets listing. */
router.get('/', function(req, res, next) {
    res.send('Bet app started..');
    mainBet.startBet(next);
});

module.exports = router;
