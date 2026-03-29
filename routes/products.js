// Import dependencies
const express = require("express");
const Product = require("../models/ProductSchema");
const multer = require("multer");
const { auth } = require("../auth/middleware");
const Favourites = require("../models/FavouritesSchema");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.fieldname;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.post("/favourites", auth(null), async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;
  const isDeleted = await Favourites.findOneAndDelete({ userId, productId });
  if (isDeleted) {
    return res.status(200).json({
      message: "product removed from favourites successfully!",
    });
  } else {
    const newFavourite = new Favourites({ userId, productId });
    await newFavourite.save();
    return res.status(201).json({
      message: "product added to favourites successfully!",
      favouriteProducts: newFavourite,
    });
  }
});

router.get("/favourites", auth(null), async (req, res) => {
  const userId = req.user.id;
  const favorites = await Favourites.find({ userId }).populate("productId");
  res.status(200).send(favorites);
});

// create product
router.post(
  "/",
  auth("admin"),
  upload.single("coverImage"),
  async (req, res) => {
    try {
      const {
        title,
        brand,
        description,
        price,
        stock,
        isFeatured,
        discountPercent,
        category,
      } = req.body;
      const coverImage = req.file?.filename;
      if (!title || !brand || !description || !price || !stock) {
        return res.status(400).json({ error: "All Fields are required!" });
      }
      const newProduct = new Product({
        title,
        brand,
        description,
        price,
        stock,
        isFeatured,
        discountPercent,
        category,
        coverImage,
      });
      await newProduct.save();
      return res.status(201).json({
        message: "product created successfully!",
        product: newProduct,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    return res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get specified product
router.get("/:id", async (req, res) => {
  const targetProduct = await Product.findById(req.params.id).populate(
    "category",
    "name"
  );
  try {
    if (!targetProduct) {
      return res.status(400).json({ message: "product not found" });
    }
    return res.status(200).json({ targetProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// edit product — supports optional image update via multipart/form-data
router.put("/:id", upload.single("coverImage"), async (req, res) => {
  try {
    const updates = { ...req.body };

    // If a new image was uploaded, overwrite coverImage
    if (req.file?.filename) {
      updates.coverImage = req.file.filename;
    }

    const targetProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate("category", "name");

    if (!targetProduct) {
      return res.status(400).json({ message: "product not found" });
    }
    return res
      .status(200)
      .json({ message: "product updated successfully!", targetProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete product
router.delete("/:id", async (req, res) => {
  try {
    const targetProduct = await Product.findByIdAndDelete(req.params.id);
    if (!targetProduct) {
      return res.status(400).json({ message: "product not found" });
    }
    return res.json({ message: "product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export the router to be used in main app
module.exports = router;