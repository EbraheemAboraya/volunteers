const Program = require("../models/program");

module.exports = {
  async getProgramByAddress(address, type) {
    try {
      return await Program.find({ address, type });
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
  async updateProgram(data) {
    try {
      const { _id, ...updateData } = data;
      const updatedProgram = await Program.findByIdAndUpdate(
        { _id: _id },
        { $set: { ...updateData } },
        { new: true }
      );

      if (!updatedProgram) {
        throw new Error("Program not found");
      }
      return updatedProgram;
    } catch (error) {
      console.error("Error updating program:", error);
      throw error;
    }
  },
  async deleteProgram(_id) {
    try {
      const deletedProgram = await Program.findByIdAndDelete(_id);

      if (!deletedProgram) {
        throw new Error("Program not found");
      }
      return deletedProgram;
    } catch (error) {
      console.error("Error deleting program:", error);
      throw error;
    }
  },
};
