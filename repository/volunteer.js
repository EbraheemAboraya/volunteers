const Volunteer = require("../models/volunteer");

module.exports = {
  async save(user) {
    try {
      await user.save();
    } catch (error) {
      throw new Error("Error saving user");
    }
  },

  async findByUsername(userName) {
    try {
      //  const user = await Volunteer.findOne({ userName });
      return await Volunteer.findOne({ userName }).select("-image");
     
    } catch (error) {
      throw new Error("Error finding user by username");
    }
  },

  async signup(data) {
    try {
      const newVolunteer = new Volunteer(data);
      return await newVolunteer.save();
    } catch (error) {
      throw new Error("Error with volunteer signup");
    }
  },

  async getVolunteerData(_id) {
    try {
      const volunteerData = await Volunteer.findById(_id);

      if (!volunteerData) {
        throw new Error(`volunteer with ID ${_id} not found`);
      }
      return volunteerData;
    } catch (error) {
      console.error("Error retrieving program data:", error);
      throw error;
    }
  },
  async getImage(_id) {
    try {
      const volunteerData = await Volunteer.findById(_id);

      if (!volunteerData) {
        throw new Error(`volunteer with ID ${_id} not found`);
      }
      return volunteerData.image;
    } catch (error) {
      console.error("Error retrieving program data:", error);
      throw error;
    }
  },
  
};
