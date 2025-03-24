// TMDB API utilities

export const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Validate if API key is available
const validateApiKey = () => {
  if (!TMDB_API_KEY) {
    console.warn('TMDB API key is not configured. Using mock data.');
    return false;
  }
  return true;
};

// Promise-based setTimeout for use in retry logic
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch with retry mechanism
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, backoff = 300) {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (retries <= 1) {
      console.log('All retries failed, attempting to use proxy API...');
      
      // Try using the proxy API as a fallback
      try {
        // Extract the endpoint and query params from the original URL
        const originalUrl = new URL(url);
        const path = originalUrl.pathname.replace('/3/', '');
        
        // Build the proxy URL - detect if we're in browser or server
        const isClient = typeof window !== 'undefined';
        const baseUrl = isClient 
          ? window.location.origin 
          : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
          
        const proxyUrl = new URL('/api/tmdb', baseUrl);
        proxyUrl.searchParams.append('endpoint', path);
        
        // Add all original query params except api_key (it's added server-side)
        originalUrl.searchParams.forEach((value, key) => {
          if (key !== 'api_key') {
            proxyUrl.searchParams.append(key, value);
          }
        });
        
        console.log('Attempting proxy request to:', proxyUrl.toString());
        
        // Make the proxy request
        return await fetch(proxyUrl.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store' // Don't cache fallback requests
        });
      } catch (proxyErr) {
        console.error('Proxy API request also failed:', proxyErr);
        throw err; // Throw the original error
      }
    }
    
    console.log(`Fetch failed, retrying in ${backoff}ms... (${retries-1} retries left)`);
    
    // Use standard setTimeout via Promise
    await delay(backoff);
    
    return fetchWithRetry(url, options, retries - 1, backoff * 2);
  }
}

export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  release_date: string;
  genre_ids: number[];
};

export type MovieDetails = Movie & {
  genres: { id: number; name: string }[];
  runtime: number;
  status: string;
  tagline: string;
  vote_count: number;
};

export interface Genre {
  id: number;
  name: string;
}

export interface GenresResponse {
  genres: Genre[];
}

// Mock data for fallback when API fails
const MOCK_MOVIES: Movie[] = [
  {
    id: 1,
    title: "Sample Movie 1",
    poster_path: null,
    backdrop_path: null,
    vote_average: 8.5,
    overview: "This is a sample movie description for when the API is unavailable.",
    release_date: "2023-01-01",
    genre_ids: [28, 12, 878]
  },
  {
    id: 2,
    title: "Sample Movie 2",
    poster_path: null,
    backdrop_path: null,
    vote_average: 7.8,
    overview: "Another sample movie description for fallback purposes.",
    release_date: "2023-02-15",
    genre_ids: [18, 53]
  }
];

const MOCK_MOVIE_DETAILS: MovieDetails = {
  id: 1,
  title: "Sample Movie Details",
  poster_path: null,
  backdrop_path: null,
  vote_average: 8.5,
  overview: "This is a sample movie details for when the API is unavailable.",
  release_date: "2023-01-01",
  genre_ids: [28, 12, 878],
  genres: [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 878, name: "Science Fiction" }
  ],
  runtime: 120,
  status: "Released",
  tagline: "A sample tagline",
  vote_count: 1000
};

const MOCK_GENRES: Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

export async function getGenres(): Promise<GenresResponse> {
  // Check if API key is available
  if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
    console.warn("TMDB API key not found. Using mock data.");
    return { genres: MOCK_GENRES };
  }

  try {
    // Fetch genres from TMDB API
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
    );

    if (!response.ok) {
      console.error("Failed to fetch genres from TMDB API:", response.statusText);
      return { genres: MOCK_GENRES };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching genres:", error);
    // Return mock data as fallback
    return { genres: MOCK_GENRES };
  }
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// Create mock movies response for fallback
const mockMoviesResponse: MoviesResponse = {
  page: 1,
  results: MOCK_MOVIES,
  total_pages: 1,
  total_results: MOCK_MOVIES.length
};

/**
 * Get movies by genre ID with optional sorting
 * @param genreId The genre ID to filter by
 * @param page The page number to fetch (default: 1)
 * @param sortBy The sorting method (default: popularity.desc)
 * @returns A Promise resolving to the movie response
 */
export async function getMoviesByGenre(
  genreId: number,
  page: number = 1,
  sortBy: string = "popularity.desc"
): Promise<MoviesResponse> {
  // Check if API key is available
  if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
    console.warn("TMDB API key not found. Using mock data.");
    return mockMoviesResponse;
  }

  try {
    // Construct API URL with genre filter and sorting
    const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${
      process.env.NEXT_PUBLIC_TMDB_API_KEY
    }&language=en-US&with_genres=${genreId}&page=${page}&sort_by=${sortBy}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error("Failed to fetch movies by genre:", response.statusText);
      return mockMoviesResponse;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
    // Return mock data as fallback
    return mockMoviesResponse;
  }
}

export async function getPopularMovies(page = 1) {
  const hasApiKey = validateApiKey();
  
  if (!hasApiKey) {
    // Return mock data if no API key
    return {
      results: MOCK_MOVIES,
      page: 1,
      total_pages: 1,
      total_results: MOCK_MOVIES.length
    };
  }
  
  const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_API_KEY}`
    },
    next: { revalidate: 3600 }
  };

  try {
    console.log('Fetching from URL:', url);
    const response = await fetchWithRetry(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TMDB API error: ${response.status} - ${errorText}`);
      
      // Return mock data on error
      return {
        results: MOCK_MOVIES,
        page: 1,
        total_pages: 1,
        total_results: MOCK_MOVIES.length
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    
    // Return mock data on error
    return {
      results: MOCK_MOVIES,
      page: 1,
      total_pages: 1,
      total_results: MOCK_MOVIES.length
    };
  }
}

