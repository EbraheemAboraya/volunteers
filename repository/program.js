const Program = require("../models/Program");

module.exports = {
  async getProgramByAddress(address) {
    try {
      return await Program.find({ address });
    } catch (error) {
      throw new Error("Error finding programs by address: " + error.message);
    }
  },

  async addProgram(data) {
    try {
      const newProgram = new Program(data);
       await newProgram.save();
      return newProgram;
    } catch (error) {
      throw new Error("Error saving program: " + error.message);
    }
  },
};
