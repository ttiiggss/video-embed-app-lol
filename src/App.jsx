<<<<<<< HEAD
import { useState } from 'react'

function App() {
  const [imdbQuery, setImdbQuery] = useState('')
  const [imdbType, setImdbType] = useState('movie') // 'movie' or 'tv'
  const [embedUrl, setEmbedUrl] = useState('')
  const [error, setError] = useState('')

  const VIDSRC_BASE = 'https://vidsrc.xyz'



  const handleImdbSearch = (e) => {
    e.preventDefault()
    if (!imdbQuery.trim()) {
      setError('Please enter an IMDB ID (e.g., tt0944947)')
      return
    }

    setError('')
    
    const imdbId = imdbQuery.trim()
    
    // Validate IMDB ID format
    if (!imdbId.startsWith('tt') || imdbId.length < 4) {
      setError('Please enter a valid IMDB ID starting with "tt" (e.g., tt0944947)')
      return
    }
    
    // Create embed URL based on selected type
    let embedUrl = ''
    if (imdbType === 'movie') {
      embedUrl = `${VIDSRC_BASE}/embed/movie?imdb=${imdbId}`
    } else {
      embedUrl = `${VIDSRC_BASE}/embed/tv?imdb=${imdbId}`
    }
    
    console.log(`IMDB Search - ${imdbType} URL:`, embedUrl)
    setEmbedUrl(embedUrl)
  }

  return (
    <div className="App">
      <h1>🎬 Video Embed App</h1>
      <p>Search by IMDB ID using <a href="https://vidsrc.me/api/" target="_blank" rel="noopener noreferrer">Vidsrc API</a></p>
      
      <div className="nav-container">
        <form onSubmit={handleImdbSearch} className="search-form">
          <select 
            value={imdbType} 
            onChange={(e) => setImdbType(e.target.value)}
            className="episode-select"
          >
            <option value="movie">Movie</option>
            <option value="tv">TV Show</option>
          </select>
          <input
            type="text"
            value={imdbQuery}
            onChange={(e) => setImdbQuery(e.target.value)}
            placeholder="Enter IMDB ID (e.g., tt0944947)"
            className="search-input"
          />
          <button type="submit" className="search-button">
            🎬 Embed Video
          </button>
        </form>
      </div>

      {error && <div className="error">{error}</div>}

      {embedUrl && (
        <div>
          <div className="info-box">
            <strong>Now Playing:</strong> {embedUrl}
          </div>
          <div className="video-container">
            <iframe
              src={embedUrl}
              className="video-iframe"
              allowFullScreen
              title="Video Player"
              referrerPolicy="origin"
            ></iframe>
          </div>
        </div>
      )}

      {!embedUrl && (
        <div className="info-box">
          <h3>🔍 IMDB Search</h3>
          <p>Enter an IMDB ID to directly embed content. Select Movie or TV Show first!</p>
          <p><strong>Movie Examples:</strong></p>
          <ul style={{textAlign: 'left', maxWidth: '500px', margin: '0 auto'}}>
            <li><code>tt0111161</code> - The Shawshank Redemption</li>
            <li><code>tt0068646</code> - The Godfather</li>
            <li><code>tt0468569</code> - The Dark Knight</li>
            <li><code>tt0167260</code> - The Lord of the Rings: The Return of the King</li>
          </ul>
          <p><strong>TV Show Examples:</strong></p>
          <ul style={{textAlign: 'left', maxWidth: '500px', margin: '0 auto'}}>
            <li><code>tt0944947</code> - Game of Thrones</li>
            <li><code>tt0903747</code> - Breaking Bad</li>
            <li><code>tt2560140</code> - Attack on Titan</li>
            <li><code>tt0386676</code> - The Office</li>
          </ul>
        </div>
      )}
      
      <footer style={{marginTop: '4rem', padding: '2rem', textAlign: 'center', color: '#888', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
        ⚡tigs@coinos.io
      </footer>
      
      <div style={{textAlign: 'center', padding: '1rem', fontSize: '0.9rem', color: '#666', fontStyle: 'italic'}}>
        This page does not host ANYTHING. It merely redirects.
      </div>
    </div>
  )
}

=======
import { useState } from 'react'

function App() {
  const [imdbQuery, setImdbQuery] = useState('')
  const [imdbType, setImdbType] = useState('movie') // 'movie' or 'tv'
  const [embedUrl, setEmbedUrl] = useState('')
  const [error, setError] = useState('')

  const VIDSRC_BASE = 'https://vidsrc.xyz'



  const handleImdbSearch = (e) => {
    e.preventDefault()
    if (!imdbQuery.trim()) {
      setError('Please enter an IMDB ID (e.g., tt0944947)')
      return
    }

    setError('')
    
    const imdbId = imdbQuery.trim()
    
    // Validate IMDB ID format
    if (!imdbId.startsWith('tt') || imdbId.length < 4) {
      setError('Please enter a valid IMDB ID starting with "tt" (e.g., tt0944947)')
      return
    }
    
    // Create embed URL based on selected type
    let embedUrl = ''
    if (imdbType === 'movie') {
      embedUrl = `${VIDSRC_BASE}/embed/movie?imdb=${imdbId}`
    } else {
      embedUrl = `${VIDSRC_BASE}/embed/tv?imdb=${imdbId}`
    }
    
    console.log(`IMDB Search - ${imdbType} URL:`, embedUrl)
    setEmbedUrl(embedUrl)
  }

  return (
    <div className="App">
      <h1>🎬 CornyFlicks - Watch what *you* want</h1>
      <p>Search by IMDB ID using <a href="https://vidsrc.me/api/" target="_blank" rel="noopener noreferrer">Vidsrc API</a></p>
      
      <div className="nav-container">
        <form onSubmit={handleImdbSearch} className="search-form">
          <select 
            value={imdbType} 
            onChange={(e) => setImdbType(e.target.value)}
            className="episode-select"
          >
            <option value="movie">Movie</option>
            <option value="tv">TV Show</option>
          </select>
          <input
            type="text"
            value={imdbQuery}
            onChange={(e) => setImdbQuery(e.target.value)}
            placeholder="Enter IMDB ID (e.g., tt0944947)"
            className="search-input"
          />
          <button type="submit" className="search-button">
            🎬 Embed Video
          </button>
        </form>
      </div>

      {error && <div className="error">{error}</div>}

      {embedUrl && (
        <div>
          <div className="info-box">
            <strong>Now Playing:</strong> {embedUrl}
          </div>
          <div className="video-container">
            <iframe
              src={embedUrl}
              className="video-iframe"
              allowFullScreen
              title="Video Player"
              referrerPolicy="origin"
            ></iframe>
          </div>
        </div>
      )}

      {!embedUrl && (
        <div className="info-box">
          <h3>🔍 IMDB Search</h3>
          <p>Enter an IMDB ID to directly embed content. Select Movie or TV Show first!</p>
          <p><strong>Movie Examples:</strong></p>
          <ul style={{textAlign: 'left', maxWidth: '500px', margin: '0 auto'}}>
            <li><code>tt0111161</code> - The Shawshank Redemption</li>
            <li><code>tt0068646</code> - The Godfather</li>
            <li><code>tt0468569</code> - The Dark Knight</li>
            <li><code>tt0167260</code> - The Lord of the Rings: The Return of the King</li>
          </ul>
          <p><strong>TV Show Examples:</strong></p>
          <ul style={{textAlign: 'left', maxWidth: '500px', margin: '0 auto'}}>
            <li><code>tt0944947</code> - Game of Thrones</li>
            <li><code>tt0903747</code> - Breaking Bad</li>
            <li><code>tt2560140</code> - Attack on Titan</li>
            <li><code>tt0386676</code> - The Office</li>
          </ul>
        </div>
      )}
      
      <footer style={{marginTop: '4rem', padding: '2rem', textAlign: 'center', color: '#888', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
        ⚡WoSTR@coinos.io
      </footer>
      
      <div style={{textAlign: 'center', padding: '1rem', fontSize: '0.9rem', color: '#666', fontStyle: 'italic'}}>
        This page does not host ANYTHING. It merely redirects.
      </div>
    </div>
  )
}

>>>>>>> fd93281 (vidsourcing)
export default App 