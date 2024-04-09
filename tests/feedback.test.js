const repositoryFeedback = require("../repository/Feedback");
const volunterrepo = require("../repository/volunteer");

const mongoose = require("mongoose");
const request = require("supertest");
const Feedback = require("../models/feedback");
const validToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblBheWxvYWQiOnsiaWQiOiI2NjAzNDE3Y2U4NDNjZmE3M2M1ZDYxZjIiLCJ1c2VyTmFtZSI6InYiLCJyb2xlIjoidm9sdW50ZWVyIiwiYWRkcmVzcyI6ImlzcmFlbCJ9LCJpYXQiOjE3MTE0OTY0MTN9.ks_co3rzoqp5o7UsoxZd5Fb81vDFJb1A9Z9-F9yKXgM";
const programId = "abc123";
const { app, connectDB } = require("../app");

jest.mock("../repository/Feedback", () => ({
  getAllFeedback: jest.fn(),
  addFeedback: jest.fn(),
  getFeedbackByUserId: jest.fn(),
  updateFeedback: jest.fn(),
  deleteFeedback: jest.fn(),
}));
jest.mock("../repository/volunteer", () => ({
  getVolunteerData: jest.fn(),
}));
beforeAll(async () => {
  await connectDB();
});

describe("getAllFeedback 200 ", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock for getAllFeedback
    repositoryFeedback.getAllFeedback.mockResolvedValue([
      { _id: "1", content: "Great program!", volunteers: "volunteer1" },
      { _id: "2", content: "Very helpful", volunteers: "volunteer2" },
    ]);

    volunterrepo.getVolunteerData
      .mockResolvedValueOnce({ fullName: "John Doe", image: "image_url1" })
      .mockResolvedValueOnce({ fullName: "Jane Doe", image: "image_url2" });
  });

  it("should return all feedback for a given programId - status 200", async () => {
    const response = await request(app)
      .get(`/feedbacks/abc123`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual([
      {
        _id: "1",
        content: "Great program!",
        name: "John Doe",
        image: "image_url1",
      },
      {
        _id: "2",
        content: "Very helpful",
        name: "Jane Doe",
        image: "image_url2",
      },
    ]);
  });

  it("should return a 500 status code on server error", async () => {
    repositoryFeedback.getAllFeedback.mockRejectedValue(new Error("Internal server error"));

    const response = await request(app)
      .get(`/feedbacks/abc123`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.statusCode).toEqual(500);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Error retrieving feedback");
  });
});


describe("GET /feedback/user/:userId", () => {
  it("retrieves feedback successfully for a given user ID", async () => {
    const userId = "123";
    const mockFeedback = [
      { id: "1", content: "Great program!", userId },
      { id: "2", content: "Really helpful", userId },
    ];

    repositoryFeedback.getFeedbackByUserId.mockResolvedValue(mockFeedback);

    const res = await request(app)
      .get(`/feedback/user/${userId}`)
      .set("Authorization", validToken);

    expect(repositoryFeedback.getFeedbackByUserId).toHaveBeenCalledWith(userId);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockFeedback);
  });

  it("returns 404 when no feedback is found for the given user ID", async () => {
    const userId = "nonexistentUserId";
    repositoryFeedback.getFeedbackByUserId.mockResolvedValue([]);

    const res = await request(app)
      .get(`/feedback/user/${userId}`)
      .set("Authorization", validToken);

    expect(repositoryFeedback.getFeedbackByUserId).toHaveBeenCalledWith(userId);
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      message: "No feedback found for the given user ID",
    });
  });

  it("returns 500 if there is an internal server error during feedback retrieval", async () => {
    const userId = "userIdWithError";
    repositoryFeedback.getFeedbackByUserId.mockRejectedValue(
      new Error("Internal server error")
    );

    const res = await request(app)
      .get(`/feedback/user/${userId}`)
      .set("Authorization", validToken);

    // Corrected to use repositoryFeedback instead of feedbackRepo
    expect(repositoryFeedback.getFeedbackByUserId).toHaveBeenCalledWith(userId);
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      message: "Error retrieving feedback",
      error: "Internal server error",
    });
  });
});
afterAll(async () => {
  await mongoose.disconnect();
});
