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
  res.render('approvalslist', { title: 'Approvals' });
});


// Button Events
router.get("/approveRequest", function(req, res) {

	// Get existing single Approval for demo
	cloudant.use(DATABASE_NAME).get('approval', function(err, data) {

    	data.status = true // Change approval status to true

    	cloudant.use(DATABASE_NAME).insert(data, function(err, body) {
    		if (err) {
				console.log(err);
			} else {
				console.log(data); 
			}
		  	res.render('approvalslist', { title: 'Approvals' });
    	}); 

	});
	

});


router.get("/rejectRequest", function(req, res) {
  
	// Get existing single Approval for demo
	cloudant.use(DATABASE_NAME).get('approval', function(err, data) {

    	data.status = false // change approval status to false

    	cloudant.use(DATABASE_NAME).update(data, function(err, body) {
    		if (err) {
				console.log(err);
			} else {
				console.log(data); 
			}
		  	res.render('approvalslist', { title: 'Approvals' });
    	}); 

	});

});

module.exports = router;
