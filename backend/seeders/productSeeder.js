const mongoose = require("mongoose");
const Product = require("../models/ProductSchema");
const Category = require("../models/CategorySchema");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const seedProducts = async () => {
  try {
    await connectDB();

    const categories = await Category.find();

    const getCategoryId = (name) => {
      const cat = categories.find((c) => c.name === name);
      if (!cat) {
        console.warn(`Category not found: ${name}`);
        return null;
      }
      return cat._id;
    };

    const products = [];

    // dark
    for (let i = 1; i <= 5; i++) {
      products.push({
        title: `Dark Chocolate Bar ${60 + i * 5}%`,
        brand: "Lindt",
        description: "Rich dark chocolate with high cocoa content",
        price: 80 + i * 5,
        stock: 100,
        isFeatured: i === 1,
        isOnSale: false,
        discountPercent: 0,
        coverImage: `https://picsum.photos/300?dark${i}`,
        category: getCategoryId("dark"),
      });
    }

    // white
    for (let i = 1; i <= 5; i++) {
      products.push({
        title: `White Chocolate Bar ${i}`,
        brand: "Galaxy",
        description: "Smooth creamy white chocolate",
        price: 65 + i * 3,
        stock: 90,
        isFeatured: i === 2,
        isOnSale: false,
        discountPercent: 0,
        coverImage: `https://picsum.photos/300?white${i}`,
        category: getCategoryId("white"),
      });
    }

    // truffle
    for (let i = 1; i <= 5; i++) {
      products.push({
        title: `Chocolate Truffles Box (${6 + i * 2} pcs)`,
        brand: "Godiva",
        description: "Premium assorted chocolate truffles",
        price: 300 + i * 40,
        stock: 30,
        isFeatured: true,
        isOnSale: i % 2 === 0,
        discountPercent: i % 2 === 0 ? 15 : 0,
        coverImage: `https://picsum.photos/300?truffle${i}`,
        category: getCategoryId("truffle"),
      });
    }

    // with fruit
    const fruits = ["Strawberry", "Orange", "Raspberry", "Cherry", "Blueberry"];
    fruits.forEach((fruit, index) => {
      products.push({
        title: `${fruit} Chocolate Bar`,
        brand: "Cadbury",
        description: `Chocolate infused with ${fruit.toLowerCase()} flavor`,
        price: 70 + index * 4,
        stock: 110,
        isFeatured: false,
        isOnSale: true,
        discountPercent: 10,
        coverImage: `https://picsum.photos/300?fruit${index + 1}`,
        category: getCategoryId("with fruit"),
      });
    });

    // hazelnut
    for (let i = 1; i <= 5; i++) {
      products.push({
        title: `Hazelnut Chocolate Bar ${i}`,
        brand: "Ferrero",
        description: "Milk chocolate with roasted hazelnuts",
        price: 90 + i * 5,
        stock: 85,
        isFeatured: i === 3,
        isOnSale: false,
        discountPercent: 0,
        coverImage: `https://picsum.photos/300?hazelnut${i}`,
        category: getCategoryId("hazelnut"),
      });
    }

    // sweet
    const sweets = ["Caramel", "Vanilla", "Milk", "Toffee", "Honey"];
    sweets.forEach((flavor, index) => {
      products.push({
        title: `${flavor} Sweet Chocolate`,
        brand: "Nestle",
        description: `Sweet chocolate with ${flavor.toLowerCase()} flavor`,
        price: 60 + index * 3,
        stock: 120,
        isFeatured: false,
        isOnSale: index % 2 === 0,
        discountPercent: index % 2 === 0 ? 20 : 0,
        coverImage: `https://picsum.photos/300?sweet${index + 1}`,
        category: getCategoryId("sweet"),
      });
    });

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("30 products seeded with balanced categories");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedProducts();