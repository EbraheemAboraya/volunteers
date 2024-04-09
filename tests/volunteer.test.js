const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { app, connectDB } = require("../app");
const programRepo = require("../repository/program");
const validToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblBheWxvYWQiOnsiaWQiOiI2NjAzNDE3Y2U4NDNjZmE3M2M1ZDYxZjIiLCJ1c2VyTmFtZSI6InYiLCJyb2xlIjoidm9sdW50ZWVyIiwiYWRkcmVzcyI6ImlzcmFlbCJ9LCJpYXQiOjE3MTE0OTY0MTN9.ks_co3rzoqp5o7UsoxZd5Fb81vDFJb1A9Z9-F9yKXgM";
const programId = "abc123";
jest.mock("../repository/program", () => ({
  sendToJoin: jest.fn(),
  getProgramByAddress: jest.fn(),
  getProgress: jest.fn(),
  finishProgram: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

beforeAll(async () => {
  await connectDB();
});

describe("GET /programs", () => {
  it("successfully retrieves programs", async () => {
    jwt.verify.mockImplementation((token, secret, cb) =>
      cb(null, {
        tokenPayload: {
          id: "testUserId",
          address: "testAddress",
        },
      })
    );

    programRepo.getProgramByAddress.mockResolvedValue([]);

    const response = await request(app)
      .get("/volunteer/programs")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("returns a 403 status for invalid token", async () => {
    jwt.verify.mockImplementation((token, secret, cb) =>
      cb(new Error("invalid token"), null)
    );

    const response = await request(app)
      .get("/volunteer/programs")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.statusCode).toBe(403);
  });

  it("handles unexpected errors", async () => {
    jwt.verify.mockImplementation((token, secret, cb) => {
      throw new Error("unexpected error");
    });

    const response = await request(app)
      .get("/volunteer/programs")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("message", "unexpected error");
  });
});

describe("GET /individual", () => {
  it("successfully retrieves individual volunteer programs", async () => {
    jwt.verify.mockImplementation((token, secret, cb) =>
      cb(null, {
        tokenPayload: {
          id: "testUserId",
          address: "testAddress",
        },
      })
    );

    programRepo.getProgramByAddress.mockResolvedValue([]);

    const response = await request(app)
      .get("/volunteer/Individual")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("returns a 403 status for invalid token", async () => {
    jwt.verify.mockImplementation((token, secret, cb) =>
      cb(new Error("invalid token"), null)
    );

    const response = await request(app)
      .get("/volunteer/Individual")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.statusCode).toBe(403);
  });

  it("handles unexpected errors", async () => {
    jwt.verify.mockImplementation((token, secret, cb) => {
      throw new Error("unexpected error");
    });

    const response = await request(app)
      .get("/volunteer/Individual")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("message", "unexpected error");
  });
});



it("returns a 403 status for invalid token", async () => {
  jwt.verify.mockImplementation((token, secret, cb) =>
    cb(new Error("invalid token"), null)
  );

  const response = await request(app)
    .post("/volunteer/sendToJoinProg")
    .set("Authorization", `Bearer ${validToken}`)
    .send(programId);

  expect(response.statusCode).toBe(403);
});

it("handles unexpected errors", async () => {
  jwt.verify.mockImplementation((token, secret, cb) => {
    throw new Error("unexpected error");
  });

  const response = await request(app)
    .post("/volunteer/sendToJoinProg")
    .set("Authorization", `Bearer ${validToken}`)
    .send(programId);

  expect(response.statusCode).toBe(500);
  expect(response.body).toHaveProperty("message", "unexpected error");
});

describe("GET /progress", () => {
  beforeEach(() => {
    jwt.verify.mockReset();
    programRepo.getProgress.mockReset();
  });

  it("successfully retrieves progress", async () => {
    jwt.verify.mockImplementation((token, secret, cb) =>
      cb(null, {
        tokenPayload: {
          id: "testUserId",
        },
      })
    );

    programRepo.getProgress.mockResolvedValue({
      progress: 40,
    });

    const response = await request(app)
      .get("/volunteer/progress")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      progress: 40,
    });
  });

  it("returns a 403 status for invalid token", async () => {
    jwt.verify.mockImplementation((token, secret, cb) =>
      cb(new Error("invalid token"), null)
    );

    const response = await request(app)
      .get("/volunteer/progress")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.statusCode).toBe(403);
  });

  it("handles unexpected errors", async () => {
    jwt.verify.mockImplementation((token, secret, cb) => {
      throw new Error("unexpected error");
    });

    const response = await request(app)
      .get("/volunteer/progress")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("message", "unexpected error");
  });
});

const programData = {
  programId: "abc123",
  reviewText: "Great program!",
};

describe("POST /finishProgram", () => {
  beforeEach(() => {
    jwt.verify.mockReset();
    programRepo.finishProgram.mockReset();
  });

  it("successfully finishes a program", async () => {
    jwt.verify.mockImplementation((token, secret, cb) =>
      cb(null, {
        tokenPayload: {
          id: "testUserId",
        },
      })
    );

    programRepo.finishProgram.mockResolvedValue({
      success: true,
      message: "Program successfully finished",
    });

    const response = await request(app)
      .post("/volunteer/finish-Program")
      .set("Authorization", `Bearer ${validToken}`)
      .send(programData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Program successfully finished",
    });
  });

  it("returns a 403 status for invalid token", async () => {
    jwt.verify.mockImplementation((token, secret, cb) =>
      cb(new Error("invalid token"), null)
    );

    const response = await request(app)
      .post("/volunteer/finish-Program")
      .set("Authorization", `Bearer ${validToken}`)
      .send(programData);

    expect(response.statusCode).toBe(403);
  });

  it("handles unexpected errors", async () => {
    jwt.verify.mockImplementation((token, secret, cb) => {
      throw new Error("unexpected error");
    });

    const response = await request(app)
      .post("/volunteer/finish-Program")
      .set("Authorization", `Bearer ${validToken}`)
      .send(programData);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("message", "unexpected error");
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
