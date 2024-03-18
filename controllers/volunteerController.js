const Volunteer = require("../models/volunteer");

const getindex = async (req, res) => {
  try {
    res.render("volunteer-index");
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

const signup = async (req, res) => {
  const { fullName, userName, password, skills, availability, role } = req.body;
  try {
    const newVolunteer = new Volunteer({
      fullName,
      userName,
      password,
      skills: skills ? skills.split(",").map((skill) => skill.trim()) : [],
      availability: availability ? availability.split(",").map((day) => day.trim()) : [],
      role 
    });

    await newVolunteer.save();

    res.status(201).redirect('/login');
  } catch (error) {
    console.error("Error saving volunteer data:", error);
    res.status(500).send("An error occurred while saving volunteer data.");
  }
};


module.exports = {
  getindex,
  signup
};
