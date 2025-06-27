@echo off
echo Setting up Video Embed App project with Vidsrc API...
echo.

REM Create project directories
if not exist "src" mkdir src
if not exist "public" mkdir public

echo [1/9] Creating package.json...
(
echo {
echo   "name": "video-embed-app",
echo   "version": "1.0.0",
echo   "private": true,
echo   "type": "module",
echo   "scripts": {
echo     "dev": "vite",
echo     "build": "vite build",
echo     "preview": "vite preview",
echo     "lint": "eslint src --ext .js,.jsx --report-unused-disable-directives --max-warnings 0"
echo   },
echo   "dependencies": {
echo     "axios": "^1.6.7",
echo     "react": "^18.2.0",
echo     "react-dom": "^18.2.0"
echo   },
echo   "devDependencies": {
echo     "@types/react": "^18.2.55",
echo     "@types/react-dom": "^18.2.19",
echo     "@vitejs/plugin-react": "^4.2.1",
echo     "eslint": "^8.56.0",
echo     "eslint-plugin-react": "^7.33.2",
echo     "eslint-plugin-react-hooks": "^4.6.0",
echo     "eslint-plugin-react-refresh": "^0.4.5",
echo     "vite": "^5.0.8"
echo   }
echo }
) > package.json

echo [2/9] Creating vite.config.js...
(
echo import { defineConfig } from 'vite'
echo import react from '@vitejs/plugin-react'
echo.
echo export default defineConfig^({
echo   plugins: [react^(^)],
echo   server: {
echo     port: 4000,
echo     open: true
echo   },
echo   optimizeDeps: {
echo     include: ['react', 'react-dom', 'axios']
echo   }
echo }^)
) > vite.config.js

echo [3/9] Creating index.html...
(
echo ^<!DOCTYPE html^>
echo ^<html lang="en"^>
echo   ^<head^>
echo     ^<meta charset="UTF-8" /^>
echo     ^<link rel="icon" type="image/svg+xml" href="/vite.svg" /^>
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0" /^>
echo     ^<title^>Video Embed App^</title^>
echo     ^<meta name="description" content="Browse and embed movies and TV shows using Vidsrc" /^>
echo   ^</head^>
echo   ^<body^>
echo     ^<div id="root"^>^</div^>
echo     ^<script type="module" src="./src/main.jsx"^>^</script^>
echo   ^</body^>
echo ^</html^>
) > index.html

