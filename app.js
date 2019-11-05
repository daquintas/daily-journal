//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost/posts', {
  useNewUrlParser: true
});

var postSchema = mongoose.Schema({
  title: String,
  content: String
});

var Post = mongoose.model('Post', postSchema);

app.get('/', function(req, res) {
  Post.find(function(err, post) {
    if (!err) {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: post
      });
    };
  });
});

app.get('/about', function(req, res) {
  res.render("about", {
    startingAbout: aboutContent
  });
});

app.get('/contact', function(req, res) {
  res.render("contact", {
    startingContact: contactContent
  });
});

app.get('/compose', function(req, res) {
  res.render("compose");
});

app.post('/compose', function(req, res) {
  const post = new Post({
    title: req.body.title,
    content: req.body.postBody
  });

  post.save(function(err, post) {
    if (err) return console.error(err);
  });
  res.redirect("/");
});

app.get("/posts/:customPost", function(req, res) {
  const customPostTitle = req.params.customPost;
  Post.find(function(err, post) {
    post.forEach(function(post) {
      if (_.lowerCase(post.title) === _.lowerCase(customPostTitle)) {
        const title = post.title;
        const content = post.content;
        res.render("post", {
          postTitle: title,
          postContent: content
        });
      } else {
        console.log("Error");
      }
    });
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});