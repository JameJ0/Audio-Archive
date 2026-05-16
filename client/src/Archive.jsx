import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Archive.css";

function Archive() {
  const [savedSongs, setSavedSongs] = useState([]);
  const [activeInputId, setActiveInputId] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [filterText, setFilterText] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  // On component mount, fetch the user's saved songs from the backend API and store them in state.
  useEffect(() => {
    const fetchArchive = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}`);
      const data = await response.json();
      setSavedSongs(data);
    };
    fetchArchive();
  }, []);

  // Handler for adding a tag to a specific song
  const handleAddTag = async (videoId, tagToSave = newTag) => {
    if (!tagToSave.trim()) return;
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/archive/${videoId}/tags`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: tagToSave.trim() }),
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

  // Handler for removing a tag from a song
  const handleRemoveTag = async (videoId, tagToRemove) => {
    if (
      !window.confirm(
        `Are you sure you want to remove the tag "${tagToRemove}"?`,
      )
    )
      return;
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/archive/${videoId}/tags/${encodeURIComponent(tagToRemove)}`,
      {
        method: "DELETE",
      },
    );
    if (response.ok) {
      const updatedSong = await response.json();
      setSavedSongs(
        savedSongs.map((song) =>
          song.videoId === videoId ? updatedSong : song,
        ),
      );
    }
  };

  // Handler for removing a song from the archive
  const handleRemoveSong = async (videoId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this song from your archive?",
      )
    )
      return;

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/archive/${videoId}`,
      {
        method: "DELETE",
      },
    );
    if (response.ok) {
      setSavedSongs(savedSongs.filter((song) => song.videoId !== videoId));
      setActiveInputId(null);
    }
  };

  // If the filter bar is empty, show all songs.
  // Otherwise, only show songs that have a tag matching the typed text.
  const displayedSongs = savedSongs.filter((song) => {
    if (filterText.trim() === "") return true;
    const matchesTag =
      song.tags &&
      song.tags.some((tag) =>
        tag.toLowerCase().includes(filterText.toLowerCase()),
      );
    return matchesTag;
  });

  // Get all unique tags from the saved songs
  const allUniqueTags = [
    ...new Set(savedSongs.flatMap((song) => song.tags || [])),
  ];

  // Render the component
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

      {/* YouTube Embedded Player (Theater Mode) */}
      {selectedVideoId && (
        <div className="video-player-container">
          <button
            className="close-player"
            onClick={() => setSelectedVideoId(null)}
          >
            x Close Player
          </button>
          <iframe
            width="100%"
            height="450"
            src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* Search songs by tags */}
      <div className="archive-controls">
        <input
          type="text"
          list="tag-suggestions"
          className="filter-bar"
          placeholder="Filter by tags (e.g. Rhythm)..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <datalist id="tag-suggestions">
          {allUniqueTags.map((tag, index) => (
            <option key={index} value={tag} />
          ))}
        </datalist>
      </div>

      {/* Songs list */}
      <div className="archive-list">
        {displayedSongs.map((song) => (
          <div key={song.videoId} className="archive-row">

            {/* Left Side: Song Information */}
            <div className="song-info">

              {/* Clicking the video thumbnail sets the ID and scrolls to top */}
              <img
                src={song.thumbnail}
                alt={song.title}
                onClick={() => {
                  setSelectedVideoId(song.videoId);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                style={{ cursor: "pointer" }}
              />

              <div className="song-details">
                <h3
                  dangerouslySetInnerHTML={{ __html: song.title }}
                  onClick={() => {
                    setSelectedVideoId(song.videoId);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  style={{ cursor: "pointer" }}
                ></h3>
                <p>{song.channelTitle}</p>
                <button
                  className="remove-song-btn"
                  onClick={() => handleRemoveSong(song.videoId)}
                >
                  Delete Track
                </button>
              </div>
            </div>

            {/* Right side: tags */}
            <div className="tag-section">
              <div className="tags-display">
                {song.tags && song.tags.length > 0 ? (
                  song.tags.map((tag, index) => (
                    <span key={index} className="tag-chip">
                      {tag}
                      <span
                        className="remove-tag-btn"
                        onClick={() => handleRemoveTag(song.videoId, tag)}
                      >
                        x
                      </span>
                    </span>
                  ))
                ) : (
                  <span className="no-tags">No tags</span>
                )}
              </div>

              {/* Toggle between the "+ Add Tag" button and the input field */}
              {activeInputId === song.videoId ? (
                <div className="tag-input-container">
                  <div className="tag-input-box">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="e.g. Rhythm, Cover"
                      autoFocus
                    />
                    <button onClick={() => handleAddTag(song.videoId, newTag)}>
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setActiveInputId(null);
                        setNewTag("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Shows the row of existing tags */}
                  {allUniqueTags.length > 0 && (
                    <div className="suggested-tags-cloud">
                      <span className="suggested-label">Suggested:</span>
                      {allUniqueTags
                        .filter((tag) => !(song.tags || []).includes(tag))
                        .map((tag, index) => (
                          <span
                            key={index}
                            className="suggested-tag-chip"
                            onClick={() => handleAddTag(song.videoId, tag)}
                          >
                            + {tag}
                          </span>
                        ))}
                    </div>
                  )}
                  
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
