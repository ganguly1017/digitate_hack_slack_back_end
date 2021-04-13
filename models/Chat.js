const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const Chat = new Schema({
  message: {
    type: String,
    required: true
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'teams'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  createdAt: {
    type: String,
    default: moment().format("DD/MM/YYYY") + ";" + moment().format("hh:mm:ss")
  }
});

// Create Chat model
mongoose.model("chats", Chat)

// export Chat model
module.exports = mongoose.model("chats");