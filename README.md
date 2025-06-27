# Video Embed App

A simple, modern web application that allows users to watch movies and TV shows by embedding content using the Vidsrc API with IMDB integration.

## Features

### 🔍 **Dual Search Methods**
- **Search by Title**: Enter any movie or TV show title to find content
- **Direct IMDB ID**: Enter IMDB IDs directly for precise content selection

### 🎬 **Content Support**
- **Movies**: Full movie playback
- **TV Shows**: Episode-specific playback with season/episode selection
- **High-Quality Streams**: Powered by Vidsrc.xyz

### 📱 **Modern UI**
- Clean, responsive design that works on all devices
- Dark theme with smooth animations
- Intuitive navigation between search modes

## How to Use

### Method 1: Search by Title
1. Select "🔍 Search by Title" 
2. Choose "Movie" or "TV Show"
3. Enter the title in the search box
4. Click on a result from the grid
5. For TV shows, select season and episode
6. Click "🎬 Embed Video"

### Method 2: Direct IMDB ID
1. Select "🎯 Direct IMDB ID"
2. Choose "Movie" or "TV Show" 
3. For TV shows, set season and episode numbers
4. Enter the IMDB ID (format: tt1234567)
5. Click "🎬 Embed Video"

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Vidsrc API** - Video embedding service
- **OMDb API** - Movie/TV show metadata and search
- **CSS3** - Modern styling with backdrop filters and animations

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Popular IMDB IDs

### Movies
- `tt0111161` - The Shawshank Redemption
- `tt0068646` - The Godfather  
- `tt0468569` - The Dark Knight
- `tt0167260` - The Lord of the Rings: The Return of the King

### TV Shows
- `tt0944947` - Game of Thrones
- `tt0903747` - Breaking Bad
- `tt2560140` - Attack on Titan
- `tt0386676` - The Office

## API Integration

This app integrates with:
- **Vidsrc.xyz** - For video embedding (no API key required)
- **OMDb API** - For title search and metadata (free tier)

## Disclaimer

This application does not host any video content. It simply provides embedded players that redirect to external sources. All content is provided by third-party services.

## Development

The app is built with modern web standards and follows React best practices:
- Functional components with hooks
- Responsive CSS Grid and Flexbox
- Error handling and loading states
- Clean, maintainable code structure

---

⚡ **Powered by Vidsrc**
