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

jest.mock("jsonwebtoken");
jest.mock("../repository/program");
jest.mock("../repository/admin");

jest.mock("../repository/program", () => ({
  addProgramToAdmin: jest
    .fn()
    .mockResolvedValue({ _id: "newProgramId", name: "New Program" }),
  deleteProgram: jest.fn().mockResolvedValue(true),
  updateProgram: jest
    .fn()
    .mockResolvedValue({ _id: "updatedProgramId", name: "Updated Program" }),
  acceptVolunteer: jest.fn(),
}));

jest.mock("../repository/admin", () => ({
  addProgramToAdmin: jest.fn().mockResolvedValue(true),
  deleteProgram: jest.fn().mockResolvedValue(true),
  saveData: jest.fn().mockResolvedValue(true),
}));

beforeAll(async () => {
  await connectDB();
});



describe("DELETE /deleteprogram", () => {
  it("successfully deletes a program -200 ", async () => {
    const res = await request(app)
      .delete("/delete-program")
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
      .put("/update-program")
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
      .put("/update-program")
      .set("Authorization", `Bearer ${validToken}`)
      .send(updatedProgramData);

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toContain("Error updating program");
  });
});


afterAll(async () => {
  await mongoose.disconnect();
});
