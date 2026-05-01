require('dotenv').config();
const express = require("express");
const { google } = require('googleapis'); 

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("AudioArchive Server is running!");
});


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

app.listen(PORT, () => {
  console.log(`Server is humming along on http://localhost:${PORT}`);
});