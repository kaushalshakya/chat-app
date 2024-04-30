const express = require("express");
const app = express();
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/errorHandler.middleware");
require("dotenv").config();
const { userRouter, messageRouter } = require("./routes/index.routes");
const auth = require("./middlewares/auth.middleware");
const server = require("http").createServer(app);
const initializeSocket = require("./helpers/socket.helper");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

initializeSocket(server);

app.use("/user", userRouter);
app.use("/messages", auth, messageRouter);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI_STRING)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

server.listen(5000, () => console.log("Server"));
