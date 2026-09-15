const express = require("express");
const  router = express.Router();
const {checkRole} = require("../middlewares/checkRole");
const {userAuth} = require("../middlewares/userAuth");

const {userController} = require("../controller/user")
router.get("/",userController.getUsers)

router.post("/register",userController.userRegistration);

router.post("/login",userController.login)

router.get("/profile",userAuth,checkRole("user"),userController.profile);
router.get("/library-status", userAuth, checkRole("user"), userController.getLibraryStatus);
router.post("/checkin", userAuth, checkRole("user"), userController.checkInLibrary);
router.post("/checkout", userAuth, checkRole("user"), userController.checkOutLibrary);

router.post("/contact",userController.addContact)

router.post("/forgot-password", userController.forgotPassword);
router.post("/verify-otp", userController.verifyOTP);
router.post("/reset-password", userController.resetPassword);




module.exports = router;