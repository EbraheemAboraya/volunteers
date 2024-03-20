require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { connectDB } = require("./db/dbconnect");
const loginRout = require("./router/login");
const adminRout = require("./router/admin");
const volunteerRout = require("./router/volunter");
const path = require("path");

const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

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
app.set("view engine", "ejs");

connectDB();

// Routes
app.use(loginRout);
app.use(adminRout);
app.use(volunteerRout);
app.use(cors());

app.listen(port, () => {
  console.log(`http://localhost:${port}/login`);
});
