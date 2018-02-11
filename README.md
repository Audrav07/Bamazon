# Bamazon

This application is an Amazon-like storefront with MySQL & Node.JS. The app has three modules:

* Customer - displays product catalog & customers are able to purchase items.
* Manager - displays product catalog, low inventory, purchase inventory, add new products.
* Supervisor - displays product sales by department and functionality to create new departments.

# Getting Started

## NPM installation

1. npm install
2. npm mysql2
3. npm inquirer
4. npm columnify

## Commands to run application

1. node bamazonCustomer.js

* This will start the Customer Module.
The inventory is displayed by Product Name, Department Name, Price, and Stock Quantity.
	* Customers are able to select a product to purchase and the number of units.
* Customers are not able to purchase items with insufficent stock.
	* A grand total is displayed. Purchased items Stock Quantity is decreased.

	![Alt Text] (https://media.giphy.com/media/xThtai1YFD5mvQVu3S/giphy.gif)

2. node bamazonManager.js

This will start the Manager Module. Managers are able to:
* View Products For Sale
	* Inventory is displayed by Product Name, Department Name, Price, and Stock Quantity.
* View Low Inventory.
	* Lists all items with an inventory count lower than five.
* Add to Inventory.
	* Manager is able to add more stock to any item currently in store.
* Add New Product.
	* Manager can add a new product to the store.

3. node bamazonSupervisor.js

This will start the Supervisor Module. Supvervisors are able to:
* View Product Sales by Department.
	* This displays a summarized table showing Department ID, Department Name, Overhead Costs, Product Sales, and Total Profits.
* Create New Department.
	* Supervisors can add a new department to the store.

