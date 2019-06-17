var inquirer = require("inquirer");
var mysql = require("mysql")

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "DRB4oreo",
    database: "bamazon"
  });

  var exit = [
      {
          type:'list',
          name:'action',
          messsage: 'What would you like to do?',
          choices:[
              'Shop Bamazon',
              'Leave Bamazon'
          ]
      }
  ]
  
var question1 = [
    {
        
        type: 'input',
        name: 'item_id',
        message: "What would you like to buy? (Please use item id #) "
},
{
        
    type: 'input',
    name: 'quantity',
    message: "How many would you like to purchase?"
}
];

var listQuery = `SELECT * FROM products`
var updateQuery = `UPDATE products SET ? WHERE ?`
var selectQuery = `SELECT stock_quantity FROM products WHERE item_id = ?`

function main(){
    console.log("Welcome to Bamazon!")
    escape();
}

function escape(){
    inquirer.prompt(exit).then(answers => {
        if(answers.action === 'Shop Bamazon' ){
            connection.query(listQuery, function(err,res){
                console.log(res)
            });
            prompt();
        }
        else{
            connection.end()
        }
    })
}

function prompt(){
    inquirer.prompt(question1).then(answers => {
        connection.query(selectQuery,[answers.item_id], function(err,res){
            // console.log(res[0].stock_quantity)
            if (parseInt(res[0].stock_quantity) - parseInt(answers.quantity) >= 0){
                var newQuantity = parseInt(res[0].stock_quantity) - parseInt(answers.quantity)
                console.log("Thank you for you Purchase")
                connection.query(updateQuery,[{stock_quantity: newQuantity},{item_id:answers.item_id}])
                escape();
            }
            else{
                console.log("There is not enough product in stock to complete your purchase.")
                escape();
            }
        })
    })
}

main()