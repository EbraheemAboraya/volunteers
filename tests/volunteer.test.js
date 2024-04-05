const request = require("supertest");
const jwt = require("jsonwebtoken");
const { app } = require("../app"); // Make sure this imports your Express app correctly
const programRepo = require("../repository/program");

// Mock JWT verification to control its behavior in tests
jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  verify: jest.fn(),
}));

jest.mock("../repository/program", () => ({
  getProgramByAddress: jest.fn().mockResolvedValue([
    { name: "Program 1", type: "organization" },
    { name: "Program 2", type: "organization" },
  ]),
}));

beforeAll(async () => {
  await connectDB();
});

describe("GET /volunteer/programs", () => {
  beforeEach(() => {
    // Reset the mock for JWT verification before each test
    jwt.verify.mockReset();
  });

  it("should return volunteer programs when token is valid", async () => {
    // Mock jwt.verify to simulate a successful verification
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { tokenPayload: { address: "123 Main St" } });
    });

    const token = "Bearer validToken";
    const response = await request(app)
      .get("/volunteer/programs")
      .set("Authorization", token);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual([
      { name: "Program 1", type: "organization" },
      { name: "Program 2", type: "organization" },
    ]);
  });

  it("should return 403 if token is invalid", async () => {
    // Mock jwt.verify to simulate a failed verification
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("Invalid token"), null);
    });

    const response = await request(app)
      .get("/volunteer/programs")
      .set("Authorization", "Bearer invalidToken");

    expect(response.statusCode).toEqual(403);
  });

  it("should return 500 if an error occurs", async () => {
    // Mock getProgramByAddress to simulate an error
    programRepo.getProgramByAddress.mockRejectedValueOnce(
      new Error("Internal Server Error")
    );

    // Assume jwt.verify will be successful here
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { tokenPayload: { address: "123 Main St" } });
    });

    const token = "Bearer validToken";
    const response = await request(app)
      .get("/volunteer/programs")
      .set("Authorization", token);

    expect(response.statusCode).toEqual(500);
    expect(response.body.message).toEqual("Internal Server Error");
  });
});

// jest.mock("../repository/volunteer", () => ({
//   signup: jest.fn().mockResolvedValue(true),
// }));

// describe("POST /volunteer/signup", () => {
//   beforeAll(async () => {
//     await connectDB();
//   });

//   afterAll(async () => {
//     await mongoose.disconnect();
//   });

//   it("should sign up a new volunteer and redirect to another page with status 302", async () => {
//     const reqBody = {
//       fullName: "John Doe",
//       userName: "johndoe",
//       password: "password",
//       skills: ["skill1", "skill2"],
//       availability: ["Monday", "Wednesday"],
//       role: "volunteer",
//       address: "123 Main St",
//     };

//     const res = await request(app).post("/volunteer/signup").send(reqBody);

//     // Assert that the response is a redirect (status code 302)
//     expect(res.statusCode).toEqual(302);

//     // Extract the location header from the response
//     const location = res.header["location"];

//     // Assert that the location header contains the expected redirect URL
//     expect(location).toEqual("/login"); // Adjust the URL as needed
//   });

//   it("should return 400 if any required field is missing", async () => {
//     const reqBody = {
//       fullName: "John Doe",
//       userName: "johndoe",
//       password: "password",
//       role: "volunteer",
//     };

//     const res = await request(app).post("/volunteer/signup").send(reqBody);

//     expect(res.statusCode).toBe(400);
//     expect(res.text).toBe("Missing required fields");
//   });

//   it("should return 500 if an error occurs during signup", async () => {
//     volunteerRepo.signup.mockRejectedValue(new Error("Signup error"));

//     const reqBody = {
//       fullName: "John Doe",
//       userName: "johndoe",
//       password: "password",
//       skills: ["skill1", "skill2"],
//       availability: ["Monday", "Wednesday"],
//       role: "volunteer",
//       address: "123 Main St",
//     };

//     const res = await request(app).post("/volunteer/signup").send(reqBody);

//     expect(res.statusCode).toBe(500);
//     expect(res.text).toBe("An error occurred while saving volunteer data.");
//   });
// });
