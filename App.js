const express = require("express");
const app = express();
require("dotenv");
const serverLess = require("serverless-http");
const cors = require("cors");
const User = require("./Model/user");
const Post = require("./Model/post");
//json web token
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("./Config/passport");
//upload photos
const multer = require("multer");

require("./Config/database");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cors());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//get login user data
app.get("/data/:id", async (req, res) => {
  const id = req.params.id;
  const existUser = await User.findOne({ _id: id });
  if (existUser) {
    res.status(200).send(existUser);
  }
});
//home route
app.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    return res.status(200).send({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
      },
    });
  }
);
//get login data
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).send({
        message: "user not found",
      });
    } else if (user && user.password !== req.body.password) {
      res.status(403).send({
        message: "wrong password",
      });
    } else {
      //jsonwebtoken
      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
      };
      const token = jwt.sign(payload, "rahulhossain", {
        expiresIn: "7d",
      });
      return res.status(201).send({
        id: user._id,
        message: "Login Successfully",
        token: "Bearer " + token,
      });
    }
    //res.status(201).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});
//multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });
//get data from id
app.get("/post/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const getDataFromId = await Post.find({ _id: id });
    if (getDataFromId) {
      res.status(200).send(getDataFromId);
    } else {
      res.status(404).send("Post Not found");
    }
  } catch (error) {
    res.status(500).send("something broke");
  }
});
//get method
app.get("/post", async (req, res) => {
  try {
    const postData = await Post.find();
    if (postData) {
      res.status(200).send(postData);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    res.status(500).send("something broke");
  }
});
//post method
app.post("/post", upload.single("image"), async (req, res) => {
  try {
    const uploadFile = await Post.insertMany({
      userName: req.body.userName,
      title: req.body.title,
      image: req.file.filename,
      like: req.body.like,
    });
    if (uploadFile) {
      res.status(201).send("uploded");
    } else {
      res.status(500).send("something broke");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
});
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
//getUser
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
