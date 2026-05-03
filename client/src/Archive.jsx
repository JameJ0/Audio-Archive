import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Archive() {
  const [savedSongs, setSavedSongs] = useState([]);
  useEffect(() => {
    const fetchArchive = async () => {
      const response = await fetch('http://localhost:5000/api/archive');
      const data = await response.json();
      setSavedSongs(data);
    };
    fetchArchive();
  }, []);

  return (
    <div className="Archive">
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>AudioArchive</h1>
        <Link to="/">Back to Search</Link>
      </nav>
      <h2>My Saved Songs</h2>
      <div className="results-grid">
        {savedSongs.map((song) => (
          <div key={song.videoId} className="song-card">
            <img src={song.thumbnail} alt={song.title} />
            <h3 dangerouslySetInnerHTML={{ __html: song.title }}></h3>
            <p>{song.channelTitle}</p>
            {/*will build the tag system here later*/}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Archive;