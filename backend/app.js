const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const postRouter = require('./routes/posts');
const userRouter = require('./routes/user')
const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/PostApp",{ useNewUrlParser: true })
  .then(() => {
    console.log("Connected to Mongoose")
  })
  .catch(() => {
    console.log("Connection Failed");
  })


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Accept ,Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.use("/api/posts",postRouter);
app.use("/api/user",userRouter);
module.exports = app;
