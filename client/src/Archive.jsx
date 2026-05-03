import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Archive() {
  const [savedSongs, setSavedSongs] = useState([]);
  const [activeInputId, setActiveInputId] = useState(null);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const fetchArchive = async () => {
      const response = await fetch("http://localhost:5000/api/archive");
      const data = await response.json();
      setSavedSongs(data);
    };
    fetchArchive();
  }, []);

  const handleAddTag = async (videoId) => {
    if (!newTag.trim()) return;
    const response = await fetch(
      `http://localhost:5000/api/archive/${videoId}/tags`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: newTag.trim() }),
      },
    );
    if (response.ok) {
      const updatedSong = await response.json();
      setSavedSongs(
        savedSongs.map((song) =>
          song.videoId === videoId ? updatedSong : song,
        ),
      );
      setNewTag("");
      setActiveInputId(null);
    }
  };

  const handleRemoveTag = async (videoId, tagToRemove) => {
    // Optional: Ask for confirmation before deleting
    if (
      !window.confirm(
        `Are you sure you want to remove the tag "${tagToRemove}"?`,
      )
    )
      return;

    const response = await fetch(
      `http://localhost:5000/api/archive/${videoId}/tags/${encodeURIComponent(tagToRemove)}`,
      {
        method: "DELETE",
      },
    );

    if (response.ok) {
      const updatedSong = await response.json();

      // Update the UI immediately
      setSavedSongs(
        savedSongs.map((song) =>
          song.videoId === videoId ? updatedSong : song,
        ),
      );
    }
  };

  return (
    <div className="Archive">
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>AudioArchive</h1>
        <Link to="/">Back to Search</Link>
      </nav>

      <h2>My Saved Songs</h2>

      <div className="archive-list">
        {savedSongs.map((song) => (
          <div key={song.videoId} className="archive-row">
            {/*left side*/}
            <div className="song-info">
              <img src={song.thumbnail} alt={song.title} />
              <div>
                <h3 dangerouslySetInnerHTML={{ __html: song.title }}></h3>
                <p>{song.channelTitle}</p>
              </div>
            </div>
            {/*right side*/}
            <div className="tag-section">
              <div className="tags-display">
                {song.tags && song.tags.length > 0 ? (
                  song.tags.map((tag, index) => (
                    <span key={index} className="tag-chip">
                      {tag}
                      {/* ADD THE onClick HERE */}
                      <span
                        className="remove-tag-btn"
                        onClick={() => handleRemoveTag(song.videoId, tag)}
                      >
                        ×
                      </span>
                    </span>
                  ))
                ) : (
                  <span className="no-tags">No tags</span>
                )}
              </div>
              {activeInputId === song.videoId ? (
                <div className="tag-input-box">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="e.g. Rhythm, Cover"
                    autoFocus
                  />
                  <button onClick={() => handleAddTag(song.videoId)}>
                    Save
                  </button>
                  <button onClick={() => setActiveInputId(null)}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => setActiveInputId(song.videoId)}>
                  + Add Tag
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Archive;
