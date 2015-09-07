var express = require("express");
var server = express();
var bodyParser = require("body-parser");
var lowdb = require("lowdb");
var db = lowdb("./mock/database/database.json");

server.use(express.static(__dirname+"/public/html"));
server.use(express.static(__dirname+"/public/js"));
server.use(express.static(__dirname+"/public/css"));



server.use(bodyParser.json()); // for parsing application/json
server.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// This is the client routes
server.get("/", function(req, res){
	res.sendFile("index.html");
});



server.get("/suggest", function(req, res){
	res.sendFile("html/suggestion-create.html", {root: "public"});
});

server.get("/suggestions",function(req, res){
	res.sendFile("html/suggestion-list.html", {root: "public"});
});


server.get("/contact", function(req, res){
	res.sendFile("html/contact.html", {root: "public"});
});



// The api for interacting with user database
server.get("/api/suggestions", function(req, res){
	var suggestions = db('suggestions').where();
	
	res.json(suggestions);
});

server.post("/api/suggestions", function(req, res){
	
	var newSuggestion = {
		name: req.body.name,
		suggestion: req.body.suggestion
	};

	db('suggestions').push(newSuggestion);
	db.save();
	res.redirect("/suggest");
});

// Sending a contact message
server.get("/api/contact", function(req, res){
	var emails = db("contact-emails").where();
	res.json(emails);
});

server.post("/api/contact",function(req, res){
	
	var email = {
		sender: req.body.sender,
		message: req.body.message
	};

	db('contact-emails').push(email);
	db.save();
	
	res.redirect("/contact");
});

// Starting the server
server.listen(8080, function(){
	console.log("Now listening on port 8080...");
});