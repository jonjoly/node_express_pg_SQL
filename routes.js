// require the Express module
const express = require("express");

//creates a new router object
const cartRoutes = express.Router();
const pool = require("./connection");

const items = [];


cartRoutes.get("/cart-items", (req, res) => {
  // .json sends response as JSON
  // res.status(200).json(items); //note: defaults to 200 if request has succeeded.
  pool.query("SELECT * FROM shopping_cart ORDER BY id desc").then(result => {
    // console.log(result);
    // console.log(result.rows);
    res.json(result.rows);
  })
});

// route
cartRoutes.get("/cart-items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  // Find by ID
  const item = items.find(item => item.id === id);
  if (item) {
    res.status(200).json(item)
  } else {
    // Set response code to 404
    res.status(404);
    res.send(`ID ${id} Not Found`);
  }
});

// route
cartRoutes.post("/cart-items", (req, res) => {
  pool.query("INSERT INTO shopping_cart(product,price,quantity) VALUES ($1::text,$2::money,$3::int)",
    [req.body.product, req.body.price, req.body.quantity]).then(() => {
      res.json(req.body)
    })
});

// route
cartRoutes.put("/cart-items/:id", (req, res) => {
  pool.query("UPDATE shopping_cart SET quantity=$1::int WHERE id=$2::int", [req.body.quantity, req.params.id]).then(() => {
    res.json(req.body);
  })
});

// route
cartRoutes.delete("/cart-items/:id", (req, res) => {
  pool.query("DELETE FROM shopping_cart WHERE id=$1::int", [req.params.id]).then(() => {
    res.status(200).json(`${req.params.id}`);
  })
});

module.exports = { cartRoutes };
