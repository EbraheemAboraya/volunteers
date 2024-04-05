const Report = require("./path/to/your/ReportModel"); // Update the path to where your Report model is located

// POST: Create a new report
exports.createReport = async (req, res) => {
  try {
    const newReport = new Report({
      title: req.body.title,
      content: req.body.content,
      volunteers: req.body.volunteers,
      programId: req.body.programId,
    });

    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('volunteers programId');
    res.status(200).json(reports);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('volunteers programId');
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
