var express = require('express');
var router = express.Router();


router.get('/approvals', function(req, res, next) {
  res.render('approvals', { title: 'Approvals' });
});

module.exports = router;
