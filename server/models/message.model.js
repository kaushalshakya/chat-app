const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      require: true,
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      require: true,
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("message", messageSchema);

module.exports = Message;
