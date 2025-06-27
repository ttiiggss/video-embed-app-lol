import { useState, useEffect } from 'react'

function App() {
  const [imdbQuery, setImdbQuery] = useState('')
  const [titleQuery, setTitleQuery] = useState('')
  const [imdbType, setImdbType] = useState('movie') // 'movie' or 'tv'
  const [season, setSeason] = useState(1)
  const [episode, setEpisode] = useState(1)
  const [embedUrl, setEmbedUrl] = useState('')
  const [error, setError] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchMode, setSearchMode] = useState('imdb') // 'imdb' or 'title'
  const [backgroundImage, setBackgroundImage] = useState('')
  const [isHighResBackground, setIsHighResBackground] = useState(false)

  const VIDSRC_BASE = 'https://vidsrc.xyz'
  const CORS_PROXY = 'https://api.allorigins.win/raw?url='

  // Function to convert image to data URL for CORS-free usage
  const imageToDataUrl = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
          resolve({
            dataUrl,
            width: img.width,
            height: img.height,
            isHighRes: img.width >= 1024 && img.height >= 1024
          })
        } catch (err) {
          resolve(null)
        }
      }
      img.onerror = () => resolve(null)
      img.src = CORS_PROXY + encodeURIComponent(imageUrl)
    })
  }

  // Function to try getting higher resolution versions of poster URLs
  const enhancePosterUrl = (originalUrl) => {
    if (!originalUrl || originalUrl === 'N/A') return []
    
    // Try to enhance OMDb poster URLs to get higher resolution versions
    const urls = [
      // Try common high-res patterns first
      originalUrl.replace(/\._V1_.*\.jpg/, '._V1_QL100_UX2000_.jpg'),
      originalUrl.replace(/\._V1_.*\.jpg/, '._V1_SX2000.jpg'),
      originalUrl.replace(/\._V1_.*\.jpg/, '._V1_UX2000_CR0,0,2000,3000_AL_.jpg'),
      // Try removing size constraints
      originalUrl.replace(/SX\d+/, 'SX2000').replace(/SY\d+/, 'SY2000'),
      // Original URL as fallback
      originalUrl,
    ]
    
    return urls
  }

  // Function to find and set background image with appropriate scaling
  const setBackgroundWithScaling = async (posterUrl) => {
    if (!posterUrl || posterUrl === 'N/A') return

    const urlVariants = enhancePosterUrl(posterUrl)
    
    // Try each URL variant until we find one that works
    for (const url of urlVariants) {
      try {
        console.log(`Trying to load: ${url}`)
        const result = await imageToDataUrl(url)
        if (result) {
          console.log(`Successfully loaded: ${url} (${result.width}x${result.height})`)
          setBackgroundImage(result.dataUrl)
          setIsHighResBackground(result.isHighRes)
          return
        }
      } catch (err) {
        console.log(`Failed to load: ${url}`)
      }
    }
    
    console.log('No usable poster found')
  }

  // Function to get poster for direct IMDB ID searches
  const fetchPosterByImdbId = async (imdbId) => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=trilogy`)
      const data = await response.json()
      
      if (data.Response === 'True' && data.Poster && data.Poster !== 'N/A') {
        await setBackgroundWithScaling(data.Poster)
      }
    } catch (err) {
      console.log('Failed to fetch poster for background')
    }
  }

  const searchByTitle = async (e) => {
    e.preventDefault()
    if (!titleQuery.trim()) {
      setError('Please enter a movie or TV show title')
      return
    }

    setLoading(true)
    setError('')
    setSearchResults([])

    try {
      // Using OMDb API (free) to search for titles
      const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(titleQuery)}&type=${imdbType}&apikey=trilogy`)
      const data = await response.json()

      if (data.Response === 'True') {
        const results = data.Search.slice(0, 10) // Limit to 10 results
        setSearchResults(results)
        
        // Try to find a good poster from search results
        const postersAvailable = results.filter(movie => movie.Poster && movie.Poster !== 'N/A')
        
        if (postersAvailable.length > 0) {
          // Use the first available poster
          await setBackgroundWithScaling(postersAvailable[0].Poster)
        }
      } else {
        setError(data.Error || 'No results found')
      }
    } catch (err) {
      setError('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectMovie = async (movie) => {
    setImdbQuery(movie.imdbID)
    setSearchResults([])
    setSearchMode('imdb')
    // Set selected movie poster as background with appropriate scaling
    if (movie.Poster && movie.Poster !== 'N/A') {
      await setBackgroundWithScaling(movie.Poster)
    }
  }

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
    
    // Fetch poster for background with appropriate scaling
    fetchPosterByImdbId(imdbId)
    
    // Create embed URL based on selected type
    let embedUrl = ''
    if (imdbType === 'movie') {
      embedUrl = `${VIDSRC_BASE}/embed/movie?imdb=${imdbId}`
    } else {
      // Use 'tv' for vidsrc regardless of whether imdbType is 'series' or 'tv'
      embedUrl = `${VIDSRC_BASE}/embed/tv?imdb=${imdbId}&s=${season}&e=${episode}`
    }
    
    console.log(`IMDB Search - ${imdbType} URL:`, embedUrl)
    setEmbedUrl(embedUrl)
  }

  return (
    <div className="App" style={{
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      backgroundSize: isHighResBackground ? 'cover' : 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      {/* Background overlay for better readability */}
      <div className="background-overlay"></div>
      
      <div className="content-wrapper">
        <h1>🎬 Vidsrc Corny Flicks</h1>
        <p>Search by title or IMDB ID using <a href="https://vidsrc.xyz" target="_blank" rel="noopener noreferrer">Vidsrc API</a></p>
        
        <div className="nav-container">
          <div className="nav-buttons">
            <button 
              className={`nav-button ${searchMode === 'title' ? 'active' : ''}`}
              onClick={() => setSearchMode('title')}
            >
              🔍 Search by Title
            </button>
            <button 
              className={`nav-button ${searchMode === 'imdb' ? 'active' : ''}`}
              onClick={() => setSearchMode('imdb')}
            >
              🎯 Direct IMDB ID
            </button>
          </div>

          <select 
            value={imdbType} 
            onChange={(e) => setImdbType(e.target.value)}
            className="episode-select"
            style={{marginBottom: '1rem'}}
          >
            <option value="movie">Movie</option>
            <option value="series">TV Show</option>
          </select>

          {searchMode === 'title' ? (
            <form onSubmit={searchByTitle} className="search-form">
              <input
                type="text"
                value={titleQuery}
                onChange={(e) => setTitleQuery(e.target.value)}
                placeholder="Enter movie or TV show title"
                className="search-input"
              />
              <button type="submit" className="search-button" disabled={loading}>
                {loading ? '⏳ Searching...' : '🔍 Search'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleImdbSearch} className="search-form">
              {imdbType === 'series' && (
                <div className="episode-selectors">
                  <label>
                    Season:
                    <input
                      type="number"
                      value={season}
                      onChange={(e) => setSeason(parseInt(e.target.value) || 1)}
                      min="1"
                      className="episode-select"
                      style={{width: '80px', marginLeft: '0.5rem'}}
                    />
                  </label>
                  <label>
                    Episode:
                    <input
                      type="number"
                      value={episode}
                      onChange={(e) => setEpisode(parseInt(e.target.value) || 1)}
                      min="1"
                      className="episode-select"
                      style={{width: '80px', marginLeft: '0.5rem'}}
                    />
                  </label>
                </div>
              )}
              
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
          )}
        </div>

        {error && <div className="error">{error}</div>}

        {searchResults.length > 0 && (
          <div className="results-container">
            {searchResults.map((movie) => (
              <div 
                key={movie.imdbID} 
                className="result-item"
                onClick={() => selectMovie(movie)}
              >
                <img 
                  src={movie.Poster !== 'N/A' ? movie.Poster : '/api/placeholder/150/200'} 
                  alt={movie.Title}
                  className="result-poster"
                />
                <h3 className="result-title">{movie.Title}</h3>
                <p className="result-year">{movie.Year}</p>
                <p className="result-id">{movie.imdbID}</p>
              </div>
            ))}
          </div>
        )}

        {embedUrl && (
          <div>
            <div className="info-box">
              <strong>Now Playing:</strong> {imdbType === 'series' ? `Season ${season}, Episode ${episode}` : 'Movie'} - {imdbQuery}
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

        {!embedUrl && searchResults.length === 0 && (
          <div className="info-box">
            <h3>🔍 How to Use</h3>
            <p><strong>Method 1:</strong> Search by title to find movies/shows easily</p>
            <p><strong>Method 2:</strong> Enter IMDB ID directly if you know it</p>
            <p><strong>🎯 Smart Scaling:</strong> High-res images fill screen, low-res images zoom out to fit</p>
            
            <p><strong>Popular Movie IMDB IDs:</strong></p>
            <ul style={{textAlign: 'left', maxWidth: '500px', margin: '0 auto'}}>
              <li><code>tt0111161</code> - The Shawshank Redemption</li>
              <li><code>tt0068646</code> - The Godfather</li>
              <li><code>tt0468569</code> - The Dark Knight</li>
              <li><code>tt0167260</code> - The Lord of the Rings: The Return of the King</li>
            </ul>
            <p><strong>Popular TV Show IMDB IDs:</strong></p>
            <ul style={{textAlign: 'left', maxWidth: '500px', margin: '0 auto'}}>
              <li><code>tt0944947</code> - Game of Thrones</li>
              <li><code>tt0903747</code> - Breaking Bad</li>
              <li><code>tt2560140</code> - Attack on Titan</li>
              <li><code>tt0386676</code> - The Office</li>
            </ul>
          </div>
        )}
        
        <footer style={{marginTop: '4rem', padding: '2rem', textAlign: 'center', color: '#888', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
          ⚡- WoSTR@coinos.io
          <br />
          bc1qdsz7h8ktn6zfu8el07jehul654x55l5j7ymqxk
        </footer>
        
        <div style={{textAlign: 'center', padding: '1rem', fontSize: '0.9rem', color: '#666', fontStyle: 'italic'}}>
          This page does not host any content. It merely provides embeds.
        </div>
      </div>
    </div>
  )
}

export default App

