var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');

var app = express();
var PORT = 3000;
var sqlPassword = 'Mushu86212!';
tableCounter = 0;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.listen(PORT, function () {
	console.log('App listening on PORT ' + PORT);
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/add', function (req, res) {
	res.sendFile(path.join(__dirname, 'add.html'));
});

app.get('/view', function (req, res, err) {

	res.sendFile(path.join(__dirname, 'table_view.html'));
});

app.get('/apitable', function (req, res) {
	displayTables(res);
});

app.get('/apiwait', function (req, res, err) {
	displayWaitTables(res);
});

app.post('/api/new', function (req, res) {
	var newcustomer = req.body;
	// newcustomer.routeName = newcharacter.name.replace(/\s+/g, '').toLowerCase();


	// Link to mySQL Database
	var connection = mysql.createConnection({
	    host: "localhost",
	    port: 3306,
	    user: "root", //Your username
	    password: sqlPassword, //Your password
	    database: "bamazon"
	});


	// Push to SQL
	connection.connect(function(err) {
	  if (err) throw err;
	  	
	  	var rand = Math.floor((Math.random() * 5) + 1);
	  	console.log({
	      CustomerName: newcustomer.CustomerName,
	      PhoneNumber: parseInt(newcustomer.PhoneNumber),
	      email: newcustomer.email,
	      tablenumber: rand
	    })
	   	connection.query('INSERT INTO customers SET ?', {
	   	  CustomerName: newcustomer.CustomerName,
	      PhoneNumber: parseInt(newcustomer.PhoneNumber),
	      email: newcustomer.email,
	      tablenumber: rand
	    }, function(err, rows){

    	if(err){
    	console.log(err);
        console.log('\nSorry. The SQL database could not be updated.');
        // console.log(err)
        connection.end(); // end the script/connection
      }
      else{
        console.log('\nCharacter was added to SQL database!')
        connection.end(); // end the script/connection
      }
		
		}); // end update query

	}); // end database connection



	res.json(newcustomer);
});

var displayTables  = function(res){
	var connection = mysql.createConnection({
	    host: "localhost",
	    port: 3306,
	    user: "root", //Your username
	    password: sqlPassword, //Your password
	    database: "bamazon"
	});

	connection.query('SELECT * from customers WHERE tablenumber > 0',function(err, rows) {
	           if (err) {
	           	console.log(err);
	           	connection.end();
	           }else{
	           	res.writeHead(200, {'Content-Type': 'application/json'});
	           	res.end(JSON.stringify(rows));
	           	connection.end();
	           	res.end();
	           }
	});
}

var displayWaitTables  = function(res){
	var connection = mysql.createConnection({
	    host: "localhost",
	    port: 3306,
	    user: "root", //Your username
	    password: sqlPassword, //Your password
	    database: "bamazon"
	});

	connection.query('SELECT * from customers WHERE tablenumber = 0 ORDER BY id DESC',function(err, rows) {
	           if (err) {
	           	console.log(err);
	           	connection.end();
	           }else{
	           	res.writeHead(200, {'Content-Type': 'application/json'});
	           	res.end(JSON.stringify(rows));
	           	connection.end();
	           	res.end();
	           }
	});
}

