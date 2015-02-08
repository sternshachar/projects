var passport = require('passport');
var passportLocal = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

passport.use(new passportLocal(function(username,password,done){
	User.findOne({"name": username },function(err,user){
		console.log(user);
		if(err) return console.error(err);
		if(!(user == undefined) && user.password == password){
			console.log('found');
			done(null,{id: user._id ,name: username});
		} else{
			console.log('not found');
			done(null,null);
		}
	});

}));

passport.serializeUser(function(user,done){
	console.log('serial works');
	done(null, user.id);
});

passport.deserializeUser(function(id,done){
	console.log('deserial works');
	User.findOne({"_id": id},function(err,user){
		if(err) return console.error(err);
		done(null, {id: id, name: user.name});
	});
});


module.exports = passport;