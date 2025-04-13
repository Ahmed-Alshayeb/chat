import messageModel from "../../../DB/models/message.model.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { getReceiverSocketId, io } from "../../services/socket.service.js";

// @desc    Send message
// @route   POST /api/message?receiverId=receiverId
export const sendMsg = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  const { receiverId } = req.query;
  const senderId = req.user._id;

  let secureUrl = "";
  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      folder: `chat-app/messages`,
    });
    secureUrl = secure_url;
  }

  const msg = await messageModel.create({
    senderId,
    receiverId,
    text,
    image: secureUrl,
  });

  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMsg", msg);
    console.log("msg", msg);
  }

  res.status(200).json({
    status: "success",
    data: {
      msg,
    },
  });
});
