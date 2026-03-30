// Import dependencies
const express = require("express");
// `router` in Express is a mini version of `app` used to group and define routes and middleware in separate files, which are then connected to the main application via `app.use()`.
const router = express.Router();
const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const { cookieAuth } = require("../auth/middleware");
const jwt = require("jsonwebtoken");
// register
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body; // Destructure user info from request body

  // Validate required fields
  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ message: "Email and Password and Name are Required" });
  }

  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User Already Exist!" });
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // We create a new user in memory, then `save()` actually stores it in the database.
  const newUser = new User({
    email,
    password: hashedPassword,
    name,
    role: "user",
  });

  // Save the new user to MongoDB
  await newUser.save();

  // Generate a JWT token for authentication
  let token = jwt.sign(
    { email, id: newUser._id, role: newUser.role },
    process.env.SECRET_KEY,
    {
      expiresIn: "1w",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 1000,
  });

  // Send response with user info and token
  return res.status(201).json({
    message: "User registered successfully!",
    user: newUser,
    token,
    role: newUser.role,
  });
});

//login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are Required" });
  }
  // Check if user and passward already exists
  let loggedInUser = await User.findOne({ email });
  if (loggedInUser && (await bcrypt.compare(password, loggedInUser.password))) {
    const role = loggedInUser.role || "user";
    // Generate a JWT token for authentication
    let token = jwt.sign(
      { email, id: loggedInUser._id, role },
      process.env.SECRET_KEY,
      {
        expiresIn: "1w",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 1000,
    });
// it redirect all users to /admin/products in small screens and gives error
    const redirectPath = role === "admin" ? "/admin/products" : "/";

    // Send response with user info and token
    return res.status(201).json({
      message: "User logged in successfully!",
      user: loggedInUser,
      token,
      role,
      redirect: redirectPath,
    });
  } else {
    return res.status(400).json({ message: "invalid email or pssword" });
  }
});

router.get("/verify", cookieAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }
    res.status(200).json({
      message: "Tokin valid.",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully!" });
});

//specified user data for user profile
router.get("/:id", async (req, res) => {
  targetUser = await User.findById(req.params.id);
  if (!targetUser) {
    return res.status(400).json({ message: "user not found" });
  }
  return res.status(200).json({ targetUser });
});

// Export the router to be used in main app
module.exports = router;
