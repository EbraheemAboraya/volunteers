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
const bodyParser = require('body-parser');
const report = require("./router/report");

const app = express();
const port = process.env.PORT || 2000;

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);







const fs = require("fs");
const dir = "./uploads";
 
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
 
const uploadsDir = path.join(__dirname, "uploads");
 
app.use(cors());
app.set("view engine", "ejs");





connectDB();

// Routes
app.use(loginRout);
app.use(adminRout);
app.use(volunteerRout);
app.use(feedback);
app.use(report);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
