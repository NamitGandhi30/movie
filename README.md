# Movie Explorer

A modern, responsive movie browsing application built with Next.js 14, React, and powered by The Movie Database (TMDB) API. Movie Explorer allows users to discover, browse, and save their favorite movies with a beautiful and intuitive interface.

## Features

### Movie Discovery
- **Popular Movies**: Browse the most popular movies with infinite scroll pagination
- **Top Rated Movies**: Discover critically acclaimed films
- **Genre-based Browsing**: Explore movies by specific genres
- **Search Functionality**: Find movies by title, actors, or keywords
- **Similar Movies**: View similar movie recommendations

### Movie Details
- **Comprehensive Details**: View complete information about each movie including synopsis, runtime, release date, and rating
- **Movie Trailers**: Watch trailers directly within the application (embedded YouTube player)
- **Movie Images**: High-quality poster and backdrop images
- **Cast Information**: View the main cast of each movie

### User Features
- **Favorites**: Add movies to your favorites collection for quick access
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between dark and light mode for comfortable viewing
- **Personalized Recommendations**: Get movie recommendations based on your favorites

### Technical Features
- **Server-Side Rendering**: Fast initial page loads with Next.js
- **Client-Side Navigation**: Smooth transitions between pages
- **API Caching**: Efficient data loading with built-in caching
- **Offline Support**: Basic functionality when offline with mock data
- **Responsive Images**: Optimized images for different device sizes
- **Accessibility**: ARIA compliant for better screen reader support

## Technologies Used

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Context API, localStorage for persistence
- **Data Fetching**: Native fetch with custom retry logic, server components
- **Animation**: CSS animations, react transitions
- **API**: The Movie Database (TMDB) API

## Getting Started

### Prerequisites
- Node.js 18.17 or later
- TMDB API key (get one at [themoviedb.org](https://developers.themoviedb.org/3/getting-started/introduction))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/movie-explorer.git
cd movie-explorer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your TMDB API key:
```
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/app`: Page components and routing
- `/components`: Reusable UI components
- `/context`: React context for global state (auth, favorites, etc.)
- `/lib`: Utility functions, API client, types
- `/public`: Static assets
- `/styles`: Global styles and theme configuration

## Key Components

- **MovieCard**: Displays movie poster with hover effects and rating
- **MovieDetails**: Comprehensive view of a single movie
- **ScrollableMovieList**: Horizontal scrolling list of movies
- **GenreSortWrapper**: Wrapper for genre-based movie browsing with sorting options
- **MovieTrailer**: YouTube video player for movie trailers
- **FavoritesProvider**: Context provider for managing favorite movies

## Deployment

The application can be easily deployed to Vercel, Netlify, or any other platform that supports Next.js.

```bash
npm run build
```

## Credits

- Movie data provided by [The Movie Database (TMDB)](https://www.themoviedb.org)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
