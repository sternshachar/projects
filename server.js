/* --- Setting up an express server --- */
var express = require('express');
var contactlist = require('./routes/contactlist');
var app = express();
app.use('/contactlist', contactlist);
app.use(express.static('public'));
app.listen(8080);
/* --- End of express server setup --- */

/* --- Opening a connection to mogoDB with mongoose --- */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/contactlist');

var db = mongoose.connection;

db.on('error', console.error.bind(console,'connection error: '));

var personsSchema = [];
var person = [];

var usersSchema = [];
//var user = [];

db.once('open', function(callback){
	console.log('Connected to mongoDB!');
/* --- Setting contactlist collection with Schema --- */
	 personsSchema = mongoose.Schema({ name: String, email: String, number: String},{collection: 'contactlist'});
	 Person = mongoose.model('contactlist',personsSchema);

	 usersSchema = mongoose.Schema({ name: String, password: String},{collection: 'users'});
	 User = mongoose.model('users',usersSchema);
/* --- end of contactlist setup --- */
});
/* --- End of mongoose connection setup --- */