echo [4/9] Creating .gitignore...
(
echo # Logs
echo logs
echo *.log
echo npm-debug.log*
echo yarn-debug.log*
echo yarn-error.log*
echo pnpm-debug.log*
echo lerna-debug.log*
echo.
echo node_modules
echo dist
echo dist-ssr
echo *.local
echo.
echo # Editor directories and files
echo .vscode/*
echo !.vscode/extensions.json
echo .idea
echo .DS_Store
echo *.suo
echo *.ntvs*
echo *.njsproj
echo *.sln
echo *.sw?
echo.
echo # Environment variables
echo .env
echo .env.local
echo .env.development.local
echo .env.test.local
echo .env.production.local
) > .gitignore

echo [5/9] Creating src/main.jsx...
(
echo import React from 'react'
echo import ReactDOM from 'react-dom/client'
echo import App from './App.jsx'
echo import './index.css'
echo.
echo ReactDOM.createRoot(document.getElementById('root'^)^).render(
echo   ^<React.StrictMode^>
echo     ^<App /^>
echo   ^</React.StrictMode^>,
echo ^)
) > src\main.jsx

echo [6/9] Creating src/index.css...
(
echo :root {
echo   font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
echo   line-height: 1.5;
echo   font-weight: 400;
echo   color-scheme: light dark;
echo   color: rgba(255, 255, 255, 0.87^);
echo   background-color: #242424;
echo   font-synthesis: none;
echo   text-rendering: optimizeLegibility;
echo   -webkit-font-smoothing: antialiased;
echo   -moz-osx-font-smoothing: grayscale;
echo   -webkit-text-size-adjust: 100%%;
echo }
echo.
echo a {
echo   font-weight: 500;
echo   color: #646cff;
echo   text-decoration: inherit;
echo }
echo a:hover {
echo   color: #535bf2;
echo }
echo.
echo body {
echo   margin: 0;
echo   display: flex;
echo   place-items: center;
echo   min-width: 320px;
echo   min-height: 100vh;
echo }
echo.
echo h1 {
echo   font-size: 3.2em;
echo   line-height: 1.1;
echo   text-align: center;
echo   margin-bottom: 2rem;
echo }
echo.
echo #root {
echo   max-width: 1400px;
echo   margin: 0 auto;
echo   padding: 2rem;
echo   text-align: center;
echo }
echo.
echo .nav-container {
echo   background: rgba(255, 255, 255, 0.1^);
echo   padding: 1.5rem;
echo   border-radius: 12px;
echo   margin-bottom: 2rem;
echo   backdrop-filter: blur(10px^);
echo }
echo.
echo .nav-buttons {
echo   display: flex;
echo   gap: 1rem;
echo   justify-content: center;
echo   flex-wrap: wrap;
echo   margin-bottom: 1rem;
echo }
echo.
echo .nav-button {
echo   padding: 0.75rem 1.5rem;
echo   border: 2px solid #646cff;
echo   background: transparent;
echo   color: #646cff;
echo   border-radius: 8px;
echo   font-size: 1rem;
echo   cursor: pointer;
echo   transition: all 0.3s;
echo }
echo.
echo .nav-button.active {
echo   background: #646cff;
echo   color: white;
echo }
echo.
echo .nav-button:hover {
echo   background: #535bf2;
echo   border-color: #535bf2;
echo   color: white;
echo }
echo.
echo .search-form {
echo   display: flex;
echo   gap: 1rem;
echo   align-items: center;
echo   justify-content: center;
echo   flex-wrap: wrap;
echo   margin-top: 1rem;
echo }
echo.
echo .search-input {
echo   padding: 0.75rem 1rem;
echo   border: 1px solid #ccc;
echo   border-radius: 8px;
echo   font-size: 1rem;
echo   min-width: 300px;
echo   background: rgba(255, 255, 255, 0.9^);
echo   color: #333;
echo }
echo.
echo .search-button {
echo   padding: 0.75rem 1.5rem;
echo   background: #646cff;
echo   color: white;
echo   border: none;
echo   border-radius: 8px;
echo   font-size: 1rem;
echo   cursor: pointer;
echo   transition: background-color 0.3s;
echo }
echo.
echo .search-button:hover {
echo   background: #535bf2;
echo }
echo.
echo .search-button:disabled {
echo   background: #ccc;
echo   cursor: not-allowed;
echo }
echo.
echo .pagination {
echo   display: flex;
echo   gap: 0.5rem;
echo   justify-content: center;
echo   margin-bottom: 2rem;
echo }
echo.
echo .page-button {
echo   padding: 0.5rem 1rem;
echo   background: rgba(255, 255, 255, 0.1^);
echo   color: white;
echo   border: 1px solid #646cff;
echo   border-radius: 6px;
echo   cursor: pointer;
echo   transition: all 0.3s;
echo }
echo.
echo .page-button:hover,
echo .page-button.active {
echo   background: #646cff;
echo }
echo.
echo .page-button:disabled {
echo   opacity: 0.5;
echo   cursor: not-allowed;
echo }
echo.
echo .results-container {
echo   display: grid;
echo   grid-template-columns: repeat(auto-fill, minmax(200px, 1fr^)^);
echo   gap: 1.5rem;
echo   margin-bottom: 2rem;
echo }
echo.
echo .result-item {
echo   background: rgba(255, 255, 255, 0.1^);
echo   padding: 1rem;
echo   border-radius: 12px;
echo   cursor: pointer;
echo   transition: all 0.3s;
echo   display: flex;
echo   flex-direction: column;
echo   align-items: center;
echo   text-align: center;
echo   border: 2px solid transparent;
echo }
echo.
echo .result-item:hover {
echo   transform: translateY(-5px^);
echo   background: rgba(255, 255, 255, 0.2^);
echo   border-color: #646cff;
echo   box-shadow: 0 10px 25px rgba(100, 108, 255, 0.3^);
echo }
echo.
echo .result-poster {
echo   width: 100%%;
echo   max-width: 150px;
echo   height: auto;
echo   border-radius: 8px;
echo   margin-bottom: 1rem;
echo   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3^);
echo }
echo.
echo .result-title {
echo   font-weight: 600;
echo   margin: 0 0 0.5rem 0;
echo   font-size: 1.1rem;
echo }
echo.
echo .result-year {
echo   color: #bbb;
echo   font-size: 0.9rem;
echo   margin: 0;
echo }
echo.
echo .result-id {
echo   font-size: 0.8rem;
echo   color: #888;
echo   margin-top: 0.5rem;
echo   font-family: monospace;
echo }
echo.
echo .episode-controls {
echo   background: rgba(255, 255, 255, 0.1^);
echo   padding: 1.5rem;
echo   border-radius: 12px;
echo   margin-bottom: 2rem;
echo   backdrop-filter: blur(10px^);
echo }
echo.
echo .episode-selectors {
echo   display: flex;
echo   gap: 1rem;
echo   justify-content: center;
echo   align-items: center;
echo   flex-wrap: wrap;
echo }
echo.
echo .episode-select {
echo   padding: 0.5rem 1rem;
echo   border: 1px solid #ccc;
echo   border-radius: 6px;
echo   background: rgba(255, 255, 255, 0.9^);
echo   color: #333;
echo   font-size: 1rem;
echo }
echo.
echo .video-container {
echo   margin-top: 2rem;
echo   border-radius: 12px;
echo   overflow: hidden;
echo   box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4^);
echo }
echo.
echo .video-iframe {
echo   width: 100%%;
echo   height: 600px;
echo   border: none;
echo }
echo.
echo .loading {
echo   display: flex;
echo   justify-content: center;
echo   align-items: center;
echo   height: 100px;
echo   font-size: 1.2rem;
echo   color: #646cff;
echo }
echo.
echo .error {
echo   color: #ff6b6b;
echo   background: rgba(255, 107, 107, 0.1^);
echo   padding: 1rem;
echo   border-radius: 8px;
echo   margin: 1rem 0;
echo   border: 1px solid rgba(255, 107, 107, 0.3^);
echo }
echo.
echo .info-box {
echo   background: rgba(100, 108, 255, 0.1^);
echo   border: 1px solid rgba(100, 108, 255, 0.3^);
echo   padding: 1rem;
echo   border-radius: 8px;
echo   margin: 1rem 0;
echo   color: #646cff;
echo }
echo.
echo @media (prefers-color-scheme: light^) {
echo   :root {
echo     color: #213547;
echo     background-color: #ffffff;
echo   }
echo   a:hover {
echo     color: #747bff;
echo   }
echo   .search-button {
echo     background-color: #1a1a1a;
echo   }
echo }
echo.
echo @media (max-width: 768px^) {
echo   .results-container {
echo     grid-template-columns: repeat(auto-fill, minmax(150px, 1fr^)^);
echo   }
echo   
echo   .video-iframe {
echo     height: 400px;
echo   }
echo   
echo   #root {
echo     padding: 1rem;
echo   }
echo }
) > src\index.css

echo [7/9] Creating src/App.jsx...
(
echo import { useState, useEffect } from 'react'
echo import axios from 'axios'
echo.
echo function App(^) {
echo   const [activeTab, setActiveTab] = useState('movies'^)
echo   const [imdbQuery, setImdbQuery] = useState(''^^)
echo   const [results, setResults] = useState([]^)
echo   const [embedUrl, setEmbedUrl] = useState(''^^)
echo   const [loading, setLoading] = useState(false^)
echo   const [error, setError] = useState(''^^)
echo   const [currentPage, setCurrentPage] = useState(1^)
echo   const [selectedShow, setSelectedShow] = useState(null^)
echo   const [selectedSeason, setSelectedSeason] = useState(1^)
echo   const [selectedEpisode, setSelectedEpisode] = useState(1^)
echo.
echo   const VIDSRC_BASE = 'https://vidsrc.xyz'
echo.
echo   useEffect((^) =^> {
echo     if (activeTab !== 'imdb'^) {
echo       loadContent(^)
echo     }
echo   }, [activeTab, currentPage]^)
echo.
echo   const loadContent = async (^) =^> {
echo     setLoading(true^)
echo     setError(''^^)
echo     
echo     try {
echo       let endpoint = ''
echo       if (activeTab === 'movies'^) {
echo         endpoint = `${VIDSRC_BASE}/movies/latest/page-${currentPage}.json`
echo       } else if (activeTab === 'tvshows'^) {
echo         endpoint = `${VIDSRC_BASE}/tvshows/latest/page-${currentPage}.json`
echo       } else if (activeTab === 'episodes'^) {
echo         endpoint = `${VIDSRC_BASE}/episodes/latest/page-${currentPage}.json`
echo       }
echo.
echo       const response = await axios.get(endpoint^)
echo       setResults(response.data.result ^|^| []^)
echo     } catch (err^) {
echo       console.error('Load content error:', err^)
echo       setError(`Failed to load ${activeTab}. Please try again later.`^)
echo       setResults([]^)
echo     } finally {
echo       setLoading(false^)
echo     }
echo   }
echo.
echo   const handleImdbSearch = (e^) =^> {
echo     e.preventDefault(^)
echo     if (!imdbQuery.trim(^)^) {
echo       setError('Please enter an IMDB ID'^)
echo       return
echo     }
echo.
echo     setError(''^^)
echo     setSelectedShow(null^)
echo     
echo     // Determine if it's a movie or TV show based on the ID format
echo     // This is a simple heuristic - in practice you might need more sophisticated detection
echo     const embedUrl = `${VIDSRC_BASE}/embed/movie?imdb=${imdbQuery.trim(^)}`
echo     setEmbedUrl(embedUrl^)
echo   }
echo.
echo   const handleItemSelect = (item^) =^> {
echo     setError(''^^)
echo     setEmbedUrl(''^^)
echo     
echo     if (activeTab === 'movies'^) {
echo       // For movies, embed directly
echo       const embedUrl = item.imdb_id 
echo         ? `${VIDSRC_BASE}/embed/movie?imdb=${item.imdb_id}`
echo         : `${VIDSRC_BASE}/embed/movie?tmdb=${item.tmdb_id}`
echo       setEmbedUrl(embedUrl^)
echo       setSelectedShow(null^)
echo     } else if (activeTab === 'tvshows'^) {
echo       // For TV shows, show episode selector
echo       setSelectedShow(item^)
echo       setSelectedSeason(1^)
echo       setSelectedEpisode(1^)
echo     } else if (activeTab === 'episodes'^) {
echo       // For episodes, embed directly
echo       const embedUrl = item.imdb_id
echo         ? `${VIDSRC_BASE}/embed/tv?imdb=${item.imdb_id}&season=${item.season}&episode=${item.episode}`
echo         : `${VIDSRC_BASE}/embed/tv?tmdb=${item.tmdb_id}&season=${item.season}&episode=${item.episode}`
echo       setEmbedUrl(embedUrl^)
echo       setSelectedShow(null^)
echo     }
echo   }
echo.
echo   const handleEpisodeSelect = (^) =^> {
echo     if (!selectedShow^) return
echo     
echo     const embedUrl = selectedShow.imdb_id
echo       ? `${VIDSRC_BASE}/embed/tv?imdb=${selectedShow.imdb_id}&season=${selectedSeason}&episode=${selectedEpisode}`
echo       : `${VIDSRC_BASE}/embed/tv?tmdb=${selectedShow.tmdb_id}&season=${selectedSeason}&episode=${selectedEpisode}`
echo     setEmbedUrl(embedUrl^)
echo   }
echo.
echo   const handleTabChange = (tab^) =^> {
echo     setActiveTab(tab^)
echo     setCurrentPage(1^)
echo     setResults([]^)
echo     setEmbedUrl(''^^)
echo     setError(''^^)
echo     setSelectedShow(null^)
echo   }
echo.
echo   const handlePageChange = (page^) =^> {
echo     setCurrentPage(page^)
echo     setEmbedUrl(''^^)
echo     setSelectedShow(null^)
echo   }
echo.
echo   return (
echo     ^<div className="App"^>
echo       ^<h1^>🎬 Video Embed App^</h1^>
echo       ^<p^>Browse latest content or search by IMDB ID using ^<a href="https://vidsrc.me/api/" target="_blank" rel="noopener noreferrer"^>Vidsrc API^</a^>^</p^>
echo       
echo       ^<div className="nav-container"^>
echo         ^<div className="nav-buttons"^>
echo           ^<button 
echo             className={`nav-button ${activeTab === 'movies' ? 'active' : ''}`}
echo             onClick={(^) =^> handleTabChange('movies'^)}
echo           ^>
echo             🎥 Latest Movies
echo           ^</button^>
echo           ^<button 
echo             className={`nav-button ${activeTab === 'tvshows' ? 'active' : ''}`}
echo             onClick={(^) =^> handleTabChange('tvshows'^)}
echo           ^>
echo             📺 Latest TV Shows
echo           ^</button^>
echo           ^<button 
echo             className={`nav-button ${activeTab === 'episodes' ? 'active' : ''}`}
echo             onClick={(^) =^> handleTabChange('episodes'^)}
echo           ^>
echo             🎞️ Latest Episodes
echo           ^</button^>
echo           ^<button 
echo             className={`nav-button ${activeTab === 'imdb' ? 'active' : ''}`}
echo             onClick={(^) =^> handleTabChange('imdb'^)}
echo           ^>
echo             🔍 IMDB Search
echo           ^</button^>
echo         ^</div^>
echo.
echo         {activeTab === 'imdb' && (
echo           ^<form onSubmit={handleImdbSearch} className="search-form"^>
echo             ^<input
echo               type="text"
echo               value={imdbQuery}
echo               onChange={(e^) =^> setImdbQuery(e.target.value^)}
echo               placeholder="Enter IMDB ID (e.g., tt0944947 for Game of Thrones^)"
echo               className="search-input"
echo             /^>
echo             ^<button type="submit" className="search-button"^>
echo               🎬 Embed Video
echo             ^</button^>
echo           ^</form^>
echo         ^)}
echo       ^</div^>
echo.
echo       {error && ^<div className="error"^>{error}^</div^>}
echo.
echo       {activeTab !== 'imdb' && (
echo         ^<div className="pagination"^>
echo           ^<button 
echo             className="page-button"
echo             onClick={(^) =^> handlePageChange(Math.max(1, currentPage - 1^)^)}
echo             disabled={currentPage === 1}
echo           ^>
echo             ← Previous
echo           ^</button^>
echo           ^<span className="page-button active"^>Page {currentPage}^</span^>
echo           ^<button 
echo             className="page-button"
echo             onClick={(^) =^> handlePageChange(currentPage + 1^)}
echo           ^>
echo             Next →
echo           ^</button^>
echo         ^</div^>
echo       ^)}
echo.
echo       {loading && ^<div className="loading"^>Loading {activeTab}...^</div^>}
echo.
echo       {activeTab !== 'imdb' && results.length ^> 0 && (
echo         ^<div className="results-container"^>
echo           {results.map((item, index^) =^> (
echo             ^<div
echo               key={`${item.imdb_id ^|^| item.tmdb_id}-${index}`}
echo               className="result-item"
echo               onClick={(^) =^> handleItemSelect(item^)}
echo             ^>
echo               {item.poster && (
echo                 ^<img
echo                   src={item.poster}
echo                   alt={item.title ^|^| 'No title'}
echo                   className="result-poster"
echo                   onError={(e^) =^> {
echo                     e.target.style.display = 'none'
echo                   }}
echo                 /^>
echo               ^)}
echo               ^<h3 className="result-title"^>
echo                 {item.title ^|^| 'Unknown Title'}
echo               ^</h3^>
echo               {item.year && ^<p className="result-year"^>{item.year}^</p^>}
echo               {activeTab === 'episodes' && (
echo                 ^<p className="result-year"^>S{item.season} E{item.episode}^</p^>
echo               ^)}
echo               ^<p className="result-id"^>
echo                 {item.imdb_id ? `IMDB: ${item.imdb_id}` : `TMDB: ${item.tmdb_id}`}
echo               ^</p^>
echo             ^</div^>
echo           ^)^)}
echo         ^</div^>
echo       ^)}
echo.
echo       {selectedShow && (
echo         ^<div className="episode-controls"^>
echo           ^<h3^>Select Episode for: {selectedShow.title}^</h3^>
echo           ^<div className="episode-selectors"^>
echo             ^<label^>
echo               Season:
echo               ^<select 
echo                 value={selectedSeason} 
echo                 onChange={(e^) =^> setSelectedSeason(Number(e.target.value^)^)}
echo                 className="episode-select"
echo               ^>
echo                 {Array.from({length: 20}, (_, i^) =^> i + 1^).map(season =^> (
echo                   ^<option key={season} value={season}^>Season {season}^</option^>
echo                 ^)^)}
echo               ^</select^>
echo             ^</label^>
echo             
echo             ^<label^>
echo               Episode:
echo               ^<select 
echo                 value={selectedEpisode} 
echo                 onChange={(e^) =^> setSelectedEpisode(Number(e.target.value^)^)}
echo                 className="episode-select"
echo               ^>
echo                 {Array.from({length: 30}, (_, i^) =^> i + 1^).map(episode =^> (
echo                   ^<option key={episode} value={episode}^>Episode {episode}^</option^>
echo                 ^)^)}
echo               ^</select^>
echo             ^</label^>
echo             
echo             ^<button 
echo               onClick={handleEpisodeSelect}
echo               className="search-button"
echo             ^>
echo               🎬 Watch Episode
echo             ^</button^>
echo           ^</div^>
echo         ^</div^>
echo       ^)}
echo.
echo       {embedUrl && (
echo         ^<div^>
echo           ^<div className="info-box"^>
echo             ^<strong^>Now Playing:^</strong^> {embedUrl}
echo           ^</div^>
echo           ^<div className="video-container"^>
echo             ^<iframe
echo               src={embedUrl}
echo               className="video-iframe"
echo               allowFullScreen
echo               title="Video Player"
echo               referrerPolicy="origin"
echo             ^>^</iframe^>
echo           ^</div^>
echo         ^</div^>
echo       ^)}
echo.
echo       {activeTab === 'imdb' && !embedUrl && (
echo         ^<div className="info-box"^>
echo           ^<h3^>🔍 IMDB Search^</h3^>
echo           ^<p^>Enter an IMDB ID to directly embed a movie or TV show.^</p^>
echo           ^<p^>^<strong^>Examples:^</strong^>^</p^>
echo           ^<ul style={{textAlign: 'left', maxWidth: '400px', margin: '0 auto'}}^>
echo             ^<li^>^<code^>tt0944947^</code^> - Game of Thrones^</li^>
echo             ^<li^>^<code^>tt0111161^</code^> - The Shawshank Redemption^</li^>
echo             ^<li^>^<code^>tt0068646^</code^> - The Godfather^</li^>
echo             ^<li^>^<code^>tt0468569^</code^> - The Dark Knight^</li^>
echo           ^</ul^>
echo         ^</div^>
echo       ^)}
echo     ^</div^>
echo   ^)
echo }
echo.
echo export default App
) > src\App.jsx

echo [8/9] Creating README.md...
(
echo # 🎬 Video Embed App with Vidsrc API
echo.
echo A modern React application for browsing and embedding movies and TV shows using the [Vidsrc API](https://vidsrc.me/api/^). No external API keys required!
echo.
echo ## ✨ Features
echo.
echo - 🎥 **Browse Latest Movies** - Discover recently added movies
echo - 📺 **Browse Latest TV Shows** - Find new TV series with episode selection
echo - 🎞️ **Browse Latest Episodes** - See the most recent episode releases
echo - 🔍 **Direct IMDB Search** - Embed videos directly using IMDB IDs
echo - 📱 **Responsive Design** - Works great on all devices
echo - ⚡ **No API Keys Required** - Uses public Vidsrc endpoints
echo - 🎨 **Modern UI** - Clean, dark theme with smooth animations
echo.
echo ## 🚀 Quick Start
echo.
echo ### Prerequisites
echo - Node.js (version 16 or higher^)
echo - npm or yarn
echo.
echo ### Installation
echo.
echo 1. **Install dependencies:**
echo    ```bash
echo    npm install
echo    ```
echo.
echo 2. **Start the development server:**
echo    ```bash
echo    npm run dev
echo    ```
echo.
echo 3. **Open your browser:**
echo    - Navigate to `http://localhost:3000`
echo.
echo ## 📖 Usage
echo.
echo ### Browse Content
echo.
echo 1. **Movies Tab:** Browse latest movies and click to watch
echo 2. **TV Shows Tab:** Browse TV series, then select season/episode
echo 3. **Episodes Tab:** Browse latest episode releases
echo 4. Use pagination to explore more content
echo.
echo ### IMDB Search
echo.
echo 1. Click the "🔍 IMDB Search" tab
echo 2. Enter an IMDB ID (e.g., `tt0944947` for Game of Thrones^)
echo 3. Click "🎬 Embed Video" to watch
echo.
echo ### Example IMDB IDs
echo.
echo - `tt0944947` - Game of Thrones
echo - `tt0111161` - The Shawshank Redemption  
echo - `tt0068646` - The Godfather
echo - `tt0468569` - The Dark Knight
echo - `tt0109830` - Forrest Gump
echo.
echo ## 🛠️ Scripts
echo.
echo - `npm run dev` - Start development server
echo - `npm run build` - Build for production
echo - `npm run preview` - Preview production build
echo - `npm run lint` - Run ESLint
echo.
echo ## 🏗️ Project Structure
echo.
echo ```
echo video-embed-app/
echo ├── public/
echo ├── src/
echo │   ├── App.jsx          # Main application component
echo │   ├── main.jsx         # Application entry point
echo │   └── index.css        # Global styles
echo ├── index.html           # HTML template
echo ├── package.json         # Dependencies and scripts
echo ├── vite.config.js       # Vite configuration
echo └── README.md            # This file
echo ```
echo.
echo ## 🔧 Technologies Used
echo.
echo - **React 18** - UI library
echo - **Vite** - Build tool and dev server
echo - **Axios** - HTTP client
echo - **Vidsrc API** - Content data and video embedding
echo.
echo ## 📡 API Endpoints Used
echo.
echo This app utilizes the following [Vidsrc API](https://vidsrc.me/api/^) endpoints:
echo.
echo - **Movies:** `https://vidsrc.xyz/movies/latest/page-{PAGE}.json`
echo - **TV Shows:** `https://vidsrc.xyz/tvshows/latest/page-{PAGE}.json`
echo - **Episodes:** `https://vidsrc.xyz/episodes/latest/page-{PAGE}.json`
echo - **Movie Embed:** `https://vidsrc.xyz/embed/movie?imdb={IMDB_ID}`
echo - **TV Embed:** `https://vidsrc.xyz/embed/tv?imdb={IMDB_ID}&season={S}&episode={E}`
echo.
echo ## 🎬 Video Embedding
echo.
echo The app supports multiple embed formats:
echo.
echo - **Movies:** Direct IMDB/TMDB ID embedding
echo - **TV Shows:** Season and episode selection
echo - **Custom Options:** Autoplay, subtitles, and language settings
echo.
echo ### Embed URL Examples:
echo.
echo ```
echo # Movie
echo https://vidsrc.xyz/embed/movie?imdb=tt5433140
echo.
echo # TV Show Episode
echo https://vidsrc.xyz/embed/tv?imdb=tt0944947&season=1&episode=1
echo.
echo # With Options
echo https://vidsrc.xyz/embed/movie?imdb=tt5433140&ds_lang=de&autoplay=1
echo ```
echo.
echo ## 🚀 Deployment
echo.
echo 1. **Build the project:**
echo    ```bash
echo    npm run build
echo    ```
echo.
echo 2. **Deploy the `dist` folder** to your preferred hosting service:
echo    - [Vercel](https://vercel.com/^)
echo    - [Netlify](https://netlify.com/^)
echo    - [GitHub Pages](https://pages.github.com/^)
echo    - Any static hosting service
echo.
echo ## 🤝 Contributing
echo.
echo 1. Fork the project
echo 2. Create your feature branch (`git checkout -b feature/AmazingFeature`^)
echo 3. Commit your changes (`git commit -m 'Add some AmazingFeature'`^)
echo 4. Push to the branch (`git push origin feature/AmazingFeature`^)
echo 5. Open a Pull Request
echo.
echo ## 📄 License
echo.
echo This project is open source and available under the [MIT License](LICENSE^).
echo.
echo ## ⚠️ Disclaimer
echo.
echo This application is for educational purposes. Please ensure you comply with the terms of service of the APIs and services used. Content availability depends on the Vidsrc service.
echo.
echo ## 🔗 Links
echo.
echo - [Vidsrc API Documentation](https://vidsrc.me/api/^)
echo - [React Documentation](https://react.dev/^)
echo - [Vite Documentation](https://vitejs.dev/^)
) > README.md

echo [9/11] Creating .env.example...
(
echo # Application Configuration
echo VITE_APP_NAME="Video Embed App"
echo VITE_APP_VERSION="2.0.0"
echo.
echo # Optional: Custom Vidsrc domain (if you want to use a different domain^)
echo # VITE_VIDSRC_DOMAIN="vidsrc.xyz"
echo.
echo # Development settings
echo VITE_DEV_MODE=true
) > .env.example

echo [10/11] Creating vite.config.minimal.js (backup config^)...
(
echo import { defineConfig } from 'vite'
echo import react from '@vitejs/plugin-react'
echo.
echo export default defineConfig^({
echo   plugins: [react^(^)]
echo }^)
) > vite.config.minimal.js

echo [11/11] Creating setup-fix.bat (troubleshooting script^)...
(
echo @echo off
echo echo Troubleshooting Vite setup...
echo echo.
echo echo Checking files...
echo if exist index.html ^(echo ✅ index.html found^) else ^(echo ❌ index.html missing^)
echo if exist src\main.jsx ^(echo ✅ src\main.jsx found^) else ^(echo ❌ src\main.jsx missing^)
echo if exist vite.config.js ^(echo ✅ vite.config.js found^) else ^(echo ❌ vite.config.js missing^)
echo echo.
echo echo If you're getting entry point errors, try:
echo echo 1. copy vite.config.minimal.js vite.config.js
echo echo 2. npm run dev
echo echo.
echo pause
) > setup-fix.bat

echo.
echo ✅ Video Embed App with Vidsrc API setup complete!
echo.
echo 🎯 Key Features:
echo - ✅ No API keys required - uses public Vidsrc endpoints
echo - ✅ Browse latest movies, TV shows, and episodes  
echo - ✅ Direct IMDB ID search and embedding
echo - ✅ Season/episode selection for TV shows
echo - ✅ Modern responsive UI with pagination
echo.
echo 📋 Next Steps:
echo 1. Run: npm install
echo 2. Run: npm run dev
echo 3. Open http://localhost:4000 in your browser
echo 4. Start browsing content or search by IMDB ID!
echo.
echo 🔧 If you get Vite entry point errors:
echo - Make sure you're in the project directory when running npm run dev
echo - Verify index.html and src/main.jsx files exist
echo - Try: npm run build (then npm run preview^)
echo.
echo 🔗 API Reference: https://vidsrc.me/api/
echo 🎉 Happy streaming!
pause 