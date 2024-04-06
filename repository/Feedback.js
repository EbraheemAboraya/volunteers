const Feedback = require("../models/feedback");

async function getAllFeedback(programId) {
  try {
    const feedbackList = await Feedback.find({ programId });
    return feedbackList;
  } catch (error) {
    console.error("Error getting all feedback:", error);
    throw error;
  }
}

async function getFeedbackByUserId(userId) {
  try {
    const feedback = await Feedback.find({ volunteers: userId });
    return feedback;
  } catch (error) {
    console.error("Error getting feedback by user ID:", error);
    throw error;
  }
}

async function addFeedback(programId, volunteerId, content) {
  try {
    const newFeedback = new Feedback({
      programId: programId,
      volunteers: volunteerId,
      content: content,
    });
    const savedFeedback = await newFeedback.save();
    return savedFeedback;
  } catch (error) {
    console.error("Error adding feedback:", error);
    throw error; 
  }
}

async function updateFeedback(feedbackId, feedbackData) {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      feedbackData,
      { new: true }
    );
    return updatedFeedback;
  } catch (error) {
    console.error("Error updating feedback:", error);
    throw error;
  }
}

async function deleteFeedback(feedbackId) {
  try {
    await Feedback.findByIdAndDelete(feedbackId);
    return { message: "Feedback deleted successfully" };
  } catch (error) {
    console.error("Error deleting feedback:", error);
    throw error;
  }
}

module.exports = {
  getAllFeedback,
  getFeedbackByUserId,
  addFeedback,
  updateFeedback,
  deleteFeedback,
};
