require('dotenv').config()
const express = require('express')
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const User = require('../models/User.js');


router.post('/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  //Simple Validation
  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: "Missing username and/or password and/or confirm password" });
  }
  if (confirmPassword !== password) {
    return res.status(400).json({ success: false, message: "The password confirmation does not match" });
  } try {
    //check for existing user
    const user = await User.findOne({ username })

    if (user) return res.status(400).json({ success: false, message: "Username already exists" })

    //All good at here, then , let's hash the password

    const hashedPassword = await argon2.hash(password)
    const newUser = new User({ username, password: hashedPassword })
    await newUser.save();

    //Return token
    const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET)

    res.json({ success: true, message: "User created successfully", accessToken })
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" })
  }
});


router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  //Simple Validation
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Missing username and/or password" });
  } try {
    // check for existing user 
    const user = await User.findOne({ username })
    if (!user) return res.status(400).json({ success: false, message: "Incorrect username and/or password " });

    //username found
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) return res.status(400).json({ success: false, message: "Incorrect username and/or password" });

    //All good at here 
    //Return token
    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET)

    res.json({ success: true, message: "User logged in successfully", accessToken })
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" })
  }

})

module.exports = router;