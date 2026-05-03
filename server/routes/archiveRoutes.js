const express = require("express");
const router = express.Router();

// Import the logic from controller
const {
  archiveSong,
  getArchive,
  addTag,
  removeTag,
  deleteSong
} = require("../controllers/archiveController");

router.post("/", archiveSong);
router.get("/", getArchive);
router.put("/:videoId/tags", addTag);
router.delete("/:videoId/tags/:tag", removeTag);
router.delete("/:videoId", deleteSong);

module.exports = router;