export async function getTopRatedMovies(page = 1) {
  const hasApiKey = validateApiKey();
  
  if (!hasApiKey) {
    // Return mock data if no API key
    return {
      results: MOCK_MOVIES,
      page: 1,
      total_pages: 1,
      total_results: MOCK_MOVIES.length
    };
  }
  
  const url = `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_API_KEY}`
    },
    next: { revalidate: 3600 }
  };

  try {
    const response = await fetchWithRetry(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TMDB API error: ${response.status} - ${errorText}`);
      
      // Return mock data on error
      return {
        results: MOCK_MOVIES,
        page: 1,
        total_pages: 1,
        total_results: MOCK_MOVIES.length
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    
    // Return mock data on error
    return {
      results: MOCK_MOVIES,
      page: 1,
      total_pages: 1,
      total_results: MOCK_MOVIES.length
    };
  }
}

export async function getMovieDetails(id: number) {
  const hasApiKey = validateApiKey();
  
  if (!hasApiKey) {
    // Return mock data if no API key
    return { ...MOCK_MOVIE_DETAILS, id };
  }
  
  const url = `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_API_KEY}`
    },
    next: { revalidate: 3600 }
  };

  try {
    const response = await fetchWithRetry(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TMDB API error: ${response.status} - ${errorText}`);
      
      // Return mock movie details with the requested ID
      return { ...MOCK_MOVIE_DETAILS, id };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error);
    
    // Return mock movie details with the requested ID
    return { ...MOCK_MOVIE_DETAILS, id };
  }
}

export async function searchMovies(query: string, page = 1) {
  const hasApiKey = validateApiKey();
  
  if (!hasApiKey) {
    // Return mock data if no API key
    return {
      results: MOCK_MOVIES,
      page: 1,
      total_pages: 1,
      total_results: MOCK_MOVIES.length
    };
  }
  
  const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
  
  // Modified to be compatible with Next.js fetch API
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_API_KEY}`
    },
    next: { revalidate: 60, tags: ['search'] }
  };

  try {
    // Use no-store option in a way compatible with Next.js fetch
    const response = await fetchWithRetry(url, { ...options, cache: 'no-store' });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TMDB API error: ${response.status} - ${errorText}`);
      
      // Return mock data on error with query in the title
      return {
        results: MOCK_MOVIES.map(movie => ({
          ...movie,
          title: `${movie.title} (${query})`
        })),
        page: 1,
        total_pages: 1,
        total_results: MOCK_MOVIES.length
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    
    // Return mock data on error with query in the title
    return {
      results: MOCK_MOVIES.map(movie => ({
        ...movie,
        title: `${movie.title} (${query})`
      })),
      page: 1,
      total_pages: 1,
      total_results: MOCK_MOVIES.length
    };
  }
}

export function getImageUrl(path: string | null, size: string = 'w500') {
  if (!path) return '/placeholder-image.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export async function getMovieVideos(id: number) {
  const hasApiKey = validateApiKey();
  
  if (!hasApiKey) {
    // Return mock data if no API key
    return {
      results: [
        {
          id: "mock-video-1",
          key: "dQw4w9WgXcQ", // Example YouTube video key
          name: "Mock Trailer",
          site: "YouTube",
          type: "Trailer",
          official: true,
          published_at: "2023-01-01T00:00:00.000Z"
        }
      ]
    };
  }
  
  const url = `${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_API_KEY}`
    },
    next: { revalidate: 3600 }
  };

  try {
    const response = await fetchWithRetry(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TMDB API error: ${response.status} - ${errorText}`);
      
      // Return mock video data on error
      return {
        results: [
          {
            id: "mock-video-1",
            key: "dQw4w9WgXcQ",
            name: "Mock Trailer",
            site: "YouTube",
            type: "Trailer",
            official: true,
            published_at: "2023-01-01T00:00:00.000Z"
          }
        ]
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching movie videos for ID ${id}:`, error);
    
    // Return mock video data on error
    return {
      results: [
        {
          id: "mock-video-1",
          key: "dQw4w9WgXcQ",
          name: "Mock Trailer",
          site: "YouTube",
          type: "Trailer",
          official: true,
          published_at: "2023-01-01T00:00:00.000Z"
        }
      ]
    };
  }
}

export async function getSimilarMovies(id: number, page = 1) {
  const hasApiKey = validateApiKey();
  
  if (!hasApiKey) {
    // Return mock data if no API key
    return {
      results: MOCK_MOVIES,
      page: 1,
      total_pages: 1,
      total_results: MOCK_MOVIES.length
    };
  }
  
  const url = `${TMDB_BASE_URL}/movie/${id}/similar?api_key=${TMDB_API_KEY}&page=${page}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_API_KEY}`
    },
    next: { revalidate: 3600 }
  };

  try {
    const response = await fetchWithRetry(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TMDB API error: ${response.status} - ${errorText}`);
      
      // Return mock data on error
      return {
        results: MOCK_MOVIES,
        page: 1,
        total_pages: 1,
        total_results: MOCK_MOVIES.length
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching similar movies for ID ${id}:`, error);
    
    // Return mock data on error
    return {
      results: MOCK_MOVIES,
      page: 1,
      total_pages: 1,
      total_results: MOCK_MOVIES.length
    };
  }
}