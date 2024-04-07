const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const checkRole = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/img");
const loginController = require("../controllers/login");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });

router.post("/admin/signup", adminController.signup);
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
  "/admin/getVolunteerData/:id",
  loginController.ensureToken,
  adminController.getVolunteerData
);

module.exports = router;
