const repositoryadmin = require("../repository/admin");
const repositoryvolunteer = require("../repository/volunteer");
const jwt = require("jsonwebtoken");
const request = require("supertest");
const mongoose = require("mongoose");
const { app, connectDB } = require("../app");

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mockToken"),
}));

jest.mock("../repository/admin", () => ({
  findByUsername: jest.fn(),
}));

jest.mock("../repository/volunteer", () => ({
  findByUsername: jest.fn(),
}));

beforeAll(async () => {
  await connectDB();
});

describe("POST /login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("successfully logs in an admin and returns a token", async () => {
    repositoryadmin.findByUsername.mockResolvedValue({
      _id: "adminId",
      userName: "adminUser",
      password: "adminPass",
      role: "admin",
    });

    const res = await request(app)
      .post("/login")
      .send({ userName: "adminUser", password: "adminPass" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(jwt.sign).toHaveBeenCalled();
  });

  it("returns 401 for invalid username", async () => {
    repositoryadmin.findByUsername.mockResolvedValue(null);
    repositoryvolunteer.findByUsername.mockResolvedValue(null);

    const res = await request(app)
      .post("/login")
      .send({ userName: "nonexistentUser", password: "somePass" });

    expect(res.statusCode).toBe(401);
    expect(res.text).toEqual("Invalid username or password");
  });
});
///the password not correct!
afterAll(async () => {
  await mongoose.disconnect();
});
