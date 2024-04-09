const adminRepo = require("../repository/admin");
const volunteerRepo = require("../repository/volunteer");
const programRepo = require("../repository/program");
const reportRepo = require("../repository/reprort");
const loginController = require("./login");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;

const signup = async (req, res) => {
  const { fullName, userName, password, programs } = req.body;
  try {
    const role = "admin";
    const selectedFile = req.file;
    const imageBuffer = await getImageBuffer(selectedFile.path);

    const admin = await adminRepo.saveData({
      fullName,
      userName,
      password,
      role,
      programs,
      image: {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        image: imageBuffer,
      },
    });
    if (!admin) res.status(404).send("An error with saving admin");
    res.status(201).send("succfully");
  } catch (error) {
    res.status(500).send("An error occurred while saving admin data.");
  }
};

const AddProgram = async (req, res) => {
  try {
    const {
      programName,
      startDate,
      endDate,
      description,
      maxVolunteer,
      address,
    } = req.body;

    const name = programName;
    let type;
    if (maxVolunteer <= 3) {
      type = "Individual";
    } else {
      type = "orgnaizaion";
    }

    const selectedFile = req.file;
    const imageBuffer = await getImageBuffer(selectedFile.path);
    const program = await programRepo.addProgram({
      name,
      startDate,
      endDate,
      description,
      maxVolunteer,
      address,
      type,
      image: {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        image: imageBuffer,
      },
    });

    if (!program) throw new Error("An error with saving new program");
    jwt.verify(req.token, "my_secret_key", async function (err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        const adminPrograms = await adminRepo.addProgramToAdmin(
          data.tokenPayload.id,
          program._id
        );
      }
    });
    return res.status(200).send({ program });
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
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
    if (!deleted) throw new Error("error with delete program");
    res.status(200).json(deleted);
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

const acceptVolunteer = async (req, res) => {
  try {
    const { programId, volunteerId } = req.body;

    const program = await programRepo.getProgramById(programId);
    if (program.maxVolunteer >= program.Acceptedvolunteers.length) {
      const response = await programRepo.acceptVolunteer(
        programId,
        volunteerId
      );
      if (!response) throw new Error("error with accepting program");
      return res.status(200).json(response);
    }
    return res.status(201).json(2);
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

const rejectVolunteer = async (req, res) => {
  try {
    const { programId, volunteerId } = req.body;

    const response = await programRepo.rejectVolunteer(programId, volunteerId);
    if (!response) throw new Error("error with updating program");
    res.status(200).json(response);
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

const getAdminData = async (req, res) => {
  try {
    const tokenWithoutQuotes = req.token.replace(/"/g, "");
    jwt.verify(tokenWithoutQuotes, "my_secret_key", async function (err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        const adminData = await adminRepo.getAdminData(data.tokenPayload.id);

        if (!adminData) throw new Error("error with getAdminData program");
        return res.status(200).json(adminData);
      }
    });
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

const getAdminPrograms = async (req, res) => {
  try {
    const tokenWithoutQuotes = req.token.replace(/"/g, "");
    jwt.verify(tokenWithoutQuotes, "my_secret_key", async function (err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        const adminData = await adminRepo.getAdminData(data.tokenPayload.id);
        if (!adminData) throw new Error("Error fetching admin data");
        const Programs = await programRepo.getProgramsData(adminData.programs);
        if (Programs === false || Programs.length === 0) {
          return res.send(false);
        }
        let adminPrograms = [];
        for (let i = 0; i < Programs.length; i++) {
          let program = Programs[i];

          const row = {
            name: program.name,
            status: "Active",
            volunteersno: program.maxVolunteer,
            location: program.address,
            daterange: `${program.startDate.toDateString()} - ${program.endDate.toDateString()}`,
            volunteers: [],
          };

          if (program.Acceptedvolunteers.length > 0) {
            for (let j = 0; j < program.Acceptedvolunteers.length; j++) {
              let volunteer_id = program.Acceptedvolunteers[j];
              let volunteerData = await volunteerRepo.getVolunteerData(
                volunteer_id
              );

              let volunteerReports = await reportRepo.getReports(
                program.id,
                volunteer_id
              );

              const volunteer = {
                name: volunteerData.fullName,
                status: "Active",
                availability: volunteerData.availability,
                location: volunteerData.address,
                skils: volunteerData.skills,
                reports: volunteerReports,
                sex: volunteerReports,
                age: volunteerReports,
              };

              row.volunteers.push(volunteer);
            }
          }
          adminPrograms.push(row);
        }
        return res.status(200).json(adminPrograms);
      }
    });
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

const getProgramstoVolunteers = async (req, res) => {
  try {
    const tokenWithoutQuotes = req.token.replace(/"/g, "");
    jwt.verify(tokenWithoutQuotes, "my_secret_key", async function (err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        const adminData = await adminRepo.getAdminData(data.tokenPayload.id);
        if (!adminData) throw new Error("Error fetching admin data");

        const Programs = await programRepo.getProgramsData(adminData.programs);
        if (!Programs) return false;
        let adminPrograms = [];
        for (let i = 0; i < Programs.length; i++) {
          let program = Programs[i];

          const row = {
            _id: program._id,
            name: program.name,
            status: "Active",
            volunteersno: program.maxVolunteer,
            location: program.address,
            daterange: `${program.startDate.toDateString()} - ${program.endDate.toDateString()}`,
            volunteers: [],
          };

          if (program.volunteers.length > 0) {
            for (let j = 0; j < program.volunteers.length; j++) {
              let volunteer_id = program.volunteers[j];
              let volunteerData = await volunteerRepo.getVolunteerData(
                volunteer_id
              );

              const volunteer = {
                _id: volunteerData._id,
                name: volunteerData.fullName,
                status: "Active",
                availability: volunteerData.availability,
                location: volunteerData.address,
                skils: volunteerData.skills,
                sex: volunteerData.sex,
                age: volunteerData.age,
              };

              row.volunteers.push(volunteer);
            }
          }
          adminPrograms.push(row);
        }
        return res.status(200).json(adminPrograms);
      }
    });
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

const getVolunteerData = async (req, res) => {
  try {
    const volunteerData = await volunteerRepo.getVolunteerData(req.params.id);
    if (!volunteerData) throw new Error("error with updating program");
    return res.status(200).send(volunteerData);
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

module.exports = {
  signup,
  AddProgram,
  updateProgram,
  deleteProgram,
  acceptVolunteer,
  getAdminData,
  getAdminPrograms,
  getVolunteerData,
  getProgramstoVolunteers,
  rejectVolunteer,
};
