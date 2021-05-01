const Chats = require("../models/chats");

const newMessage = async (user, message) => {
  try {
    // const { id, name, room } = user;
    const payload = {
      user,
      message,
    };
    const newMessage = await Chats.create(payload);
    console.log(newMessage)
    return;
  } catch (error) {
    console.log(error);
  }
};

const showMessages = async (room) => {
  const messages = await Chats.find({ room });

  return messages;
};

module.exports = { newMessage, showMessages };
