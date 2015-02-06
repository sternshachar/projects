var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser);

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