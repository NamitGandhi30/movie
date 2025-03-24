import { Suspense } from "react";
import Link from "next/link";
import { getGenres, getMoviesByGenre } from "@/lib/tmdb";
import { MovieCard } from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MovieGridSkeleton } from "@/components/ui/movie-grid-skeleton";
import { ArrowLeftIcon } from "lucide-react";
import { GenreSortWrapper } from "./genre-sort-wrapper";
import { notFound } from "next/navigation";

// Set revalidation for ISR (6 hours)
export const revalidate = 21600;

interface GenrePageProps {
  params: {
    id: string;
  };
  searchParams: {
    page?: string;
    sort?: string;
  };
}

export async function generateMetadata({ params }: GenrePageProps) {
  try {
    const genreId = parseInt(params.id, 10);
    const { genres } = await getGenres();
    const genre = genres.find(g => g.id === genreId);
    
    if (!genre) {
      return {
        title: "Genre Not Found | Movie Explorer",
        description: "Sorry, we couldn't find this genre."
      };
    }
    
    return {
      title: `${genre.name} Movies | Movie Explorer`,
      description: `Browse the best ${genre.name} movies on Movie Explorer`
    };
  } catch (error) {
    console.error("Error generating metadata for genre page:", error);
    return {
      title: "Movies by Genre | Movie Explorer",
      description: "Browse movies by genre on Movie Explorer"
    };
  }
}

export default async function GenrePage({ params, searchParams }: GenrePageProps) {
  try {
    const genreId = parseInt(params.id, 10);
    const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
    const sort = searchParams.sort || "popularity.desc";
    
    // Verify this genre exists
    const { genres } = await getGenres();
    const genre = genres.find(g => g.id === genreId);
    
    if (!genre) {
      notFound();
    }
    
    return (
      <div className="container py-8">
        <Link href="/genres" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to genres
        </Link>
        
        <Suspense fallback={<GenreDetailsSkeleton />}>
          <GenreDetails genreId={genreId} />
        </Suspense>
        
        <GenreSortWrapper genreId={genreId} initialPage={page} initialSort={sort} />
      </div>
    );
  } catch (error) {
    console.error("Error rendering genre page:", error);
    notFound();
  }
}

async function GenreDetails({ genreId }: { genreId: number }) {
  try {
    const { genres } = await getGenres();
    const genre = genres.find(g => g.id === genreId);
    
    if (!genre) {
      return <h1 className="text-3xl font-bold mb-8">Genre not found</h1>;
    }
    
    return (
      <h1 className="text-3xl font-bold mb-8">{genre.name} Movies</h1>
    );
  } catch (error) {
    console.error("Error loading genre details:", error);
    return <h1 className="text-3xl font-bold mb-8">Movie Genre</h1>;
  }
}

async function MovieGrid({ 
  genreId, 
  page, 
  sort 
}: { 
  genreId: number;
  page: number;
  sort: string;
}) {
  const data = await getMoviesByGenre(genreId, page, sort);
  const movies = data.results;
  const totalPages = Math.min(data.total_pages, 500); // TMDB API limits to 500 pages
  
  if (movies.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg bg-muted/30">
        <p className="text-muted-foreground mb-4">No movies found for this genre.</p>
        <Link href="/genres">
          <Button>View All Genres</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          {page > 1 && (
            <Link href={`/genres/${genreId}?page=${page - 1}&sort=${sort}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          
          <div className="flex items-center gap-2">
            {page > 2 && (
              <>
                <Link href={`/genres/${genreId}?page=1&sort=${sort}`}>
                  <Button variant="outline">1</Button>
                </Link>
                {page > 3 && <span className="text-muted-foreground">...</span>}
              </>
            )}
            
            {page > 1 && (
              <Link href={`/genres/${genreId}?page=${page - 1}&sort=${sort}`}>
                <Button variant="outline">{page - 1}</Button>
              </Link>
            )}
            
            <Button variant="default" disabled>{page}</Button>
            
            {page < totalPages && (
              <Link href={`/genres/${genreId}?page=${page + 1}&sort=${sort}`}>
                <Button variant="outline">{page + 1}</Button>
              </Link>
            )}
            
            {page < totalPages - 1 && (
              <>
                {page < totalPages - 2 && <span className="text-muted-foreground">...</span>}
                <Link href={`/genres/${genreId}?page=${totalPages}&sort=${sort}`}>
                  <Button variant="outline">{totalPages}</Button>
                </Link>
              </>
            )}
          </div>
          
          {page < totalPages && (
            <Link href={`/genres/${genreId}?page=${page + 1}&sort=${sort}`}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </>
  );
}

function GenreDetailsSkeleton() {
  return <Skeleton className="h-10 w-64 mb-8" />;
} 