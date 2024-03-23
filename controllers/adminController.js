const adminRepo = require("../repository/admin");
const programRepo = require("../repository/program");
const loginController = require("./login");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { fullName, userName, password, role, programs } = req.body;
  try {
    const admin = await adminRepo.saveData(
      fullName,
      userName,
      password,
      role,
      programs
    );
    if (!admin) res.status(404).send("An error with saving admin");
    res.status(201).send("succfully");
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
    const {
      name,
      description,
      address,
      startDate,
      endDate,
      maxVolunteer,
      volunteers,
      type,
    } = req.body;

    const newProgram = await programRepo.addProgram({
      name,
      description,
      maxVolunteer,
      address,
      startDate,
      endDate,
      volunteers,
      type,
    });

    if (!newProgram) throw new Error("An error with saving new program");
    jwt.verify(req.token, "my_secret_key", async function (err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        const adminPrograms = await adminRepo.addProgramToAdmin(
          data.tokenPayload.id,
          newProgram._id
        );
      }
    });

    return res.status(200).send({ newProgram });
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

const updateProgram = async (req, res) => {
  try {
    const updated = await programRepo.updateProgram(req.body);
    if (!updated) throw new Error("error with updating program");
    res.status(200).json(updated);
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

const deleteProgram = async (req, res) => {
  try {
    jwt.verify(req.token, "my_secret_key", async function (err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        const adminPrograms = await adminRepo.deleteProgram(
          data.tokenPayload.id,
          req.body._id
        );
      }
    });
    const deleted = await programRepo.deleteProgram(req.body);
    if (!deleted) throw new Error("error with updating program");
    res.status(200).json(deleted);
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

module.exports = {
  getProfile,
  signup,
  getProgramPage,
  AddProgram,
  updateProgram,
  deleteProgram,
};

// image: {
//   filename: req.file.originalname,
//   contentType: req.file.mimetype,
//   image: req.file.buffer
// },
