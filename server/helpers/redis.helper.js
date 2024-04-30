const { createClient } = require("redis");

const client = createClient();
const publisher = createClient();
const subscriber = createClient();
const messageSubscriber = createClient();

client.connect().catch((err) => console.log(err));
publisher
  .connect()
  .then(() => console.log("Publisher connected"))
  .catch((err) => console.log(err));
subscriber
  .connect()
  .then(() => console.log("Subscriber connected"))
  .catch((err) => console.log(err));
messageSubscriber
  .connect()
  .then(() => console.log("Message Subscriber connected"))
  .catch((err) => console.log(err));

module.exports = { client, publisher, subscriber, messageSubscriber };
