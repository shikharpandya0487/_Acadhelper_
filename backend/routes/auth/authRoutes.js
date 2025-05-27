import express from "express";
import { googleOauth, loginController, logoutController, signupController } from "../../controllers/auth/authController.js";

const router = express.Router();

router.post('/login',loginController)
router.post('/signup',signupController);
router.get('/logout',logoutController)
router.post('/google',googleOauth);

export default router;
