const mongoose = require("mongoose");

// Schema for the Song object to store in the database
const songSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: String,
  thumbnail: String,
  channelTitle: String,
  tags: [String],
  dateAdded: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Song", songSchema);
