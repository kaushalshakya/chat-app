const {
  subscriber,
  publisher,
  client,
  messageSubscriber,
} = require("./redis.helper");
const User = require("../models/user.models");

subscriber
  .pSubscribe("users:*", async (message) => {
    console.log("message: " + message);
    await client.del("users");
    const users = await User.find();
    client.setEx("users", 120, JSON.stringify(users));
  })
  .catch((err) => console.log(err));

messageSubscriber
  .pSubscribe("messages:*", async (key) => {
    await client.del(key);
  })
  .catch((err) => console.log(err));

const invalidateUsers = async (message) => {
  const users = await client.get("users");
  if (users) {
    publisher.publish("users:register", message);
    console.log("Cache invalidated");
  }
};

const invaildateMessages = async (key) => {
  const messages = await client.get(key);
  if (messages) {
    publisher.publish(key, key);
  }
};

module.exports = { invalidateUsers, invaildateMessages };
