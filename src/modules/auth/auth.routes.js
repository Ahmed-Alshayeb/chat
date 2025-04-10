import { Router } from "express";
import * as AC from "./auth.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import {
  multerHost,
  validExtension,
} from "../../middlewares/upload.middleware.js";

const authRouter = Router();

// @route   POST /api/auth/signup
authRouter.post("/signup", AC.signup);

// @route   POST /api/auth/login
authRouter.post("/login", AC.login);

// @route   POST /api/auth/logout
authRouter.get("/logout", AC.logout);

// @route   POST /api/auth/update
authRouter.post(
  "/update",
  auth(),
  multerHost(validExtension.image).single("profilePic"),
  AC.updateProfile
);

export default authRouter;
