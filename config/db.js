const mongoose = require("mongoose");
require("dotenv").config();
const db = process.env.MONGODB;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
