const repositoryProgram = require("../repository/reprort");
const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const validToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblBheWxvYWQiOnsiaWQiOiI2NjAzNDE3Y2U4NDNjZmE3M2M1ZDYxZjIiLCJ1c2VyTmFtZSI6InYiLCJyb2xlIjoidm9sdW50ZWVyIiwiYWRkcmVzcyI6ImlzcmFlbCJ9LCJpYXQiOjE3MTE0OTY0MTN9.ks_co3rzoqp5o7UsoxZd5Fb81vDFJb1A9Z9-F9yKXgM";

const { app, connectDB } = require("../app");

jest.mock("../repository/reprort", () => ({
  addReport: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

const reportData = {
  content: "This is a test report",
  programId: "program123",
  createdAt: new Date().toISOString(),
};

beforeAll(async () => {
  await connectDB();
});

describe("POST /addReport", () => {
  beforeEach(() => {
    jwt.verify.mockReset();
    repositoryProgram.addReport.mockReset();
  });

  it("successfully creates a report", async () => {
    jwt.verify.mockImplementation((token, secret, cb) =>
      cb(null, {
        tokenPayload: {
          id: "testVolunteerId",
        },
      })
    );

    repositoryProgram.addReport.mockResolvedValue({
      ...reportData,
      volunteer: "testVolunteerId",
    });

    const response = await request(app)
      .post("/addReport")
      .set("Authorization", `Bearer ${validToken}`)
      .send(reportData);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      ...reportData,
      volunteer: "testVolunteerId",
    });
  });

  it("returns a 403 status for invalid token", async () => {
    jwt.verify.mockImplementation((token, secret, cb) =>
      cb(new Error("invalid token"), null)
    );

    const response = await request(app)
      .post("/addReport")
      .set("Authorization", `Bearer ${validToken}`)
      .send(reportData);

    expect(response.statusCode).toEqual(403);
  });
});
afterAll(async () => {
  await mongoose.disconnect();
});
