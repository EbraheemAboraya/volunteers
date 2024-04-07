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
      return await Volunteer.findOne({ userName });
    } catch (error) {
      throw new Error("Error finding user by username");
    }
  },

  
  async signup(fullName, userName, password, skills, availability, role ,address){
    try{
      const newVolunteer = new Volunteer({
        fullName,
        userName,
        password,
        address,
        skills: skills ? skills.split(",").map((skill) => skill.trim()) : [],
        availability: availability ? availability.split(",").map((day) => day.trim()) : [],
        role 
      });
      return await newVolunteer.save();
    }
    catch (error) {
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
};
