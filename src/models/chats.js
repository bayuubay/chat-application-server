const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  user: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },

    room: {
      type: String,
    },
  },

  message: {
    type: String,
  },
});

module.exports = mongoose.model("chats", ChatSchema);
