const Report = require("../models/report");

module.exports = {
  // Add a new report
  async addReport(reportData) {
    const report = new Report(reportData);
    return await report.save();
  },

  async getReports(programId, volunteerId) {
    try {
      const reports = await Report.find({
        programId: programId,
        volunteer: volunteerId,
      });
      return reports;
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  },


};
