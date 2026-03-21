// Import dependencies
const express = require("express");
const router = express.Router();
const Category = require("../models/CategorySchema");

//create category
router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required!" });
  }
  const newCategory = new Category({
    name,
  });
  await newCategory.save();
  return res
    .status(201)
    .json({ message: "category created successfully!", category: newCategory });
});

//edit category
router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
    req.body,
      { new:true }
      );
        if (!category) {
      return res.status(400).json({ message: "category not found" });
    }
    return res
      .status(200)
      .json({ message: "category updated successfully!", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete category
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(400).json({ message: "category not found" });
    }
    return res.json({ message: "category deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Export the router to be used in main app
module.exports = router;
