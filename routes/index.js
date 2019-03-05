var express = require('express');
var router = express.Router();

var Cloudant = require('@cloudant/cloudant');

// Demo Database name.
const DATABASE_NAME = "approvalengine";


// Database Setup.
var cloudant = new Cloudant({
  account: '2541cab0-0b28-47fa-8511-34a16d20abc6-bluemix',
  plugins: {
    iamauth: {
      iamApiKey: 'dVSdes4QKGMyUdRpXs6SROBiRkLVAeBn4r1UZbccSYj2'
    }
  }
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// submit username and password and retrive data from db
router.post("/submit-data", function (req, res) {

    console.log(req.body)

    cloudant.use(DATABASE_NAME).list({include_docs:true}, function (err, data) {
  		console.log(err, data);
  		res.render('approvalslist', {data: req.body,
  		  								approvals: data});
	});


});

module.exports = router;
