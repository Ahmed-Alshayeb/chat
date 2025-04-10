import bcrypt from "bcryptjs";
import userModel from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import AppError from "../../utils/AppError.js";
import { generateToken } from "../../utils/token.generator.js";
import cloudinary from "../../services/cloudinary.service.js";

// @desc    Signup
// @route   POST /api/auth/signup
export const signup = asyncHandler(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  // Check if user already exists
  const checkUser = await userModel.findOne({ email });
  if (checkUser) {
    return next(new AppError(400, "User already exists"));
  }

  // Hash password
  const hash = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await userModel.create({ fullName, email, password: hash });

  if (newUser) {
    // Generate token
    const token = generateToken(newUser._id, res);

    // Send response
    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        },
      },
      token,
    });
  } else {
    return next(new AppError(400, "Failed to create user"));
  }
});

// @desc    Login
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new AppError(401, "Invalid credentials"));
  }

  // Check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(new AppError(401, "Invalid credentials"));
  }

  // Generate token
  const token = generateToken(user._id, res);

  // Send response
  res.status(200).json({ status: "success", data: { user }, token });
});

// @desc    Logout
// @route   POST /api/auth/logout
export const logout = asyncHandler(async (req, res, next) => {
  res.status(200).cookie("token", "", { maxAge: 0 }).json({
    status: "success",
    message: "Logout successful",
  });
});

// @desc    Update Profile
// @route   POST /api/auth/update
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { fullName, email } = req.body;

  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new AppError(404, "User not found"));
  }

  if (!req.file) return next(new AppError(400, "image is required"));
  const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
    folder: `chat-app/${user._id}`,
  });

  // Update user profile
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    { fullName, email, profilePic: secure_url },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: { updatedUser },
    },
  });
});
