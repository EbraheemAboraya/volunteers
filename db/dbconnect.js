//./db/dbconnect
require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
<<<<<<< HEAD
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.qad8cco.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`

        );
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
=======
  try {
    await mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.qad8cco.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
>>>>>>> 0d73ed0454c43ad406d878aa327d4fba7417f52d
};

module.exports = { connectDB };
