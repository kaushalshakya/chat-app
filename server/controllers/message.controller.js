const Message = require("../models/message.model");
const catchAsync = require("../helpers/catchAsync.helper");
const AppError = require("../helpers/appError.helper");
const { client } = require("../helpers/redis.helper");

exports.getMessage = catchAsync(async (req, res, next) => {
  const { id } = req.query;
  const key = `messages:${req.user.id}-${id}`;
  const cache = await client.get(key);

  if (cache) return res.status(200).json(JSON.parse(cache));

  const messages = await Message.find({
    $or: [
      { sender: id, receiver: req.user.id },
      { sender: req.user.id, receiver: id },
    ],
  }).populate("sender receiver");

  client.setEx(key, 30, JSON.stringify(messages));

  return res.status(200).json(messages);
});
