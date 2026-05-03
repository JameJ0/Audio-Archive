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

/*
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
*/

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

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to the AudioArchive Database!"))
  .catch((err) => console.error("Database connection error:", err));

app.listen(PORT, () => {
  console.log(`Server is humming along on http://localhost:${PORT}`);
});
