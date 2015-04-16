var express = require('express'); 
var request = require('request'); 
var bodyParser = require('body-parser'); 
var db = require('./models'); 
var session = require('express-session');
var methodOverride = require('method-override'); 
var app = express(); 

app.use(methodOverride("_method")); 

app.use(express.static('public')); 

app.use(bodyParser.urlencoded({extended: true})); 

app.use(session({
	secret: "I'm a very secret thing", 
	resave: false,
	save: {
		uninitialize: true
	}
}));

// use login and currentUser functions
app.use('/', function(req,res,next) {
	req.login = function(user) {
		req.session.userId = user.id; 
	}, 
	req.currentUser = function() {
		return db.User.find(req.session.userId)
		.then(function(dbUser) {
			req.user = dbUser; 
			return dbUser; 
		}); 
	},
	req.logout = function() {
		req.session.userId = null; 
		req.user = null; 
	}, 

	next(); 
}); 

//Set view engin to ejs
app.set("view engine", "ejs");

//Home page
app.get('/', function(req,res) {
	console.log("Welcome page is working"); 
	res.render('index'); 
}); 

// Create user and signup
app.post('/signup', function(req,res) {
	var email = req.body.email; 
	var password = req.body.password; 
	db.User.createSecure(email, password).then
	(function(user){
		res.redirect('/login');
	});
});



// User login 
app.post('/login', function(req,res) {
	var email = req.body.email; 
	var password = req.body.password; 
	db.User.authenticate(req.body.email, req.body.password).
	then(function(dbUser) {
		if (dbUser){
			req.login(dbUser); 
			console.log("I'm logged in"); 
			res.redirect('/profile'); 
		} else {
			res.redirect('/login', {user: dbUser} ); 
		}
	});
	
});

// Get login page
app.get('/login', function(req,res) {
	res.render('user/login');
}); 

// Get user profile
app.get('/profile', function(req,res){
	  
	req.currentUser().then(function(user) {
		db.User.all().then(function(users) {
			res.render('user/profile', {user: user, users: users });
		})
	 });
}); 

//User logout
app.delete('/logout', function(req,res) {
	req.logout(); 
	res.redirect('index'); 
}); 


//Create a game, and challenge another user
app.post('/games', function(req, res) {
	var game = db.Game.build({amount: req.body.amount})
	game.challengerId = req.session.userId; 
	game.challengedId = req.body.challenged; // <--- dropdown menu

	game.save().then(function(dbGame) {
		res.redirect('/games/'+dbGame.id); 
	})
}); 

app.get('/games/:id', function(req,res) {
	console.log("Find game");
	db.Game.find(req.params.id).then(function(dbGame) {
		res.render('game/game', { game: dbGame }); 
	})
})

app.get('/sync', function(req, res) {
	db.sequelize.sync({force: true}).then(function() {
		res.send("DB synced successfully.");
	})
})

// Server listening port
app.listen(8000, function() {
	console.log("Listening on port 3000"); 
}); 