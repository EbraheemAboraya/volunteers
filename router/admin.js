const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const checkRole = require("../middleware/authMiddleware");
const loginController = require("../controllers/login");
const upload = require("../middleware/img");


router.post("/admin/signup", upload.single('selectedFile'),adminController.signup);


router.post(
  "/add-program",
  loginController.ensureToken,
  upload.single('selectedFile'),
  adminController.AddProgram
);


// router.post("/add-program", loginController.ensureToken, adminController.AddProgram);
router.put(
  "/update-program",
  loginController.ensureToken,
  adminController.updateProgram
);
router.delete(
  "/delete-program",
  loginController.ensureToken,
  adminController.deleteProgram
);
router.post(
  "/accept-volunteer",
  loginController.ensureToken,
  adminController.acceptVolunteer
);
router.post(
  "/reject-volunteer",
  loginController.ensureToken,
  adminController.rejectVolunteer
);
router.get(
  "/admin/getAdminData",
  loginController.ensureToken,
  adminController.getAdminData
);
router.get(
  "/admin/getAdminPorgrams",
  loginController.ensureToken,
  adminController.getAdminPrograms
);
router.get(
  "/admin/getProgramstoVolunteers",
  loginController.ensureToken,
  adminController.getProgramstoVolunteers
);




router.get(
  "/admin/getVolunteerData/:id",
  loginController.ensureToken,
  adminController.getVolunteerData
);

module.exports = router;
