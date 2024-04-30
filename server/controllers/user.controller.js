const User = require("../models/user.models");
const catchAsync = require("../helpers/catchAsync.helper");
const AppError = require("../helpers/appError.helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { client } = require("../helpers/redis.helper");
const { invalidateUsers } = require("../helpers/cache.helper");
require("dotenv").config();

exports.register = catchAsync(async (req, res, next) => {
  const checkUser = await User.findOne({ username: req.body.username });

  if (checkUser) {
    return next(new AppError("User already exists", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new AppError("Password and confirm password do not match", 400)
    );
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  const user = await User.create({
    username: req.body.username,
    password: hash,
  });

  if (!user) {
    return next(new AppError("Error creating user", 500));
  }

  invalidateUsers("User registered");
  return res.status(200).json({
    message: "User registered",
    user,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError("All fields required", 400));
  }

  const checkUser = await User.findOne({ username });

  if (!checkUser) {
    return next(new AppError("User not found", 404));
  }

  if (!bcrypt.compareSync(password, checkUser.password)) {
    return next(new AppError("Invalid credentials", 400));
  }

  const accessToken = jwt.sign(
    { id: checkUser.id, username: checkUser.username },
    process.env.ACCESS_TOKEN
  );

  return res.status(200).json({
    message: "Logged in successfully",
    accessToken,
  });
});

exports.getUsers = catchAsync(async (req, res, next) => {
  const data = await client.get("users");
  if (data) return res.status(200).json(JSON.parse(data));

  const users = await User.find().sort({ _id: -1 });
  if (!users.length) {
    return next(new AppError("No users available", 404));
  }

  client.setEx("users", 120, JSON.stringify(users));

  return res.status(200).json(users);
});
