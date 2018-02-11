const inquirer = require('inquirer');
const mysql = require('mysql2');
const columnify = require('columnify');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'bamazon'
})


function menuOptions(){
	inquirer.prompt([
	{
		type: "list",
		name: "toDoList",
		message: "What would you like to do?",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "End Session"]

	}]).then(function(answer){
		switch(answer.toDoList){

			case "View Products for Sale": viewProducts();
			
			break;

			case "View Low Inventory": viewLowInventory();
			break;

			case "Add to Inventory": addToInventory();
			break

			case "Add New Product": addNewProduct();
			break;

			case "End Session": console.log("See ya");
		}
	});
}

function viewProducts(){
	
	console.log("----Viewing Products-----");

	connection.query('SELECT * FROM products', function(err, res){
		if(err) throw err;

		console.log('--------------------------------------------------------------------------------');

		for(var index = 0; index < res.length; index++){

		console.log(columnify(res, { columns: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity']}));

		console.log('--------------------------------------------------------------------------------');

}
menuOptions();

});
}


function viewLowInventory(){
	console.log("-------Viewing Low Inventory-------");

	connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res){
		if(err) throw err;


			console.log("--------------------------------------");
		for(var i = 0; i < res.length; i++){

			if(res[i].stock_quantity <= 5){
			console.log(columnify(res, { columns: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity']}));
			console.log("--------------------------------------");
			}
		}
		menuOptions();
	});
}

function addToInventory(){
	console.log("----- Adding to Inventory-----");

	connection.query("SELECT * FROM products", function(err, res){
		if(err) throw err;
		var itemArray = [];
		for(var i = 0; i < res.length; i++){
			itemArray.push(res[i].product_name);
		}
		inquirer.prompt([{
			type: "list",
			name: "product",
			choices: itemArray,
			message: "Which item would you like to add inventory?"
		},
		{
			type: "input",
			name: "Quantity",
			message: "How much would you like to add?",

			validate: function(value){
				if(isNaN(value) === false){return true}
				else{return false};
			}
		}]).then(function(answer){
			var currentQuantity;
			for(var i = 0; i < res.length; i++){
				if(res[i].product_name === answer.product){
					currentQuantity = res[i].stock_quantity;
				}
			}

			connection.query("UPDATE products SET ? WHERE ?", [
				{stock_quantity: currentQuantity + parseInt(answer.Quantity)},
				{product_name: answer.product}
				], function(err, res){
					
					if(err) throw err;
					console.log("------------------------------------");
					console.log("The quantity was updated.");
					console.log("------------------------------------");
					menuOptions();
				});
		})
	});
}

// Adds new product to database.
var addNewProduct = function() {

	inquirer.prompt([{
		name: "productName",
		type: "input",
		message: "What is the product you would like to add?"
	}, {
		name: "deptName",
		type: "input",
		message: "What is the department for this product?"
	
	}, {
		name: "price",
		type: "input",
		message: "What is the price for the product?"
	}, {
		name: "quantity",
		type: "input",
		message: "How much stock do you have to start with?"
	}]).then(function(answer) {
		connection.query("INSERT INTO products SET ?", {
			product_name: answer.productName,
			department_name: answer.deptName,
			price: answer.price,
			stock_quantity: answer.quantity
		}, function(err, res) {
			if (err) {
				throw err;
			} else {
				console.log("Your product was added successfully!");

				// Checks if department exists.
				checkIfDepartmentExists(answer.deptName);
			}
		});
	});
};

// Checks if department exists.
var checkIfDepartmentExists = function(departmentName) {

	var query = "SELECT department_name FROM departments";
	connection.query(query, function(err, res) {
		if (err) throw err;

		// If deparment already exists, no need to add it.
		for (var i = 0; i < res.length; i++) {
			if (departmentName === res[i].department_name) {
				console.log("This department already exists so no need to add it: " + departmentName);
				menuOptions();
			}
		}

		// If department doesn't exist, adds new department. 
		addNewDepartment(departmentName);
	});
};


// Adds new department.
var addNewDepartment = function(departmentName) {
	console.log('We will add this new department: ' + departmentName);

	// Adds department to departments table in database.
	connection.query("INSERT INTO departments SET ?", {
			department_name: departmentName
		}, function(err, res) {
			if (err) {
				throw err;
			} else {
				console.log("New department was added successfully!");
				
			}
			menuOptions();
		});
}

menuOptions();


