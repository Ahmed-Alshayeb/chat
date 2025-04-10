import { Router } from "express";
import * as MC from "./msg.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import {
  multerHost,
  validExtension,
} from "../../middlewares/upload.middleware.js";

const msgRouter = Router();

msgRouter.post(
  "/:receiverId",
  auth(),
  multerHost(validExtension.image).single("image"),
  MC.sendMsg
);

export default msgRouter;
