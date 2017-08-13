const mongoose = require('mongoose');
const mongodb =require("mongodb");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/authapp");


module.exports={
  mongoose
};
