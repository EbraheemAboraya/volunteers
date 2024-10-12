require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Make sure you're using the correct DB_CLUSTER value from the .env file
        const dbUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

        await mongoose.connect(dbUri, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });

        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
    }
};

module.exports = { connectDB };
