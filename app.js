require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db/dbconnect");
const loginRout = require("./router/login");
const adminRout = require("./router/admin");
const volunteerRout = require("./router/volunteer");
const path = require("path");
const feedback = require("./router/feedback");
const bodyParser = require("body-parser");
const report = require("./router/report");
const messageRoutes = require("./router/messages.routes");
const {app ,server} = require("./socket/socket");

const port = process.env.PORT || 7000;

// CORS configuration - allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://celadon-mooncake-e0352e.netlify.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};



app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

const fs = require("fs");
const dir = "./uploads";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const uploadsDir = path.join(__dirname, "uploads");

app.set("view engine", "ejs");

connectDB();

// Routes
app.use(loginRout);
app.use(adminRout);
app.use(volunteerRout);
app.use(feedback);
app.use(report);
app.use("/api/messages",messageRoutes);




server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = { app, connectDB };
