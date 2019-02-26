var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Cloudant = require('@cloudant/cloudant');


const DATABASE_NAME = "approvalengine";


// Database Setup
var cloudant = new Cloudant({
  account: '2541cab0-0b28-47fa-8511-34a16d20abc6-bluemix',
  plugins: {
    iamauth: {
      iamApiKey: 'dVSdes4QKGMyUdRpXs6SROBiRkLVAeBn4r1UZbccSYj2'
    }
  }
});



cloudant.db.list().then((body) => {

	// check db already exists
    if (body.includes(DATABASE_NAME)) {

    	console.log("Database exists")

    } else { // create new db

		cloudant.db.create(DATABASE_NAME, (err) => {
		  if (err) {
		    console.log(err);
		  } else {
		    console.log("Database created Successfully")

		    cloudant.use(DATABASE_NAME).insert({ status: false }, 'approval', (err, data) => {
		      if (err) {
		        console.log(err);
		      } else {
		        console.log(data); 
		      }
		    })

		  }
		});

    }

  }).catch((err) => { 
  	console.log(err); 
  });



// Routes

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var approvalsRouter = require('./routes/approvals');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Navigation
app.get('/', indexRouter);
app.get('/approvals', approvalsRouter);


// Button Events
app.get("/approveRequest", function(req, res) {


	// Get existing single Approval for demo
	cloudant.use(DATABASE_NAME).get('approval', function(err, data) {

    	data.status = true // change approval status to true

    	cloudant.use(DATABASE_NAME).insert(data, function(err, body) {
    		if (err) {
				console.log(err);
			} else {
				console.log(data); 
			}
		  	res.render('approvals', { title: 'Approvals' });
    	}); 

	});
	

});

app.get("/rejectRequest", function(req, res) {
  

// Get existing single Approval for demo
	cloudant.use(DATABASE_NAME).get('approval', function(err, data) {

    	data.status = false // change approval status to true

    	cloudant.use(DATABASE_NAME).insert(data, function(err, body) {
    		if (err) {
				console.log(err);
			} else {
				console.log(data); 
			}
		  	res.render('approvals', { title: 'Approvals' });
    	}); 

	});

});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
