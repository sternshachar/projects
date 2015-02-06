/* --- Setting up an express server --- */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser());
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

db.once('open', function(callback){
	console.log('Connected to mongoDB!');

/* --- Setting contactlist collection with Schema --- */
	 personsSchema = mongoose.Schema({ name: String, email: String, number: String},{collection: 'contactlist'});
	 Person = mongoose.model('contactlist',personsSchema);
/* --- end of contactlist setup --- */
});
/* --- End of mongoose connection setup --- */



app.get('/contactlist', function(request,response){
	Person.find(function(err,persons){
		if(err) return console.error(err);
		console.log(persons);
		response.json(persons);
	});
});

app.post('/contactlist', function(request,response){
	var newContact = request.body;
	var newPerson = new Person(newContact);
	newPerson.save(function(err, newPerson){
		if(err) return console.error(err);
		console.log('New contact added!');
		console.log(newPerson);
	})
	response.status(201).json(newPerson);
});

app.put('/contactlist/:id', function(request,response){
	var id = request.params.id;
	var updatedPerson = request.body;
	Person.update({ _id: id },{ $set: updatedPerson },function(){
		Person.findById(id, function(err,person){
			if(err) return console.error(err);
			console.log(person);
			response.json(person);
		});
	});
	
});

app.delete('/contactlist/:id', function(request,response){
	var id = request.params.id;
	Person.find({ _id : id}).remove().exec();
	response.json(id);
});
