const mongoose = require("mongoose");
const User = require("../model/UserSchema");
const Admin = require("../model/AdminSchema");

const jwt = require("jsonwebtoken");

mongoose.connect("mongodb://0.0.0.0:27017/user-management");

module.exports = {
  // Register an admin account (POST/register)

  register: async (req, res) => {
    const { name, email, username, password } = req.body;
    await Admin.create({
      name: name,
      email: email,
      username: username,
      password: password,
    });
    res.json({ message: "Admin registered successfully" });
  },

  // Admin Login (POST/login)

  login: async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    const admin = Admin.findOne({ username: username, password: password });

    if (!admin) {
      return res.status(404).json({ error: "User not found" });
    }
    const token = jwt.sign(
      { username: admin.username },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({ message: "Login successful", token });
  },

  //create user with name,email(POST/users)

  createuser: async (req, res) => {
    const { name, email, username } = req.body;

    // console.log(req.body, "hhh");
    await User.create({
      name: name,
      email: email,
      username: username,
    });
    res.status(200).json({
      status: "success",
      message: "user created successfully",
    });
  },

  //Get all users list (GET/users)

  getallusers: async (req, res) => {
    const allusers = await User.find();
    res.status(200).json({
      status: "success",
      message: "successfully fetched user datas",
      data: allusers,
    });
  },

  // Get specific user based on id(GET/users/:id)

  getuserById: async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      return res.status(200).json({
        status: "success",
        message: "sucessfully fetched user data",
        data: user,
      });
    }
  },

  // update a specific user (PUT/users/:id)

  updateuserById: async (req, res) => {
    const userId = req.params.id;
    const { name, email, username } = req.body;
    const user = await User.findByIdAndUpdate(userId, {
      $set: { name, username, email },
    });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.json({ message: "User updated successfully" });
  },

  // delete a specific user(DELETE/users/:id)

  deleteuserById: async (req, res) => {
    const userId = req.params.id;
    const user = User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.json({ message: "User deleted sucessfully" });
  },
};
