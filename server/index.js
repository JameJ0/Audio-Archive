require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const mongoose = require("mongoose");
const archiveRoutes = require("./routes/archiveRoutes");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Main entry point
app.get("/", (req, res) => {
  res.send("AudioArchive Server is running!");
});

// Search function using Youtube API
app.get("/api/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).send("Search query is required");

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

// Send network requests to archiveRoutes
app.use("/api/archive", archiveRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to the AudioArchive Database!"))
  .catch((err) => console.error("Database connection error:", err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is humming along on http://localhost:${PORT}`);
});