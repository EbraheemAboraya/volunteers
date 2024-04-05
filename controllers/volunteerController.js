const programRepo = require("../repository/program");
const volunteerRepo = require("../repository/volunteer");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { fullName, userName, password, skills, availability, role, address } =
    req.body;

  try {
    if (!fullName || !userName || !password || !role) {
      return res.status(400).send("Missing required fields");
    }
    const volunteer = await volunteerRepo.signup(
      fullName,
      userName,
      password,
      skills,
      availability,
      role,
      address
    );
    if (!volunteer) throw new Error("Signup didnt Not implemented");
    console.log(fullName);

    return res.status(201).redirect("/login");
  } catch (error) {
    res.status(500).send("An error occurred while saving volunteer data.");
  }
};

const getPrograms = async (req, res) => {
  try {
    const tokenWithoutQuotes = req.token.replace(/"/g, "");
    jwt.verify(tokenWithoutQuotes, "my_secret_key", async function (err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        const type = "organization";
        const volunteerPrograms = await programRepo.getProgramByAddress(
          data.tokenPayload.address,
          type
        );
        return res.status(200).send(volunteerPrograms);
      }
    });
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

const getIndividual = async (req, res) => {
  try {
    const tokenWithoutQuotes = req.token.replace(/"/g, "");

    jwt.verify(tokenWithoutQuotes, "my_secret_key", async function (err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        const type = "Individual";
        const volunteerPrograms = await programRepo.getProgramByAddress(
          data.tokenPayload.address,
          type
        );
        return res.status(200).send(volunteerPrograms);
      }
    });
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

module.exports = {
  getPrograms,
  signup,
  getIndividual,
};
