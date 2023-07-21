const express = require("express");
const app = express();
require("dotenv");
const cors = require("cors");
const User = require("./Model/user");

require("./Config/database");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//register
app.post("/signup", async (req, res) => {
  try {
    const existUser = await User.findOne({
      email: req.body.email,
    });
    if (existUser) {
      res.status(404).send("user already exists! try another email");
    } else {
      const newUSer = await User.insertMany({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
      });
      if (newUSer) {
        res.status(201).send("Created successfully");
      } else {
        res.status(404).send("failed");
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
//getUser
app.get("/user", async (req, res) => {
  try {
    const allUsers = await User.find();
    if (allUsers) {
      res.status(200).send(allUsers);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
//getUser findbyid
app.get("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    if (user) {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
//update
app.patch("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate(
      { _id: id },
      {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
      }
    );
    if (user) {
      res.status(200).send("Updated successfully!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
//delete
app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete({ _id: id });
    if (user) {
      res.status(200).send("Deleted successfully");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
