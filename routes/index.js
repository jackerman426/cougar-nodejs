var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var json_data = {"name":"jackerman","pass":"bet"};
  res.json(json_data);
});

module.exports = router;
