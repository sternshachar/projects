var express = require('express');
var passport = require('passport');
var passportLocal = require('passport-local').Strategy;
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

router.use(bodyParser());
router.use(cookieParser());
router.use(expressSession({
 	secret: process.env.SESSION_SECRET || 'secret',
 	resave: false,
 	saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());

passport.use(new passportLocal(function(username,password,done){
	if(username === password){
		 done(null,{id: 123, name: username});
	} else {
		done(null,null);
	}
}));

passport.serializeUser(function(user,done){
	done(user.id);
});

passport.deserializeUser(function(id,done){
	done({id: id, name: id});
});

router.route('/')
	.get(function(request,response){
		Person.find(function(err,persons){
			if(err) return console.error(err);
			console.log(persons);
			response.json(persons);
		});
	})
	.post(function(request,response){
	var newContact = request.body;
	var newPerson = new Person(newContact);
	newPerson.save(function(err, newPerson){
			if(err) return console.error(err);
			console.log('New contact added!');
			console.log(newPerson);
		})
	response.status(201).json(newPerson);
	});

router.route("/:id")
	.put(function(request,response){
		var id = request.params.id;
		var updatedPerson = request.body;
		Person.update({ _id: id },{ $set: updatedPerson },function(){
			Person.findById(id, function(err,person){
				if(err) return console.error(err);
				console.log(person);
				response.json(person);
			});
		});
		
	})

	.delete(function(request,response){
		var id = request.params.id;
		Person.find({ _id : id}).remove().exec();
		response.json(id);
	});

router.route("/login")
	.post(passport.authenticate('local'), function(request,response){
		//console.log(request.body);
		response.json({
			isAuthenticated: request.isAuthenticated(), 
			usr: request.username
		});
	});

	module.exports = router;