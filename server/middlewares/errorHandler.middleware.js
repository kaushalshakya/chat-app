const AppError = require("../helpers/appError.helper");
require("dotenv").config();

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
  });
};

const errorHandler = (err, req, res, next) => {
  console.log(err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  sendErrorDev(err, res);
  next();
};

module.exports = errorHandler;
