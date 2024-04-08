const programRepo = require("../repository/program");

const volunteerRepo = require("../repository/volunteer");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;

const signup = async (req, res) => {
  const {
    fullName, userName,password, skills,availability,address,sex,age,} = req.body;

  try {
    if (!fullName || !userName || !password ) {
      return res.status(400).send("Missing required fields");
    }

    const selectedFile = req.file;
    const imageBuffer = await getImageBuffer(selectedFile.path);

    const role = "volunteer";

    const volunteer = await volunteerRepo.signup({
      fullName,
      userName,
      password,
      skills,
      availability,
      role,
      address,
      sex,
      age,
      image: {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        image: imageBuffer,
      },
    });
    if (!volunteer) return false;

    return res.status(201).send(volunteer);
  } catch (error) {
    console.error("Error saving volunteer data:", error);
    res.status(500).send("An error occurred while saving volunteer data.");
  }
};


async function getImageBuffer(filePath) {
  try {
    const buffer = await fs.readFile(filePath);
    return buffer;
  } catch (error) {
    console.error("Failed to read file:", error);
    throw error; // Rethrow the error for further handling
  }
}

const getPrograms = async (req, res) => {
  try {
    const tokenWithoutQuotes = req.token.replace(/"/g, "");
    jwt.verify(tokenWithoutQuotes, "my_secret_key", async function (err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        const type = "orgnaizaion";
        const volunteerPrograms = await programRepo.getProgramByAddress(
          data.tokenPayload.id,
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
          data.tokenPayload.id,
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

const sendToJoin = async (req, res) => {
  try {
    const program_id = req.body;
    console.log(program_id)
    const tokenWithoutQuotes = req.token.replace(/"/g, "");
    jwt.verify(tokenWithoutQuotes, "my_secret_key", async function (err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        const _id  = program_id.program_id;
        const program = await programRepo.getProgramById(_id);
        if (program.maxVolunteer >= program.Acceptedvolunteers.length) {
          const resp = await programRepo.sendToJoin(
            data.tokenPayload.id,
            program_id
          );
          if (!resp) false;
          return res.status(200).send(program);
        }
        return res.status(200).send(2);
      }
    });
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

const getProgress = async (req, res) => {
  try {
    const tokenWithoutQuotes = req.token.replace(/"/g, "");

    jwt.verify(tokenWithoutQuotes, "my_secret_key", async function (err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        const volunteerPrograms = await programRepo.getProgress(
          data.tokenPayload.id
        );
        return res.status(200).send(volunteerPrograms);
      }
    });
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

const finishProgram = async (req, res) => {
  try {
    const tokenWithoutQuotes = req.token.replace(/"/g, "");
    jwt.verify(tokenWithoutQuotes, "my_secret_key", async function (err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        const finishResponse = await programRepo.finishProgram(
          data.tokenPayload.id,
          req.body.programId,
          req.body.reviewText
        );
        return res.status(200).send(finishResponse);
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
  sendToJoin,
  getProgress,
  finishProgram,
};
