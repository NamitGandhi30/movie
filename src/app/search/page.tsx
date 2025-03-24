"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/movie-card";
import { searchMovies } from "@/lib/tmdb";
import { SearchIcon } from "lucide-react";
import { MovieGridSkeleton } from "@/components/ui/movie-grid-skeleton";
import type { Movie } from "@/lib/tmdb";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const pageParam = searchParams.get("page") || "1";
  
  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(Number(pageParam));

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const data = await searchMovies(query, page);
      setResults(data);
      router.push(`/search?q=${encodeURIComponent(query)}&page=${page}`);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryParam) {
      handleSearch();
    }
  }, []);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    router.push(`/search?q=${encodeURIComponent(query)}&page=${newPage}`);
    window.scrollTo(0, 0);
    handleSearch();
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Search Movies</h1>
      
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <Input
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md"
        />
        <Button type="submit" disabled={loading}>
          <SearchIcon className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      {loading && <MovieGridSkeleton count={10} />}

      {results && !loading && (
        <>
          <p className="mb-4 text-muted-foreground">
            Found {results.total_results} results for "{queryParam}"
          </p>
          
          {results.results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {results.results.map((movie: Movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              No movies found matching your search.
            </div>
          )}

          {results.total_pages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {page > 1 && (
                <Button 
                  variant="outline" 
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </Button>
              )}
              <span className="px-4 py-2 border rounded bg-primary text-primary-foreground">
                {page}
              </span>
              {page < results.total_pages && (
                <Button 
                  variant="outline" 
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}