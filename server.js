// Import required modules
const express = require("express");
const app = express();

// This must be at the top because most things depend on it
// `.config()` -> this makes it read and load the `.env` file
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
// Enable Cross-Origin Resource Sharing (CORS)
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173", //your react app's URL
    credentials: true, //alllow credentails
    method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["content-Type", "Authorization"],
  }),
);

// Connect to the database
const connectDB = require("./config/db");
connectDB();

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(cookieParser());

// Route handlers
// All user-related routes will start with /users
app.use("/users", require("./routes/users"));
// All product-related routes will start with /products
app.use("/products", require("./routes/products"));
// All categoty-related routes will start with /categories
app.use("/categories", require("./routes/categories"));
app.use("/carts", require("./routes/carts"));
app.use("/images", express.static("./images"));

app.use("/admin", require("./routes/admin"));

// Get the port from the `.env` file, but use 3000 if it’s not found.
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
