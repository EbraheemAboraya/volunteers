const feedbackRepo = require("../repository/Feedback");
const volunteerRepo = require("../repository/volunteer");




async function getAllFeedback(req, res) {
  try {
    let volunteerArr = [];
    const feedbackList = await feedbackRepo.getAllFeedback(req.params.ProgramID);
    
    if (!feedbackList) {
      return flase
    }
    for (let i = 0; i < feedbackList.length; i++) {
      let feedback = feedbackList[i];
      const volunteer = await volunteerRepo.getVolunteerData(feedback.volunteers);
      if (volunteer) {
        const row = {
          _id:feedback._id,
          content: feedback.content,
          name: volunteer.fullName,
          image:volunteer.image,
        };
        volunteerArr.push(row);
      }
    }
    return res.json(volunteerArr);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving feedback", error: error.message });
  }
}


async function getFeedbackByUserId(req, res) {
  try {
    const userId = req.params.userId;
    const feedback = await feedbackRepo.getFeedbackByUserId(userId);
    if (feedback.length === 0) {
      return res
        .status(404)
        .json({ message: "No feedback found for the given user ID" });
    }
    res.json(feedback);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving feedback", error: error.message });
  }
}

// async function addFeedback(req, res) {
//   try {
//     const feedbackData = req.body;
//     const feedback = await feedbackRepo.addFeedback(feedbackData);
//     res.status(201).json(feedback);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error adding feedback", error: error.message });
//   }
// }

async function updateFeedback(req, res) {
  try {
    const feedbackId = req.params.id;
    const feedbackData = req.body;
    const updatedFeedback = await feedbackRepo.updateFeedback(
      feedbackId,
      feedbackData
    );
    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.json(updatedFeedback);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating feedback", error: error.message });
  }
}

async function deleteFeedback(req, res) {
  try {
    const feedbackId = req.params.id; 
    await feedbackRepo.deleteFeedback(feedbackId);
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting feedback", error: error.message });
  }
}

module.exports = {
  getAllFeedback,
  getFeedbackByUserId,
    updateFeedback,
  deleteFeedback,
};
