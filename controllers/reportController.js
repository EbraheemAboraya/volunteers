const reportRepo = require("../repository/reprort");
const jwt = require("jsonwebtoken");
 




// POST: Create a new report
const createReport = async (req, res) => {
  try {

    const tokenWithoutQuotes = req.token.replace(/"/g, "");

    jwt.verify(tokenWithoutQuotes, "my_secret_key", async function (err, data) {
      if (err) {
        res.sendStatus(403);
      } else {

        const newReport = await reportRepo.addReport({
          content: req.body.content,
          volunteer: data.tokenPayload.id,
          programId: req.body.programId,
          createdAt: req.body.createdAt,
        });
        if (!newReport) throw new Error("Signup didnt Not implemented");
        return res.status(201).send(newReport);
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
 
// exports.getAllReports = async (req, res) => {
//   try {
//     const reports = await Report.find().populate('volunteers programId');
//     res.status(200).json(reports);
//   } catch (error) {
//     res.status(404).json({ error: error.message });
//   }
// };
 
// exports.getReportById = async (req, res) => {
//   try {
//     const report = await Report.findById(req.params.id).populate('volunteers programId');
//     if (!report) {
//       return res.status(404).json({ message: "Report not found" });
//     }
//     res.status(200).json(report);
//   } catch (error) {
//     res.status(404).json({ error: error.message });
//   }
// };
 
// exports.updateReport = async (req, res) => {
//   try {
//     const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.status(200).json(updatedReport);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
 
// exports.deleteReport = async (req, res) => {
//   try {
//     await Report.findByIdAndDelete(req.params.id);
//     res.status(204).send();
//   } catch (error) {
//     res.status(404).json({ error: error.message });
//   }
// };
 

module.exports = {
  createReport
};