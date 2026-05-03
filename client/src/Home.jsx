import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const handleSearch = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `http://localhost:5000/api/search?query=${query}`,
    );
    const data = await response.json();
    setResults(data);
  };

  const archiveSong = async (song) => {
    const response = await fetch("http://localhost:5000/api/archive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoId: song.id.videoId,
        title: song.snippet.title,
        thumbnail: song.snippet.thumbnails.medium.url,
        channelTitle: song.snippet.channelTitle,
      }),
    });
    if (response.ok) {
      alert("Song added to your AudioArchive!");
    } else {
      alert("Could not archive song (it might already be there).");
    }
  };

  return (
    <div className="Home">
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>AudioArchive</h1>
        <Link to="/archive">View Archive</Link>
      </nav>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a song..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="results-grid">
        {results.map((song) => (
          <div key={song.id.videoId} className="song-card">
            <img
              src={song.snippet.thumbnails.medium.url}
              alt={song.snippet.title}
            />
            <h3 dangerouslySetInnerHTML={{ __html: song.snippet.title }}></h3>
            <p>{song.snippet.channelTitle}</p>
            <button onClick={() => archiveSong(song)}>+ Tag Song</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
