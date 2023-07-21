const mongoose = require("mongoose");
const postScheema = mongoose.Schema({
  userName: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  like: {
    type: Number,
    require: true,
  },
});
const Post = mongoose.model("userpost", postScheema);
module.exports = Post;
