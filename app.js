require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const { connectDB } = require("./db/dbconnect");
const loginRout = require("./router/login");
const adminRout = require("./router/admin");
const volunteerRout = require("./router/volunteer");
const path = require("path");
const feedback = require("./router/feedback");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://volunteers.onrender.com"],
//     credentials: true,
//   })
// );

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cors());
app.set("view engine", "ejs");

connectDB();

// Routes
app.use(loginRout);
app.use(adminRout);
app.use(volunteerRout);
app.use(feedback);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
