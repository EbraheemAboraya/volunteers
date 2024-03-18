const adminRepo = require("../repository/admin");

const getProfile = async (req, res) => {
  try {
    res.render("admin-index");
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

const signup = async (req, res) => {
  const { fullName, userName, password, role } = req.body;
  try {
    const admin = await adminRepo.save(fullName, userName, password, role);
    if (!admin) res.status(404).send("An error with saving admin");
    res.status(201).redirect("/login");
  } catch (error) {
    console.error("Error saving volunteer data:", error);
    res.status(500).send("An error occurred while saving admin data.");
  }
};

module.exports = {
  getProfile,
  signup,
};
