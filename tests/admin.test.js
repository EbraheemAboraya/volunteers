const request = require("supertest");
const { app, connectDB } = require("../app");
const mongoose = require("mongoose");
const programRepo = require("../repository/program");
const adminRepo = require("../repository/admin");
const jwt = require("jsonwebtoken");
const validToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblBheWxvYWQiOnsiaWQiOiI2NjAzNDE3Y2U4NDNjZmE3M2M1ZDYxZjIiLCJ1c2VyTmFtZSI6InYiLCJyb2xlIjoidm9sdW50ZWVyIiwiYWRkcmVzcyI6ImlzcmFlbCJ9LCJpYXQiOjE3MTE0OTY0MTN9.ks_co3rzoqp5o7UsoxZd5Fb81vDFJb1A9Z9-F9yKXgM";

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn((token, secret, callback) =>
    callback(null, { tokenPayload: { id: "adminId" } })
  ),
}));

jest.mock("../repository/program", () => ({
  addProgram: jest
    .fn()
    .mockResolvedValue({ _id: "newProgramId", name: "New Program" }),
  deleteProgram: jest.fn().mockResolvedValue(true),
  updateProgram: jest
    .fn()
    .mockResolvedValue({ _id: "updatedProgramId", name: "Updated Program" }),
}));

jest.mock("../repository/admin", () => ({
  addProgramToAdmin: jest.fn().mockResolvedValue(true),
  deleteProgram: jest.fn().mockResolvedValue(true),
  saveData: jest.fn().mockResolvedValue(true),
}));

beforeAll(async () => {
  await connectDB();
});

describe("POST /addprogram", () => {
  it("successfully creates a new program and adds it to an admin -200", async () => {
    const programData = {
      name: "New Program",
      description: "A new program description",
      address: "123 Main St",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      maxVolunteer: 50,
      volunteers: [],
      type: "Environmental",
    };

    const res = await request(app)
      .post("/addprogram")
      .set("Authorization", `Bearer ${validToken}`)
      .send(programData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("newProgram");
    expect(jwt.verify).toHaveBeenCalled();
    expect(programRepo.addProgram).toHaveBeenCalledWith(
      expect.objectContaining(programData)
    );
    expect(adminRepo.addProgramToAdmin).toHaveBeenCalledWith(
      "adminId",
      "newProgramId"
    );
  });
  it("error saving the new program -500 ", async () => {
    programRepo.addProgram.mockRejectedValue(new Error("Error saving program"));

    const programData = {
      name: "Test Program",
      description: "Test Description",
      address: "123 Test St",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      maxVolunteer: 20,
      volunteers: [],
      type: "Test",
    };

    const res = await request(app)
      .post("/addprogram")
      .set("Authorization", `Bearer ${validToken}`)
      .send(programData);

    expect(res.statusCode).toEqual(500);

    expect(res.body.message).toContain("Error saving program");
  });
});

describe("DELETE /deleteprogram", () => {
  it("successfully deletes a program -200 ", async () => {
    const res = await request(app)
      .delete("/deleteprogram")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ _id: "programIdToDelete" });

    expect(res.status).toEqual(200);
    expect(programRepo.deleteProgram).toHaveBeenCalledWith({
      _id: "programIdToDelete",
    });
    expect(adminRepo.deleteProgram).toHaveBeenCalledWith(
      "adminId",
      "programIdToDelete"
    );
  });

  it("fails to delete a program error in the deletion process -500 ", async () => {
    programRepo.deleteProgram.mockRejectedValue(new Error("Deletion error"));

    const res = await request(app)
      .delete("/deleteprogram")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ _id: "programIdToDelete" });

    expect(res.status).toEqual(500);
    expect(res.body.message).toContain("Deletion error");
  });

  it("fails to delete a program due to token verification failure - 403 ", async () => {
    jwt.verify.mockImplementation((token, secret, callback) =>
      callback(new Error("Invalid token"), null)
    );

    const res = await request(app)
      .delete("/deleteprogram")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ _id: "programIdToDelete" });

    expect(res.status).toEqual(403);
  });
});

describe("PUT /updateprogram", () => {
  it("successfully updates a program", async () => {
    const updatedProgramData = {
      _id: "programIdToUpdate",
      name: "Updated Program Name",
      description: "Updated Program Description",
      address: "456 Updated St",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      maxVolunteer: 100,
      volunteers: [],
      type: "Updated Type",
    };

    const res = await request(app)
      .put("/updateprogram")
      .set("Authorization", `Bearer ${validToken}`)
      .send(updatedProgramData);

    expect(res.statusCode).toEqual(200);
    expect(programRepo.updateProgram).toHaveBeenCalledWith(updatedProgramData);
    expect(res.body).toEqual({
      _id: "updatedProgramId",
      name: "Updated Program",
    });
  });
  it("responds with 500 when there is an error updating the program", async () => {
    programRepo.updateProgram.mockRejectedValue(
      new Error("Error updating program")
    );

    const updatedProgramData = {
      _id: "programIdToUpdate",
      name: "Updated Program Name",
      description: "Updated Program Description",
      address: "456 Updated St",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      maxVolunteer: 100,
      volunteers: [],
      type: "Updated Type",
    };

    const res = await request(app)
      .put("/updateprogram")
      .set("Authorization", `Bearer ${validToken}`)
      .send(updatedProgramData);

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toContain("Error updating program");
  });
});

describe("POST /admin/signup", () => {
  it("successfully signs up an admin", async () => {
    const adminData = {
      fullName: "John Doe",
      userName: "johndoe",
      password: "password123",
      role: "admin",
      programs: [],
    };

    const res = await request(app).post("/admin/signup").send(adminData);

    expect(res.statusCode).toEqual(201);
    expect(adminRepo.saveData).toHaveBeenCalledWith(
      adminData.fullName,
      adminData.userName,
      adminData.password,
      adminData.role,
      adminData.programs
    );
    expect(res.text).toEqual("succfully");
  });

  it("responds with 500 when there is an error signing up an admin", async () => {
    adminRepo.saveData.mockRejectedValue(new Error("Error saving admin"));

    const adminData = {
      fullName: "John Doe",
      userName: "johndoe",
      password: "password123",
      role: "admin",
      programs: [],
    };

    const res = await request(app).post("/admin/signup").send(adminData);

    expect(res.statusCode).toEqual(500);
    expect(res.text).toContain("An error occurred while saving admin data.");
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
