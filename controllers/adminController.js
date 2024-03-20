const adminRepo = require("../repository/admin");
const programRepo = require("../repository/program");


const multer = require('multer');
const upload = multer({ dest: 'uploads/' });





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

const getProfile = async (req, res) => {
  try {
    res.render("admin-index");
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

const getProgramPage = async (req, res) => {
  try {
    res.render("form-addProgram");
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

const AddProgram = async (req, res) => {
  try {
    const { name, description, address, startDate, endDate ,image,logo} = req.body;

    const newProgram = await programRepo.addProgram({
      name,
      description,
      address,
      startDate,
      endDate,
      image: {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        image: req.file.buffer
      },
    });

    if (!newProgram) throw new Error("An error with saving new program");
    return res.status(200).redirect("/admin/index");
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

module.exports = {
  getProfile,
  signup,
  getProgramPage,
  AddProgram,
};
