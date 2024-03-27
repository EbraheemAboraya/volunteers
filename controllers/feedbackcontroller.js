const feedbackRepo = require("../repository/Feedback");

async function getAllFeedback(req, res) {
  try {
    const feedbackList = await feedbackRepo.getAllFeedback(req.params.ProgramID);
    return res.json(feedbackList);
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

async function addFeedback(req, res) {
  try {
    const feedbackData = req.body;
    const feedback = await feedbackRepo.addFeedback(feedbackData);
    console.log(feedback);
    res.status(201).json(feedback);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding feedback", error: error.message });
  }
}

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
  addFeedback,
  updateFeedback,
  deleteFeedback,
};
