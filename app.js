var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
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

		    var approvals = [
  				{ name:"Charles Dickens", title:"David Copperfield", status: false },
  				{ name:"David Copperfield", title:"Tales of the Impossible", status: false },
  				{ name:"Charles Dickens", title:"Great Expectation", status: false }
			]

		    cloudant.use(DATABASE_NAME).bulk({ docs:approvals }, function(err, data) {
  				if (err) {
    				console.log(err);
  				}

  				console.log(data);
			});

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
var approvalsListRouter = require('./routes/approvalslist');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/approvals', approvalsRouter);
app.use('/approvalslist', approvalsListRouter);



const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


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
