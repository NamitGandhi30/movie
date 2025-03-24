import { NextRequest, NextResponse } from 'next/server';
import { MOCK_GENRES, MOCK_MOVIE_DETAILS, mockMoviesResponse } from '@/lib/tmdb';

/**
 * TMDB API proxy route handler
 * This route proxies requests to the TMDB API to avoid exposing the API key to the client
 */

// Request timeout in milliseconds
const TIMEOUT = 8000;

/**
 * Fetch with timeout function
 * @param url URL to fetch
 * @param options Fetch options
 * @param timeout Timeout in milliseconds
 * @returns Promise with response or error
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Get mock data based on the endpoint
 * @param endpoint TMDB API endpoint
 * @returns Mock data for the endpoint
 */
function getMockData(endpoint: string) {
  if (endpoint.includes('/genre/movie/list')) {
    return MOCK_GENRES;
  } else if (endpoint.includes('/movie/') && !endpoint.includes('/popular') && !endpoint.includes('/top_rated')) {
    return MOCK_MOVIE_DETAILS;
  } else {
    return mockMoviesResponse;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  
  // Check if endpoint is provided
  if (!endpoint) {
    return NextResponse.json(
      { error: 'Endpoint parameter is required' },
      { status: 400 }
    );
  }
  
  // Check if API key is available
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    console.warn('TMDB API key not found. Using mock data.');
    return NextResponse.json(getMockData(endpoint));
  }
  
  // Construct TMDB API URL
  const tmdbBaseUrl = 'https://api.themoviedb.org/3';
  const separator = endpoint.includes('?') ? '&' : '?';
  const tmdbUrl = `${tmdbBaseUrl}${endpoint}${separator}api_key=${apiKey}`;
  
  try {
    // Fetch data from TMDB API with timeout
    const response = await fetchWithTimeout(tmdbUrl);
    
    if (!response.ok) {
      console.error(`TMDB API error: ${response.status} - ${response.statusText}`);
      return NextResponse.json(
        getMockData(endpoint),
        { status: 200 }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data from TMDB API:', error);
    
    // Return mock data with 200 status to keep the app functioning
    return NextResponse.json(
      getMockData(endpoint),
      { status: 200 }
    );
  }
}