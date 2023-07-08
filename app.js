//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
main().catch(err => console.log(err));
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const Items = [];


async function main() {
  const conn = await mongoose.connect('mongodb+srv://nirbhaymahan12:7k66833k96@cluster0.5ttr5oq.mongodb.net/todolistDB', { useNewUrlParser: true});
  console.log("database has been created");

  const itemsSchema = new mongoose.Schema({
    name: String
  });

  const Item = new mongoose.model("Item", itemsSchema);

  const item1 = new Item({
    name: "welcome to your todolist"
  });
  const item2 = new Item({
    name: "Hit the + button to add a new item."
  });
  const item3 = new Item({
    name: "<-- Hit this to delete an item."
  });

  const defaultItems = [item1, item2, item3];

  // Item.insertMany(defaultItems).then(
  //   () => {
  //     console.log("succesfully saved default items to DB.");
  //   }
  // );


  app.get("/", function(req, res){
    Item.find({}).then(
      foundItems => {
        if(foundItems.length === 0){
          res.render("list", {listTitle: "Today", newListItems: defaultItems});
        } else{
          res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
      }
    )
  });

  app.post("/", function(req, res){
    const itemName = req.body.newItem;

    const item = new Item({
      name: itemName
    });
    item.save();
    res.redirect("/");
  });

  app.post("/delete", function(req, res){
    const checkedItem = req.body.checkbox;
    Item.findByIdAndRemove(checkedItem).then(
      () => {
        console.log("succefully deleted the item");
      }
    );
    res.redirect("/");
  });

  var customList = "";
  var ListName;
  app.get("/list/:listName", function(req, res){
    customList = req.params.listName;
    // console.log(customList);
    const collectionName = req.params.listName + "Item";
    ListName = new mongoose.model(collectionName, itemsSchema);
    ListName.find({}).then(
      foundItems => {
        if(foundItems.length === 0){
          res.render("list", {listTitle: req.params.listName, newListItems: defaultItems});
        } else{
          res.render("list", {listTitle: req.params.listName, newListItems: foundItems});
        }
      }
    );
  });

  app.get('/favicon.ico', function(req, res) {
    res.status(204);
    res.end();
  });

  app.post("/customList", function(req, res){
    const itemName = req.body.newItem;

    const item = new ListName({
      name: itemName
    });
    item.save();

    res.redirect("/list/"+customList);
  });

  app.post("/deleteCustomList", function(req, res){
    const checkedItem = req.body.checkbox;
    ListName.findByIdAndRemove(checkedItem).then(
      () => {
        console.log("succefully deleted the item");
      }
    );
    res.redirect("/list/"+customList);
  });
}


app.listen(3000, function() {
  console.log("Server started on port 3000");
});





// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

// app.get("/about", function(req, res){
//   res.render("about");
// });
