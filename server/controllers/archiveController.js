const Song = require("../models/Song");

// Create a new song
const archiveSong = async (req, res) => {
  try {
    const { videoId, title, thumbnail, channelTitle } = req.body;
    const newSong = new Song({
      videoId,
      title,
      thumbnail,
      channelTitle,
      tags: [],
    });
    await newSong.save();
    res.status(201).json({ message: "Song archived successfully!" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send("This song is already in your archive!");
    } else {
      console.error(error);
      res.status(500).send("Failed to archive song");
    }
  }
};

// Get all songs
const getArchive = async (req, res) => {
  try {
    const archivedSongs = await Song.find().sort({ dateAdded: -1 });
    res.json(archivedSongs);
  } catch (error) {
    console.error("Error fetching archive:", error);
    res.status(500).send("Failed to load archive");
  }
};

// Add a tag
const addTag = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { tag } = req.body;
    const updatedSong = await Song.findOneAndUpdate(
      { videoId: videoId },
      { $push: { tags: tag } },
      { new: true }
    );
    res.json(updatedSong);
  } catch (error) {
    console.error("Error adding tag:", error);
    res.status(500).send("Failed to add tag");
  }
};

// Remove a tag
const removeTag = async (req, res) => {
  try {
    const { videoId, tag } = req.params;
    const updatedSong = await Song.findOneAndUpdate(
      { videoId: videoId },
      { $pull: { tags: tag } },
      { new: true }
    );
    res.json(updatedSong);
  } catch (error) {
    console.error("Error removing tag:", error);
    res.status(500).send("Failed to remove tag");
  }
};

// Delete a song
const deleteSong = async (req, res) => {
  try {
    const { videoId } = req.params;
    const deletedSong = await Song.findOneAndDelete({ videoId: videoId });
    if (!deletedSong) {
      return res.status(404).send("Song not found");
    }
    res.status(200).json({ message: "Song removed successfully" });
  } catch (error) {
    console.error("Error deleting song:", error);
    res.status(500).send("Failed to delete song");
  }
};

// Export all functions so the Router can use them
module.exports = {
  archiveSong,
  getArchive,
  addTag,
  removeTag,
  deleteSong
};