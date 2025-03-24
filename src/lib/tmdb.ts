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

// Improved fetch with better retry logic and proxy fallback for ECONNRESET errors
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 1000): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Add a timeout to prevent long-hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      console.error(`Fetch attempt ${attempt + 1}/${retries} failed:`, error);
      
      const isLastAttempt = attempt === retries - 1;
      if (isLastAttempt) {
        console.log('All direct API attempts failed, trying proxy API...');
        
        // As a last resort, try using the proxy API
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
            }
          });
        } catch (proxyErr) {
          console.error('Proxy API request also failed:', proxyErr);
          // If proxy also fails, throw the original error
          throw error;
        }
      }
      
      // Wait before next retry (exponential backoff)
      const backoffTime = delay * Math.pow(2, attempt);
      console.log(`Retrying in ${backoffTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }
  
  // This should never be reached due to the throw in the catch block above
  throw new Error('All fetch attempts failed');
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

// Example mock data for development
export const MOCK_MOVIES: Movie[] = [
  {
    id: 1,
    title: 'Sample Movie 1',
    poster_path: '/sample-poster1.jpg',
    backdrop_path: '/sample-backdrop1.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    overview: 'This is a sample movie for development purposes.',
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

export const MOCK_MOVIE_DETAILS: MovieDetails = {
  id: 1,
  title: 'Sample Movie Details',
  poster_path: '/sample-poster-details.jpg',
  backdrop_path: '/sample-backdrop-details.jpg',
  release_date: '2023-01-01',
  vote_average: 8.5,
  overview: 'This is a sample movie details for development purposes.',
  genre_ids: [28, 12, 878],
  genres: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 878, name: 'Science Fiction' }
  ],
  runtime: 120,
  status: "Released",
  tagline: "A sample tagline",
  vote_count: 1000
};

export const mockMoviesResponse = {
  page: 1,
  results: MOCK_MOVIES,
  total_pages: 10,
  total_results: 60
};

export const MOCK_GENRES = {
  genres: [
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
  ]
};

export async function getGenres(): Promise<GenresResponse> {
  // Check if API key is available
  if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
    console.warn("TMDB API key not found. Using mock data.");
    return { genres: MOCK_GENRES.genres };
  }

  try {
    // Fetch genres from TMDB API
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
    );

    if (!response.ok) {
      console.error("Failed to fetch genres from TMDB API:", response.statusText);
      return { genres: MOCK_GENRES.genres };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching genres:", error);
    // Return mock data as fallback
    return { genres: MOCK_GENRES.genres };
  }
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

/**
 * Get movies by genre ID with optional sorting
 * @param genreId The genre ID to filter by
 * @param page The page number to fetch (default: 1)
 * @param sortBy The sorting method (default: popularity.desc)
 * @returns A Promise resolving to the movie response
 */
export async function getMoviesByGenre(genreId: number, page = 1, sortBy = 'popularity.desc') {
  const hasApiKey = validateApiKey();
  
  if (!hasApiKey) {
    // Return mock data if no API key
    return mockMoviesResponse;
  }
  
  const url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}&sort_by=${sortBy}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_API_KEY}`
    }
  };

  try {
    console.log(`Fetching movies for genre ${genreId}, page ${page}`);
    const response = await fetchWithRetry(url, options);
    
    if (!response.ok) {
      console.error(`TMDB API error: ${response.status} - ${response.statusText}`);
      // Return mock data on error
      return mockMoviesResponse;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching movies by genre:`, error);
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
    }
  };

  try {
    console.log('Fetching from URL:', url);
    const response = await fetchWithRetry(url, options);
    
    if (!response.ok) {
      console.error(`TMDB API error: ${response.status} - ${response.statusText}`);
      
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
  if (!path) {
    // Return a data URI for a simple gray placeholder
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'%3E%3Crect width='100%25' height='100%25' fill='%23333333'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23ffffff'%3ENo Image%3C/text%3E%3C/svg%3E";
  }
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

/**
 * Get a genre by ID
 * @param id The ID of the genre to get
 * @returns The genre or null if not found
 */
export async function getGenreById(id: number): Promise<Genre | null> {
  try {
    const { genres } = await getGenres();
    return genres.find(genre => genre.id === id) || null;
  } catch (error) {
    console.error(`Error getting genre with ID ${id}:`, error);
    return null;
  }
}