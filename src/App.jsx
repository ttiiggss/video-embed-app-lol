import { useState, useEffect } from 'react'
import { SimplePool, nip19, nip05, getEventHash } from 'nostr-tools'

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

  // Nostr state
  const [nostrUser, setNostrUser] = useState(null)
  const [userBookmarks, setUserBookmarks] = useState([])
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [bookmarkViewMode, setBookmarkViewMode] = useState('grid') // 'grid' or 'list'
  const [showDiscovery, setShowDiscovery] = useState(false)
  const [allUsersBookmarks, setAllUsersBookmarks] = useState([])
  const [discoverySearch, setDiscoverySearch] = useState('')
  const [nostrPool, setNostrPool] = useState(null)

  // Relay management state
  const [showRelayPage, setShowRelayPage] = useState(false)
  const [selectedRelays, setSelectedRelays] = useState(['wss://tigs.nostr1.com'])
  const [availableRelays, setAvailableRelays] = useState([])
  const [relayStatus, setRelayStatus] = useState({})
  const [loadingRelays, setLoadingRelays] = useState(false)

  const VIDSRC_BASE = 'https://vidsrc.xyz'
  const DEFAULT_RELAY = 'wss://tigs.nostr1.com'

  // Initialize Nostr pool with selected relays
  useEffect(() => {
    const pool = new SimplePool()
    setNostrPool(pool)
    return () => pool.close()
  }, [])

  // Load stored relay preferences or use default
  useEffect(() => {
    const storedRelays = localStorage.getItem('selected_relays')
    if (storedRelays) {
      setSelectedRelays(JSON.parse(storedRelays))
    }
  }, [])

  // Save relay preferences when changed
  useEffect(() => {
    localStorage.setItem('selected_relays', JSON.stringify(selectedRelays))
  }, [selectedRelays])

  // Fetch online relays from nostr.watch API
  const fetchOnlineRelays = async () => {
    setLoadingRelays(true)
    try {
      const response = await fetch('https://api.nostr.watch/v1/online')
      const onlineRelays = await response.json()
      
      // Shuffle the relays for random presentation
      const shuffledRelays = [...onlineRelays].sort(() => Math.random() - 0.5)
      
      // Create relay status object
      const status = {}
      shuffledRelays.forEach(relay => {
        status[relay] = {
          online: true,
          selected: selectedRelays.includes(relay)
        }
      })
      
      setAvailableRelays(shuffledRelays)
      setRelayStatus(status)
    } catch (err) {
      setError('Failed to fetch online relays: ' + err.message)
    } finally {
      setLoadingRelays(false)
    }
  }

  // Load online relays when relay page is opened
  useEffect(() => {
    if (showRelayPage && availableRelays.length === 0) {
      fetchOnlineRelays()
    }
  }, [showRelayPage])

  // Toggle relay selection (max 10)
  const toggleRelay = (relayUrl) => {
    if (selectedRelays.includes(relayUrl)) {
      // Don't allow removing the last relay
      if (selectedRelays.length <= 1) {
        setError('At least one relay must be selected')
        return
      }
      setSelectedRelays(prev => prev.filter(r => r !== relayUrl))
    } else {
      // Max 10 relays
      if (selectedRelays.length >= 10) {
        setError('Maximum 10 relays allowed')
        return
      }
      setSelectedRelays(prev => [...prev, relayUrl])
    }
    setError('')
  }

  // Reset to default relay
  const resetToDefault = () => {
    setSelectedRelays([DEFAULT_RELAY])
    setError('Reset to default relay: tigs.nostr1.com')
  }

  // Check for existing Nostr extension and auto-login
  useEffect(() => {
    if (window.nostr) {
      checkStoredUser()
    }
  }, [])

  // Load user bookmarks when user logs in
  useEffect(() => {
    if (nostrUser && nostrPool) {
      loadUserBookmarks()
    }
  }, [nostrUser, nostrPool])

  const checkStoredUser = async () => {
    const storedUser = localStorage.getItem('nostr_user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setNostrUser(user)
    }
  }

  // NIP-07 Browser Extension Authentication
  const connectNostr = async () => {
    if (!window.nostr) {
      setError('No Nostr browser extension found. Please install Alby, nos2x, gooti, flamingo, or similar.')
      return
    }

    try {
      const pubkey = await window.nostr.getPublicKey()
      const npub = nip19.npubEncode(pubkey)
      
      // Try to get profile info
      let profile = { name: npub.slice(0, 12) + '...', picture: null }
      
      const user = {
        pubkey,
        npub,
        profile
      }
      
      setNostrUser(user)
      localStorage.setItem('nostr_user', JSON.stringify(user))
      setError('')
    } catch (err) {
      setError('Failed to connect to Nostr extension: ' + err.message)
    }
  }

  const disconnectNostr = () => {
    setNostrUser(null)
    setUserBookmarks([])
    localStorage.removeItem('nostr_user')
  }

  // Bookmark Management (Kind 30001 - Categorized Bookmarks)
  const toggleBookmark = async (movie) => {
    if (!nostrUser || !window.nostr || !nostrPool) return

    const isBookmarked = userBookmarks.some(b => b.imdbID === movie.imdbID)
    
    if (isBookmarked) {
      // Remove bookmark
      await removeBookmark(movie.imdbID)
    } else {
      // Add bookmark (max 10)
      if (userBookmarks.length >= 10) {
        setError('Maximum 10 bookmarks allowed. Remove one first.')
        return
      }
      await addBookmark(movie)
    }
  }

  const addBookmark = async (movie) => {
    try {
      const bookmarkEvent = {
        kind: 30001,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ['d', movie.imdbID], // identifier
          ['title', movie.Title],
          ['year', movie.Year],
          ['type', movie.Type],
          ['poster', movie.Poster !== 'N/A' ? movie.Poster : ''],
          ['imdb', movie.imdbID],
          ['t', 'movies'], // topic tag
          ['t', 'entertainment']
        ],
        content: `Bookmarked: ${movie.Title} (${movie.Year})`,
        pubkey: nostrUser.pubkey
      }

      bookmarkEvent.id = getEventHash(bookmarkEvent)
      bookmarkEvent.sig = await window.nostr.signEvent(bookmarkEvent)

      await nostrPool.publish(selectedRelays, bookmarkEvent)
      
      // Update local state
      setUserBookmarks(prev => [...prev, movie])
      setError('')
    } catch (err) {
      setError('Failed to bookmark: ' + err.message)
    }
  }

  const removeBookmark = async (imdbID) => {
    try {
      // Create deletion event
      const deleteEvent = {
        kind: 5,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ['a', `30001:${nostrUser.pubkey}:${imdbID}`]
        ],
        content: 'Removing bookmark',
        pubkey: nostrUser.pubkey
      }

      deleteEvent.id = getEventHash(deleteEvent)
      deleteEvent.sig = await window.nostr.signEvent(deleteEvent)

      await nostrPool.publish(selectedRelays, deleteEvent)
      
      // Update local state
      setUserBookmarks(prev => prev.filter(b => b.imdbID !== imdbID))
    } catch (err) {
      setError('Failed to remove bookmark: ' + err.message)
    }
  }

  const loadUserBookmarks = async () => {
    if (!nostrPool || !nostrUser) return

    try {
      const filter = {
        kinds: [30001],
        authors: [nostrUser.pubkey],
        '#t': ['movies']
      }

      const events = await nostrPool.querySync(selectedRelays, filter)
      
      const bookmarks = events.map(event => {
        const tags = Object.fromEntries(event.tags)
        return {
          imdbID: tags.d,
          Title: tags.title,
          Year: tags.year,
          Type: tags.type,
          Poster: tags.poster
        }
      }).filter(b => b.imdbID) // Filter out invalid bookmarks

      setUserBookmarks(bookmarks)
    } catch (err) {
      console.error('Failed to load bookmarks:', err)
    }
  }

  // Discovery Features
  const loadAllUsersBookmarks = async () => {
    if (!nostrPool) return

    try {
      setLoading(true)
      const filter = {
        kinds: [30001],
        '#t': ['movies'],
        limit: 100
      }

      const events = await nostrPool.querySync(selectedRelays, filter)
      
      const userBookmarksMap = new Map()
      
      events.forEach(event => {
        const tags = Object.fromEntries(event.tags)
        const bookmark = {
          imdbID: tags.d,
          Title: tags.title,
          Year: tags.year,
          Type: tags.type,
          Poster: tags.poster
        }

        if (bookmark.imdbID) {
          if (!userBookmarksMap.has(event.pubkey)) {
            userBookmarksMap.set(event.pubkey, {
              pubkey: event.pubkey,
              npub: nip19.npubEncode(event.pubkey),
              bookmarks: []
            })
          }
          userBookmarksMap.get(event.pubkey).bookmarks.push(bookmark)
        }
      })

      setAllUsersBookmarks(Array.from(userBookmarksMap.values()))
    } catch (err) {
      setError('Failed to load discovery data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const searchUserByNpubOrNip05 = async () => {
    if (!discoverySearch.trim() || !nostrPool) return

    try {
      setLoading(true)
      let pubkey = null

      if (discoverySearch.startsWith('npub1')) {
        // NIP-19 npub
        const decoded = nip19.decode(discoverySearch)
        pubkey = decoded.data
      } else if (discoverySearch.includes('@')) {
        // NIP-05 identifier
        const profile = await nip05.queryProfile(discoverySearch)
        if (profile) pubkey = profile.pubkey
      }

      if (pubkey) {
        const filter = {
          kinds: [30001],
          authors: [pubkey],
          '#t': ['movies']
        }

        const events = await nostrPool.querySync(selectedRelays, filter)
        
        const bookmarks = events.map(event => {
          const tags = Object.fromEntries(event.tags)
          return {
            imdbID: tags.d,
            Title: tags.title,
            Year: tags.year,
            Type: tags.type,
            Poster: tags.poster
          }
        }).filter(b => b.imdbID)

        setAllUsersBookmarks([{
          pubkey,
          npub: nip19.npubEncode(pubkey),
          bookmarks
        }])
      } else {
        setError('Invalid npub or NIP-05 identifier')
      }
    } catch (err) {
      setError('Failed to search user: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Enhanced existing functions with bookmark checking
  const isMovieBookmarked = (movie) => {
    return userBookmarks.some(b => b.imdbID === movie.imdbID)
  }

  // Function to check if image meets minimum resolution requirements
  const checkImageResolution = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const isHighRes = img.width >= 1024 && img.height >= 1024
        console.log(`Image dimensions: ${img.width}x${img.height}, High-res: ${isHighRes}`)
        resolve(isHighRes ? imageUrl : null)
      }
      img.onerror = () => resolve(null)
      img.src = imageUrl
    })
  }

  // Function to try getting higher resolution versions of poster URLs
  const enhancePosterUrl = (originalUrl) => {
    if (!originalUrl || originalUrl === 'N/A') return null
    
    // Try to enhance OMDb poster URLs to get higher resolution versions
    const urls = [
      // Original URL
      originalUrl,
      // Try removing size constraints that might be in the URL
      originalUrl.replace(/SX\d+/, 'SX2000').replace(/SY\d+/, 'SY2000'),
      // Try common high-res patterns
      originalUrl.replace(/\._V1_.*\.jpg/, '._V1_QL100_UX2000_.jpg'),
      originalUrl.replace(/\._V1_.*\.jpg/, '._V1_SX2000.jpg'),
      originalUrl.replace(/\._V1_.*\.jpg/, '._V1_UX2000_CR0,0,2000,3000_AL_.jpg'),
    ]
    
    return urls
  }

  // Function to find and set high-resolution background image
  const setHighResBackground = async (posterUrl) => {
    if (!posterUrl || posterUrl === 'N/A') return

    const urlVariants = enhancePosterUrl(posterUrl)
    
    for (const url of urlVariants) {
      try {
        const highResUrl = await checkImageResolution(url)
        if (highResUrl) {
          console.log(`Using high-res background: ${highResUrl}`)
          setBackgroundImage(highResUrl)
          return
        }
      } catch (err) {
        console.log(`Failed to check resolution for: ${url}`)
      }
    }
    
    console.log('No high-resolution version found for poster')
  }

  // Function to get poster for direct IMDB ID searches
  const fetchPosterByImdbId = async (imdbId) => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=trilogy`)
      const data = await response.json()
      
      if (data.Response === 'True' && data.Poster && data.Poster !== 'N/A') {
        await setHighResBackground(data.Poster)
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
        
        // Try to find a high-resolution poster from search results
        const postersAvailable = results.filter(movie => movie.Poster && movie.Poster !== 'N/A')
        
        if (postersAvailable.length > 0) {
          // Try each poster until we find a high-res one
          for (const movie of postersAvailable) {
            const success = await setHighResBackground(movie.Poster)
            if (success !== false) break // Stop at first successful high-res background
          }
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
    // Set selected movie poster as background (high-res only)
    if (movie.Poster && movie.Poster !== 'N/A') {
      await setHighResBackground(movie.Poster)
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
    
    // Fetch poster for background (high-res only)
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

  // Relay Page Component
  const RelayPage = () => (
    <div className="relay-page">
      <div className="relay-header">
        <h2>🌐 Nostr Relay Configuration</h2>
        <p>Choose up to 10 relays from {availableRelays.length} online relays (randomly ordered)</p>
        <div className="relay-controls">
          <button onClick={fetchOnlineRelays} className="refresh-btn" disabled={loadingRelays}>
            {loadingRelays ? '⏳ Loading...' : '🔄 Refresh List'}
          </button>
          <button onClick={resetToDefault} className="reset-btn">
            🏠 Reset to Default
          </button>
          <button onClick={() => setShowRelayPage(false)} className="close-btn">
            ❌ Close
          </button>
        </div>
      </div>

      <div className="selected-relays">
        <h3>✅ Selected Relays ({selectedRelays.length}/10)</h3>
        <div className="selected-relay-list">
          {selectedRelays.map(relay => (
            <div key={relay} className="selected-relay-item">
              <span className={relay === DEFAULT_RELAY ? 'default-relay' : ''}>{relay}</span>
              {relay === DEFAULT_RELAY && <span className="default-badge">DEFAULT</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="available-relays">
        <h3>📡 Available Online Relays</h3>
        {loadingRelays ? (
          <div className="loading-relays">Loading relays...</div>
        ) : (
          <div className="relay-grid">
            {availableRelays.map(relay => (
              <div 
                key={relay} 
                className={`relay-item ${selectedRelays.includes(relay) ? 'selected' : ''}`}
                onClick={() => toggleRelay(relay)}
              >
                <div className="relay-checkbox">
                  {selectedRelays.includes(relay) ? '✅' : '⬜'}
                </div>
                <div className="relay-url">{relay}</div>
                <div className="relay-status online">🟢 Online</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  if (showRelayPage) {
    return (
      <div className="App" style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        <div className="background-overlay"></div>
        <div className="content-wrapper">
          <RelayPage />
        </div>
      </div>
    )
  }

  return (
    <div className="App" style={{
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      {/* Background overlay for better readability */}
      <div className="background-overlay"></div>
      
      <div className="content-wrapper">
        <h1>🎬 Video Embed App</h1>
        <p>Search by title or IMDB ID using <a href="https://vidsrc.xyz" target="_blank" rel="noopener noreferrer">Vidsrc API</a></p>
        
        {/* Navigation Links */}
        <div className="main-nav">
          <button onClick={() => setShowRelayPage(true)} className="relay-config-btn">
            🌐 Relay Config ({selectedRelays.length})
          </button>
        </div>
        
        {/* Nostr Authentication */}
        <div className="nostr-auth">
          {!nostrUser ? (
            <button onClick={connectNostr} className="nostr-connect-btn">
              🔑 Connect Nostr Extension
            </button>
          ) : (
            <div className="nostr-user-info">
              <span>Connected: {nostrUser.profile.name}</span>
              <button onClick={() => setShowBookmarks(!showBookmarks)} className="bookmarks-btn">
                📚 My Bookmarks ({userBookmarks.length}/10)
              </button>
              <button onClick={() => {setShowDiscovery(!showDiscovery); if (!showDiscovery) loadAllUsersBookmarks()}} className="discovery-btn">
                🌐 Discover
              </button>
              <button onClick={disconnectNostr} className="nostr-disconnect-btn">
                🚪 Logout
              </button>
            </div>
          )}
        </div>

        {/* Bookmarks View */}
        {showBookmarks && nostrUser && (
          <div className="bookmarks-section">
            <div className="bookmarks-header">
              <h3>📚 My Bookmarks ({userBookmarks.length}/10)</h3>
              <div className="view-controls">
                <button 
                  className={`view-btn ${bookmarkViewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setBookmarkViewMode('grid')}
                >
                  🔲 Grid
                </button>
                <button 
                  className={`view-btn ${bookmarkViewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setBookmarkViewMode('list')}
                >
                  📋 List
                </button>
              </div>
            </div>

            {userBookmarks.length === 0 ? (
              <div className="no-bookmarks">
                <p>No bookmarks yet. Search for movies/shows and click the ⭐ to bookmark them!</p>
              </div>
            ) : (
              <div className={`bookmarks-container ${bookmarkViewMode}`}>
                {userBookmarks.map((movie) => (
                  <div key={movie.imdbID} className="bookmark-item">
                    {movie.Poster && movie.Poster !== 'N/A' && (
                      <img 
                        src={movie.Poster} 
                        alt={movie.Title}
                        className="bookmark-poster"
                      />
                    )}
                    <div className="bookmark-info">
                      <h4>{movie.Title}</h4>
                      <p>{movie.Year} • {movie.Type}</p>
                      <button 
                        onClick={() => toggleBookmark(movie)}
                        className="remove-bookmark-btn"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Discovery Section */}
        {showDiscovery && (
          <div className="discovery-section">
            <h3>🌐 Discover Bookmarks</h3>
            
            <div className="discovery-search">
              <input
                type="text"
                value={discoverySearch}
                onChange={(e) => setDiscoverySearch(e.target.value)}
                placeholder="Search by npub1... or user@domain.com (NIP-05)"
                className="discovery-input"
              />
              <button onClick={searchUserByNpubOrNip05} className="discovery-search-btn">
                🔍 Search User
              </button>
              <button onClick={loadAllUsersBookmarks} className="discovery-all-btn">
                📊 Load All Users
              </button>
            </div>

            {allUsersBookmarks.length > 0 && (
              <div className="all-users-bookmarks">
                {allUsersBookmarks.map((userData) => (
                  <div key={userData.pubkey} className="user-bookmark-section">
                    <h4>👤 {userData.npub.slice(0, 20)}... ({userData.bookmarks.length} bookmarks)</h4>
                    <div className="user-bookmarks-grid">
                      {userData.bookmarks.map((movie) => (
                        <div key={movie.imdbID} className="discovery-bookmark-item" onClick={() => selectMovie(movie)}>
                          {movie.Poster && movie.Poster !== 'N/A' && (
                            <img 
                              src={movie.Poster} 
                              alt={movie.Title}
                              className="discovery-poster"
                            />
                          )}
                          <div className="discovery-info">
                            <h5>{movie.Title}</h5>
                            <p>{movie.Year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
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
                {nostrUser && (
                  <button 
                    className={`bookmark-toggle ${isMovieBookmarked(movie) ? 'bookmarked' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleBookmark(movie)
                    }}
                  >
                    {isMovieBookmarked(movie) ? '⭐' : '☆'}
                  </button>
                )}
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

        {!embedUrl && searchResults.length === 0 && !showBookmarks && !showDiscovery && (
          <div className="info-box">
            <h3>🔍 How to Use</h3>
            <p><strong>🔑 Step 1:</strong> Connect your Nostr browser extension to unlock bookmarking</p>
            <p><strong>🎬 Step 2:</strong> Search by title or enter IMDB ID directly</p>
            <p><strong>⭐ Step 3:</strong> Bookmark your favorites (max 10) and discover others!</p>
            <p><strong>🌐 Relay:</strong> Currently using {selectedRelays.length} relay{selectedRelays.length !== 1 ? 's' : ''} (default: tigs.nostr1.com)</p>
            
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
        
        <footer className="app-footer">
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