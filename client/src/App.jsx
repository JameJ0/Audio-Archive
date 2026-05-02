import { useState } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = async (e) => {
    e.preventDefault()
    const response = await fetch(`http://localhost:5000/api/search?query=${query}`)
    const data = await response.json()
    setResults(data)
  }

  return (
    <div className="App">
      <h1>AudioArchive</h1>
      
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
            <img src={song.snippet.thumbnails.medium.url} alt={song.snippet.title} />
            <h3 dangerouslySetInnerHTML={{ __html: song.snippet.title }}></h3>
            <p>{song.snippet.channelTitle}</p>
            <button>+ Tag Song</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App