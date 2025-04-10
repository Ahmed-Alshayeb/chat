import jwt from "jsonwebtoken";
import userModel from "../../DB/models/user.model.js";
import AppError from "../utils/AppError.js";

export const auth = (roles = []) => {
  return async (req, res, next) => {
    const { token } = req.cookies || req.headers;
    if (!token) {
      return next(new AppError(400, "token is required"));
    }

    // if (!token.startsWith("ahmed__")) {
    //   return next(new AppError(400, "invalid token"));
    // }

    // const newToken = token.split("ahmed__")[1];
    // if (!newToken) {
    //   return next(new AppError(400, "invalid token"));
    // }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return next(new AppError(400, "invalid token"));
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return next(new AppError(404, "user not found"));
    }

    if (parseInt(user?.passwordChangedAt?.getTime() / 1000) > decoded.iat) {
      return res
        .status(400)
        .json({ msg: "password changed please login again" });
    }

    // if (!roles.includes(user.role)) {
    //   return next(new AppError(401, "you do not have permission!..."));
    // }

    req.user = user;

    next();
  };
};
