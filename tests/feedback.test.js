const repositoryFeedback = require("../repository/Feedback");
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

beforeAll(async () => {
  await connectDB();
});

describe("getAllFeedback", () => {
  beforeEach(() => jest.clearAllMocks());

  // Success - 200
  it("should return all feedback for a given programId stauts - 200", async () => {
    const tempFeedback = [
      { id: "1", feedback: "Great program!", programId: "abc123" },
      { id: "2", feedback: "Very helpful", programId: "abc123" },
    ];
    repositoryFeedback.getAllFeedback.mockResolvedValue(tempFeedback);

    const res = await request(app)
      .get(`/feedbacks/${programId}`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(tempFeedback);
  });

  // Test for 400 when programId is invalid or not provided
  //   it("should return a 400 status for an invalid programId", async () => {
  //     const invalidProgramId = " ";
  //     const res = await request(app)
  //       .get(`/feedbacks/${invalidProgramId}`)
  //       .set("Authorization", `Bearer ${validToken}`);

  //     expect(res.statusCode).toEqual(400);
  //     expect(res.body).toEqual({ error: "Invalid programId provided" });
  //   });

  it("should return a 500 status code on server error", async () => {
    repositoryFeedback.getAllFeedback.mockRejectedValue(
      new Error("Internal server error")
    );

    const res = await request(app)
      .get(`/feedbacks/${programId}`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toContain("Error retrieving feedback");
  });
});

describe("POST /feedback", () => {
  // Success - 201 Created
  it("creates a new feedback and returns 201 status", async () => {
    const feedbackData = {
      programId: "631dcd9b8b8d9c01248e1a2b",
      volunteers: "631dcd9b8b8d9c01248e1a2c",
      content: "This program was very helpful.",
    };

    repositoryFeedback.addFeedback.mockResolvedValue({
      _id: "631dcd9b8b8d9c01248e1a2d",
      ...feedbackData,
    });

    const res = await request(app)
      .post("/feedbacks")
      .set("Authorization", `Bearer ${validToken}`)
      .send(feedbackData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining(feedbackData));
    expect(res.body).toHaveProperty("_id");
  });

  // 500 Internal Server Error
  it("returns 500 if there is an internal server error", async () => {
    repositoryFeedback.addFeedback.mockRejectedValue(
      new Error("Internal Server Error")
    );

    const feedbackData = {
      programId: "631dcd9b8b8d9c01248e1a2b",
      volunteers: "631dcd9b8b8d9c01248e1a2c",
      content: "This program was very helpful.",
    };

    const res = await request(app)
      .post("/feedbacks")
      .set("Authorization", `Bearer ${validToken}`)
      .send(feedbackData);

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({
      message: "Error adding feedback",
      error: "Internal Server Error",
    });
  });

  it("returns 400 for missing required fields in the feedback data", async () => {
    const incompleteFeedbackData = {
      programId: "631dcd9b8b8d9c01248e1a2b",
      volunteers: "631dcd9b8b8d9c01248e1a2c",
    };

    const res = await request(app)
      .post("/feedbacks")
      .set("Authorization", `Bearer ${validToken}`)
      .send(incompleteFeedbackData);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: "Missing required feedback content" });
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
