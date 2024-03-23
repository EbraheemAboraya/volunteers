const programRepo = require("../repository/program");
const volunteerRepo = require("../repository/volunteer");

const signup = async (req, res) => {
  const { fullName, userName, password, skills, availability, role ,address} = req.body;
  try {
      const volunteer = await volunteerRepo.signup(fullName, userName, password, skills, availability, role ,address);
      if (!volunteer)throw new Error("Signup didnt Not implemented");
      return res.status(201).redirect('/login');
  } catch (error) {
    console.error("Error saving volunteer data:", error);
    res.status(500).send("An error occurred while saving volunteer data.");
  }
};

const getindex = async (req, res) => {
  try {
    user = req.session.user;
    programs = await programRepo.getProgramByAddress(user.address);  
    return res.status(200).render('volunteer-index');
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


module.exports = {
  getindex,
  signup
};
