import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TIMEOUT_MS = 5000; // 5 seconds timeout

// Mock data for fallback
const MOCK_RESPONSE = {
  results: [
    {
      id: 1,
      title: "API Fallback Movie",
      poster_path: null,
      backdrop_path: null,
      vote_average: 8.5,
      overview: "This is a fallback response when the TMDB API is unavailable.",
      release_date: "2023-01-01",
      genre_ids: [28, 12, 878]
    }
  ],
  page: 1,
  total_pages: 1,
  total_results: 1
};

// Helper function to fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number) {
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

export async function GET(request: NextRequest) {
  try {
    // Validate API key
    if (!TMDB_API_KEY) {
      console.warn('TMDB API key is not configured');
      return NextResponse.json(MOCK_RESPONSE, { status: 200 });
    }

    // Get endpoint and params from the request
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint') || 'movie/popular';
    
    // Create a new URL with the required parameters
    const url = new URL(`${TMDB_BASE_URL}/${endpoint}`);
    
    // Add API key to the URL
    url.searchParams.append('api_key', TMDB_API_KEY);
    
    // Add other search params from the request
    searchParams.forEach((value, key) => {
      if (key !== 'endpoint') {
        url.searchParams.append(key, value);
      }
    });

    console.log('Proxy request to:', url.toString());
    
    // Make the fetch request to TMDB API with timeout
    const response = await fetchWithTimeout(
      url.toString(), 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      },
      TIMEOUT_MS
    );
    
    // Check if response is OK
    if (!response.ok) {
      // Try to get error details from response
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.status_message || `Error: ${response.status}`;
        console.error('TMDB API error:', errorMessage);
      } catch (e) {
        errorMessage = `TMDB API error: ${response.status}`;
        console.error(errorMessage);
      }
      
      // Return mock data on error but with success status code
      return NextResponse.json(MOCK_RESPONSE, { status: 200 });
    }
    
    // Get the response data
    const data = await response.json();
    
    // Return the response
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      }
    });
  } catch (error) {
    console.error('API route error:', error);
    // Return mock data on error
    return NextResponse.json(MOCK_RESPONSE, { status: 200 });
  }
} 