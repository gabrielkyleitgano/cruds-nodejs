/****
	*
	*	Import all node modules
	*
****/
/*
***@ Core node modules
*/
var express = require('express');
var http = require('http');
var mysql = require('mysql');
var app = express();
var bodyparser = require('body-parser');
//Use bodyparser for POSTING data
app.use(bodyparser.urlencoded({ extended: true }));
// Set template engine, EmbedJS
app.set('view engine', 'ejs');
//Use assets
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
//Database Connection
const con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'cruds'
});

//Set baseurl and sitetitle
const sitetitle = "Node.js Application | CRUDS";
const baseurl = "http://localhost:4000/";

//View data
app.get('/', function(req, res){
	con.query('SELECT * FROM items ORDER BY item_id ASC', function(err, result){
		res.render('pages/index',{
			sitetitle : sitetitle,
			pagetitle : 'Item List',
			items: result
		});
	});
});

//View Adding Items Page
app.get('/item/add', function(req, res){
	res.render('pages/add-item.ejs', {
		sitetitle : sitetitle,
		pagetitle : 'Add New Item',
		items: ''
	});
});
//Insert Items into Database
app.post('/item/add', function(req, res){
	var query = "INSERT INTO `items` (`item_name`, `item_desc`, `item_qty`, `item_price`) VALUES (";
		query += "'"+ req.body.item_name +"',";
		query += "'"+ req.body.item_desc +"',";
		query += "'"+ req.body.item_qty +"',";
		query += "'"+ req.body.item_price +"')";

		con.query(query, function(err, result){
			res.redirect(baseurl); //Return to Item List
		});
});

//View Edit Page and Get Data from the Database
app.get('/item/edit/:item_id', function(req, res){
	con.query("SELECT * FROM items WHERE item_id = '"+ req.params.item_id +"'", function(err, result){
		res.render('pages/edit-item', {
			sitetitle : sitetitle,
			pagetitle : "Editing Item: " + result[0].item_name + " - " + result[0].item_desc,
			item : result
		});
	});
});
//Search items
app.post('/item/search', function(req, res){
	con.query("SELECT * FROM items WHERE item_name LIKE '%"+ req.body.keyword +"%'", function(err, result){		
		res.render('pages/index',{
			sitetitle : sitetitle,
			pagetitle : 'Item List',
			items: result
		});
	});
});
//Update Items in the Database
app.post('/item/edit/:item_id', function(req, res){
	var query = "UPDATE `items` SET";
		query += "`item_name` = '"+ req.body.item_name +"',";
		query += "`item_desc` = '"+ req.body.item_desc +"',";
		query += "`item_qty` = '"+ req.body.item_qty +"',";
		query += "`item_price` = '"+ req.body.item_price +"'";
		query += " WHERE `items`.`item_id` = "+ req.body.item_id +"";
	//Run Query
	con.query(query, function(err, result){
		if (result.affectedRows) {
			res.redirect(baseurl); //Return to Item List
		}
	});
});
//Delete Items in the Database
app.get('/item/delete/:item_id', function(req, res){
	con.query("DELETE FROM items WHERE item_id = '"+ req.params.item_id +"'", function(err, result){
		if (result.affectedRows) {
			res.redirect(baseurl);
		}
	});
});

//Initialize Server
var server = app.listen(4000, function(){
	console.log('Server started on 4000...');
});