const inquirer = require('inquirer');
const mysql = require('mysql2');
const columnify = require('columnify');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root', 
	database: 'bamazon'
})

function showInventory() {
	connection.query('SELECT * FROM products', function(err, res) {
		if (err) throw err;
		for (var index = 0; index < res.length; index++) {
			console.log('Check out our selection ..\n');
			console.log('--------------------------------------------------------------------------------');
			console.log(columnify(res, {columns: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity']
			}));
			console.log('--------------------------------------------------------------------------------');
		}
		//prompt for customer to place order
		console.log('');
		inquirer.prompt([{
			type: "input",
			name: "id",
			message: "Which product would you like to purchase?",
			validate: function(value) {
				if (isNaN(value) == false && parseInt(value) <= res.length && parseInt(value) > 0) {
					return true;
				} else {
					return false;
				}
			}
		}, {
			type: "input",
			name: "quantity",
			message: "How many units would you like to purchase?",
			validate: function(value) {
				if (isNaN(value)) {
					return false;
				} else {
					return true;
				}
			}
		}]).then(function(answer) {
// Query database for selected product.
		var query = "Select stock_quantity, price, product_sales, department_name FROM products WHERE ?";
		connection.query(query, { item_id: answer.id}, function(err, res) {
			
			if (err) throw err;

			const available_stock = res[0].stock_quantity;
			const price_per_unit = res[0].price;
			const productSales = res[0].product_sales;
			const productDepartment = res[0].department_name;

			// Checks there's enough inventory  to process user's request.
			if (available_stock >= answer.quantity) {

				// Processes user's request passing in data to complete purchase.
				completePurchase(available_stock, price_per_unit, productSales, productDepartment, answer.id, answer.quantity);
			} else {

				// Tells user there isn't enough stock left.
				console.log("There isn't enough stock left!");

				// Lets user request a new product.
				purchaseAgain();
			}
		});

			});
	});

}


// Completes user's request to purchase product.
var completePurchase = function(availableStock, price, productSales, productDepartment, selectedProductID, selectedProductUnits) {
	
	// Updates stock quantity once purchase complete.
	var updatedStockQuantity = availableStock - selectedProductUnits;

	// Calculates total price for purchase based on unit price, and number of units.
	var grandTotal = price * selectedProductUnits;

	// Updates total product sales.
	var updatedProductSales = parseInt(productSales) + parseInt(grandTotal);
	
	// Updates stock quantity on the database based on user's purchase.
	var query = "UPDATE products SET ? WHERE ?";
	connection.query(query, [{
		stock_quantity: updatedStockQuantity,
		product_sales: updatedProductSales
	}, {
		item_id: selectedProductID
	}], function(err, res) {

		if (err) throw err;
		// Display the total price for that purchase.
		console.log("Thanks for shopping! Your total is $" + grandTotal.toFixed(2));

		// Updates department revenue based on purchase.
		updateDepartmentRev(updatedProductSales, productDepartment);
		// Displays products so user can make a new selection.
	});
};

// Updates total sales for department after completed purchase.
var updateDepartmentRev = function(updatedProductSales, productDepartment) {

	// Query database for total sales value for department.
	var query = "Select total_sales FROM departments WHERE ?";
	connection.query(query, { department_name: productDepartment}, function(err, res) {

		if (err) throw err;

		var departmentSales = res[0].total_sales;

		var updatedDepartmentSales = parseInt(departmentSales) + parseInt(updatedProductSales);

		// Completes update to total sales for department.
		completeDepartmentSalesUpdate(updatedDepartmentSales, productDepartment);
	});
};
function purchaseAgain() {
	inquirer.prompt([{
		type: "confirm",
		name: "reply",
		message: "Would you like to purchase another item?"
	}]).then(function(ans) {
		if (ans.reply) {
			showInventory();
		} else {
			console.log("Thanks for shopping!");
		}
	});
}

// Completes update to total sales for department on database.
var completeDepartmentSalesUpdate = function(updatedDepartmentSales, productDepartment) {

	var query = "UPDATE departments SET ? WHERE ?";
	connection.query(query, [{
		total_sales: updatedDepartmentSales
	}, {
		department_name: productDepartment
	}], function(err, res) {

		if (err) throw err;

		// Displays products so user can choose to make another purchase.
		purchaseAgain();
	});
};

showInventory();










// 		