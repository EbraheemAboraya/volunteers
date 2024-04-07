const adminRepo = require("../repository/admin");
const volunteerRepo = require("../repository/volunteer");
const programRepo = require("../repository/program");
const reportRepo = require("../repository/reprort");
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



    // let type;
    // if (maxVolunteer <= 3) {
    //   type = "Individual";
    // } else {
    //   type = "orgnaizaion";
    // }

    // const newProgram = await programRepo.addProgram({
    //   name,
    //   description,
    //   maxVolunteer,
    //   address,
    //   startDate,
    //   endDate,
    //   type,
    //   image: { filename, path }

    // });

    // if (!newProgram) throw new Error("An error with saving new program");
    // jwt.verify(req.token, "my_secret_key", async function (err, data) {
    //   if (err) {
    //     res.sendStatus(403);
    //   } else {
    //     const adminPrograms = await adminRepo.addProgramToAdmin(
    //       data.tokenPayload.id,
    //       newProgram._id
    //     );
    //   }
    // });

    const AddProgram = async (req, res) => {
      try {
        const { programName, startDate, endDate } = req.body;
        const selectedFile = req.file;
      
        const program = await programRepo.addProgram({
          programName,
          startDate,
          endDate,
          file: {
            data: fs.readFileSync(selectedFile.path),
            contentType: selectedFile.mimetype
          }
        });
        console.log(program)

    
        // Return the program object in the response
        return res.status(200).send({ program });
      } catch (err) {
        return res.status(err?.status || 500).json({ message: err.message });
      }
    };
// end addProgram

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

const acceptVolunteer = async (req, res) => {
  try {
    const data = req.body;

    const response = await programRepo.acceptVolunteer(data);
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

        if (!adminData) throw new Error("error with updating program");
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
        if (!Programs) throw new Error("Error fetching programs data");
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
};
