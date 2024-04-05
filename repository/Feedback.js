const Feedback = require("../models/feedback");

async function getAllFeedback(programId) {
  try {
    const feedbackList = await Feedback.find({ programId });
    return feedbackList;
  } catch (error) {
    throw new Error(
      `Error getting all feedback for programId ${programId}: ${error.message}`
    );
  }
}

async function getFeedbackByUserId(userId) {
  try {
    const feedback = await Feedback.find({ volunteers: userId });
    return feedback;
  } catch (error) {
    throw new Error(
      `Error getting feedback for userId ${userId}: ${error.message}`
    );
  }
}

async function addFeedback(feedbackData) {
  try {
    const feedback = new Feedback(feedbackData);
    await feedback.save();
    return feedback;
  } catch (error) {
    throw new Error(`Error adding feedback: ${error.message}`);
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
    throw new Error(
      `Error updating feedback with id ${feedbackId}: ${error.message}`
    );
  }
}

async function deleteFeedback(feedbackId) {
  try {
    await Feedback.findByIdAndDelete(feedbackId);
    return { message: "Feedback deleted successfully" };
  } catch (error) {
    throw new Error(
      `Error deleting feedback with id ${feedbackId}: ${error.message}`
    );
  }
}

module.exports = {
  getAllFeedback,
  getFeedbackByUserId,
  addFeedback,
  updateFeedback,
  deleteFeedback,
};
