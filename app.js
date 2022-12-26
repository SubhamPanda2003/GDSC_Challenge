// Require express to make easy
// routing on server side.
const express=require("express");
const app=express();
const https = require('https');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require("mongoose");

// Define a port number
const port = 3000;

app.use('/static', express.static('static'));







app.get('/', (req, res)=>{
    
   
    res.status(200).render('form.html');
})



// Database Connection
mongoose.connect(
	"mongodb://localhost:27017/feedback",
	{ useUnifiedTopology: true }
);

// Create schema
const feedSchecma = mongoose.Schema({
	name: String,
	roll: String

});

// Making a modal on our already
// defined schema
const feedModal = mongoose
	.model('feeds', feedSchecma);

// Handling get request
app.get('/', function (req, res) {
	// Rendering your form
	res.render('form.html');
});
app.get('/delete', function (req, res) {
	// Rendering your form
	res.render('delete.html');
});
app.get('/edit', function (req, res) {
	// Rendering your form
	res.render('edit.html');
});
app.get('/fetch', function (req, res) {
	// Rendering your form
	res.render('fetch.html');
});
// Handling data after submission of form
app.post("/", function (req, res) {
	const feedData = new feedModal({
		name: req.body.Name,
		roll: req.body.Roll,
		
	});
	feedData.save()
		.then(data => {
			res.render('form.html',
        { msg: "Your user is successfully saved." });
		})
		.catch(err => {
			res.render('form.html',
				{ msg: "Check Details." });
		});
})
app.route("/delete")
.post(function(req, res){

	feedModal.deleteOne(
	  {name: req.body.Name,roll: req.body.Roll},
	  function(err){
		if (!err){
		  res.send("Successfully deleted the corresponding user.");
		} else {
		  res.send(err);
		}
	  }
	);
  });

  app.route("/fetch")
.post(function(req, res){

	feedModal.findOne({roll: req.body.Roll }, function (err, docs) {
		if (err){
			console.log(err)
		}
		else{
			res.send({docs});
		}
	});
  });
  app.route("/edit")
  .post(function(req, res){
  
	const filter = { name: req.body.Name, roll: req.body.Roll};
	const update = { name: req.body.Name1, roll: req.body.Roll1};
	
	// `doc` is the document _after_ `update` was applied because of
	// `new: true`
	 feedModal.findOneAndUpdate(filter, update,null, function (err, docs){
	//   new: true
	if (err){
        res.send({err})
    }
    else{
        res.send({docs});
    }
	});
	});
// Server setup
app.listen(port, () => {
	console.log("server is running");
});
