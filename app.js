var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var cookieParser = require('cookie-parser');// cookie parser
var csrf = require('csurf');// crose site verification
var express = require('express');// base server
var mongoose = require('mongoose');// database
var sessions = require('client-sessions');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// Connect to mongo
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/auth');

var User = mongoose.model('User', new Schema({
	id: ObjectId,
	firstName: String,
	lastName: String,
	email: {type:String, unique: true},
	password: String,
}));

// how dynamic are these
var Law = mongoose.model('law',new Schema({
	id: ObjectId,
	userEmail: {type: String, unique: true},
	lawName: String, 
	AddressLicenceFineYN: String,
	AddressLicenceFinePrice: String,
}));

var app = express();
app.set('view engine','jade');
app.locals.pretty = true;


// middleware
app.use(bodyParser.urlencoded({ extended: true }))

app.use(sessions({
	cookiename: 'session',
	secret: ';mn65bgv9a7fasd980a90g037h05r19hmkj6bvkhlajkdyflkj_asdf',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	httpOnly: true, // Don't let browser javascript access cookies ever
	secure: true, // Only use cookies over https
	ephemeral: true, // Delete this cookie when the brower is closed
})); 

var csrfProtection = csrf({cookie:true});
// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser());

app.use(function(req, res, next){
	console.log('is there session info');
	if (req.session_state && req.session_state.user){ //is there session info
		User.findOne({email: req.session_state.user.email}, function(err,user){
			if (user){ console.log('user logged in');
				req.user = user;
				delete req.user.passord;
				req.session_state.user = user;
				res.locals.user = user;
			}
			console.log('isThere a sessionbeforeNext()')
			next();console.log('isThere a sessionAFTERNext()')
		});
	} else { console.log('isSessions3');
		next();
	}
})

function requireLogin(req, res, next){   console.log('RL1');
	if (!req.user){   console.log('RL2');
		res.redirect('/login');
	}else{  console.log('RL3');
		next();
	}
};


app.get('/', function(req, res){
	res.render('index.jade')
});

app.get('/register', csrfProtection, function(req, res){
	res.render('register.jade',{csrfToken: req.csrfToken()});
});

app.post('/register', function(req, res){
	var hash = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));

	var user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: hash,
	});
	user.save(function(err){
		if (err){
			var err = 'Something went wrong! Try again :)'
			if (err.code === 11000){
				error = 'That email address is already in use, please try another :)';
			}

			res.render('register.jade',{error: error});
		}else{
			res.redirect('/dashboard');
		}
	});
});

app.get('/login', csrfProtection, function(req, res){
	res.render('login.jade', { csrfToken: req.csrfToken() } );console.log('renderLogIn');
});

app.post('/login', function(req,res){  console.log('postLogin');
	User.findOne({email: req.body.email},function(err, user){
		if (!user){ console.log('!user-Login');
			res.render('login.jade', {error: 'Invalid email or password.'});
		}else{
			if (bcrypt.compareSync(req.body.password, user.password)) {//(req.body.password === user.password){
				req.session_state.user = user;console.log('postlogin to /dashboard');
				res.redirect('/dashboard');console.log('postlogin to /dashboard2');
			}else{
				res.render('login.jade', {error: 'Invalid email or password.'});
			}
		}
	});console.log('DoneLoginPost');
});

app.get('/dashboard', requireLogin, function(req, res){	console.log('DB1');
	res.render('dashboard.jade');
});

app.get('/democ2', requireLogin, function(req, res){	console.log('Democ2');
	res.render('democ2.jade');
});

app.get('/law1', requireLogin, function(req, res){	console.log('getLaw1');
	res.render('law1.jade');
});

app.post('/law1', function(req, res){
	console.log('postLaw1');
	// <todo>
	// find out if bcrypt can be used for thing other then password
	//var hash = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));

	var law = new Law({
		lawName: "licenceLaw",
		AddressLicenceFineYN: req.body.AddressLicenceFineYN,
		AddressLicenceFinePrice: req.body.AddressLicenceFinePrice,
	});
	//res.redirect('/yes');
	law.save(function(err){
		// console.log('ERROR_Law1');
		if (err){
			var err = 'Something went wrong! Try again :)'
			if (err.code === 11000){
				error = 'That email address is already in use, please try another :)';
			}

			res.render('law1.jade',{error: error});
		}else{
			console.log('law1 saved');
			res.redirect('/law1Results');// some way to show this ?ajax, rerender with js?
		}
	});
});
// Radio buttons
// http://stackoverflow.com/questions/30078881/save-answer-with-button-radio-using-mean-stack-with-mvc-framework

app.get('/law1Results', requireLogin, function(req, res){	console.log('LR1');
	Law.findOne({lawName: 'licenceLaw'},function(err, law){
		console.log('beforeIf');
		if (!Law){ console.log('!Law');
			res.render('law1Results.jade', {error: 'Invalid Law Name.'});
		}else{
			console.log('LAW!');
			console.log(law.lawName);

			// \/ This is the all important place to pass variables to the htmlpage for display
			res.locals.law = law; console.log('postlaw to /law1Results');
			// the use user informaion is more universal as its a middleware function.

			res.render('law1Results.jade', {error: 'Invalid Law Name.'});
		}
	});
});

app.get('/yes', requireLogin, function(req, res){	console.log('Democ2');
	res.render('YES.jade');
});

app.get('/logout', function(req, res){
	req.session_state.reset();
	res.render('index.jade');
});

if (require.main === module) {
    app.listen(3000);
} else {
    module.exports = app;
}

// https://www.youtube.com/watch?v=yvviEA1pOXw
// https://github.com/rdegges/svcc-auth

// ALSO might want to use Passport.js, good to interact with other APIs

// Drywall - A website and user system for Node.js 
// Helps keep track of all the users needs for your session_state
// but you will be using their stuff - it may not be good for you.

// stormpath - stores and encrypts your users data for you and them.

// <todo> 
//		need a forgot password page