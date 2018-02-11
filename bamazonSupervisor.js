//require mysql and inquirer
const mysql = require('mysql2');
const inquirer = require('inquirer');
const columnify = require('columnify');
//create connection to db
var connection = mysql.createConnection({
  host: "localhost",
 
  user: "root",

  database: "Bamazon"
})

function menuOptions(){
  inquirer.prompt([{
    type: "list",
    name: "doThing",
    message: "What would you like to do?",
    choices: ["View Product Sales by Department", "Create New Department", "End Session"]
  }]).then(function(ans){
    switch(ans.doThing){
      case "View Product Sales by Department": viewProductByDept();
      break;
      case "Create New Department": createNewDept();
      break;
      case "End Session": console.log('Bye!');
    }
  });
}

//view product sales by department
function viewProductByDept(){
  //prints the items for sale and their details
  connection.query(`SELECT departments.department_id AS 'Department ID', 
                        departments.department_name AS 'Department Name', 
                        departments.over_head_cost as 'Overhead Costs', 
                        SUM(products.product_sales) AS 'Product Sales', 
                        (SUM(products.product_sales) - departments.over_head_cost) AS 'Total Profit'  
                        FROM departments
                        LEFT JOIN products on products.department_name=departments.department_name
                        GROUP BY departments.department_name, departments.department_id, departments.over_head_cost
                        ORDER BY departments.department_id ASC`, 
                        function(err, res) {
        if (err) throw err;

  	
  	
    console.log('------Product Sales by Department-----');
    console.log('----------------------------------------------------------------------------------------------------')

    for(var i = 0; i<res.length;i++){
     console.log(columnify(res, { columns: ["Department ID", "Department Name", "Overhead Costs", "Product Sales", "Total Profit"] }));

      console.log('--------------------------------------------------------------------------------------------------')
    }
    menuOptions();
  })
};

  //create a new department
  function createNewDept(){
    console.log('-------Creating New Department-------');
    //prompts to add deptName and numbers. if no value is then by default = 0
    inquirer.prompt([
    {
      type: "input",
      name: "deptName",
      message: "Department Name: "
    }, {
      type: "input",
      name: "overHeadCost",
      message: "Over Head Cost: ",
      default: 0,
      validate: function(val){
        if(isNaN(val) === false){return true;}
        else{return false;}
      }
    }, {
      type: "input",
      name: "prodSales",
      message: "Product Sales: ",
      default: 0,
      validate: function(val){
        if(isNaN(val) === false){return true;}
        else{return false;}
      }
    }
    ]).then(function(ans){
      connection.query(`INSERT INTO departments (department_name, over_head_cost) VALUES ("${ans.deptName}", ${ans.overHeadCost})`, function(err, res) {
      	if(err) throw err;
      })

        console.log(`Department Added Successfully!`);
    
        menuOptions();
    })
}

menuOptions();


      	// 'INSERT INTO Departments SET ?',{
       //  department_name: ans.deptName,
       //  over_head_cost: ans.overHeadCost,
       //  total_sales: ans.prodSales
      // }, function(err, res){
      //   if(err) throw err;
      //   console.log('Another department was added.');

 

