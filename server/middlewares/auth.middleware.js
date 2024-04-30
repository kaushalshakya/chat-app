const jwt = require("jsonwebtoken");
const AppError = require("../helpers/appError.helper");
require("dotenv").config();

const auth = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!authHeader) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return next(new AppError("Unauthorized", 401));
    }

    req.user = decoded;
    next();
  });
};

module.exports = auth;
