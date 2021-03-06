require("dotenv").config;

const express = require("express");
const product = require("../models/product");
const auth = require("../middleware/auth");
const { getUser, getProduct } = require("../middleware/finders");


const router = express.Router();

// GET all products
router.get("/", auth, async (req, res) => {
  try {
    const products = await product.find();
    res.status(201).send(products);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET one product
router.get("/:id", [auth, getProduct], (req, res, next) => {
  res.send(res.product);
});

// CREATE a product
router.post("/", auth, async (req, res, next) => {

  const { title, category,description, img, price } = req.body;

  let products;

  img
    ? (products = new product({
        title,
        category,
        description,
        created_by: req.user._id,
        img,
        price
      }))
    : (products = new product({
      title,
      category,
      description,
      created_by: req.user._id,
      img,
      price
      }));

  try {
    const newProduct = await products.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a product
router.put("/:id", [auth, getProduct], async (req, res, next) => {
  if (req.user._id !== res.product.created_by)
    res
      .status(400)
      .json({ message: "You do not have the permission to update this product" });
  const { title, category,description, img, price } = req.body;
  if (title) res.product.title = title;
  if (category) res.product.category = category;
  if (description) res.product.description = description;
  if (price) res.product.price = price;
  if (img) res.product.img = img;

  try {
    const updatedProduct = await res.product.save();
    res.status(201).send(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a product
router.delete("/", [auth, getProduct], async (req, res, next) => {
  if (req.user._id !== res.product.created_by)
    res
      .status(400)
      .json({ message: "You do not have the permission to delete this product" });
  try {
    const product = await product.findById(req.product._id)
    await product.remove();
    res.json({ message: "Deleted product" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
