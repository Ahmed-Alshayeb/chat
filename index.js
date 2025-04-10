import express from "express";
import { config } from "dotenv";
import connectDB from "./DB/connection.js";
import cookieParser from "cookie-parser";
import { app, server, io } from "./src/services/socket.service.js";
import authRouter from "./src/modules/auth/auth.routes.js";
import msgRouter from "./src/modules/messages/msg.routes.js";

// const app = express();
const port = +process.env.PORT || 9000;

config();

// Database connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/message", msgRouter);

app.get("/", (req, res) => {
  res.json({ msg: "API is running🚀!..." });
});

// Globel Error Handling
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}🚀!...`);
});
