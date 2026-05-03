require("dotenv").config();
const Song = require("./Song");
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("AudioArchive Server is running!");
});

// Test page
app.get("/test-youtube", async (req, res) => {
  try {
    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY
    });
    const response = await youtube.search.list({
      part: 'snippet',
      q: 'Darude Sandstorm', 
      maxResults: 1
    });
    res.json(response.data);
  } catch (error) {
    console.error("YouTube API Error:", error);
    res.status(500).send("Error connecting to YouTube");
  }
});

// Search function
app.get("/api/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).send("Search query is required");
    }
    const youtube = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_API_KEY,
    });
    const response = await youtube.search.list({
      part: "snippet",
      q: query,
      type: "video",
      videoCategoryId: "10",
      maxResults: 10,
    });
    res.json(response.data.items);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).send("Search failed");
  }
});

// Song archive function
app.post("/api/archive", async (req, res) => {
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
});

// Get archived songs
app.get("/api/archive", async (req, res) => {
  try {
    const archivedSongs = await Song.find().sort({ dateAdded: -1 });
    res.json(archivedSongs);
  } catch (error) {
    console.error("Error fetching archive:", error);
    res.status(500).send("Failed to load archive");
  }
});

// Update song tags
app.put("/api/archive/:videoId/tags", async (req, res) => {
  try {
    const { videoId } = req.params;
    const { tag } = req.body;
    const updatedSong = await Song.findOneAndUpdate(
      { videoId: videoId },
      { $push: { tags: tag } },
      { new: true },
    );
    res.json(updatedSong);
  } catch (error) {
    console.error("Error adding tag:", error);
    res.status(500).send("Failed to add tag");
  }
});

// Remove a tag from a specific archived song
app.delete("/api/archive/:videoId/tags/:tag", async (req, res) => {
  try {
    const { videoId, tag } = req.params;
    const updatedSong = await Song.findOneAndUpdate(
      { videoId: videoId },
      { $pull: { tags: tag } },
      { new: true },
    );
    res.json(updatedSong);
  } catch (error) {
    console.error("Error removing tag:", error);
    res.status(500).send("Failed to remove tag");
  }
});

// Delete an entire song from the archive
app.delete("/api/archive/:videoId", async (req, res) => {
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
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to the AudioArchive Database!"))
  .catch((err) => console.error("Database connection error:", err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is humming along on http://localhost:${PORT}`);
});
