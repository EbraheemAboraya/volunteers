const programRepo = require("../repository/program");

const addProgram = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      programImage,
      logo,
      startDate,
      endDate,
    } = req.body;
    programs = await programRepo.addProgram(
      name,
      description,
      address,
      programImage,
      logo,
      startDate,
      endDate
    );
    return res.render("volunteer-index", { programs });
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

module.exports = {
  addProgram,
};
