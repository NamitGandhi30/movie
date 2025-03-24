import { getPopularMovies } from "@/lib/tmdb";
import { MovieCard } from "@/components/movie-card";
import { Suspense } from "react";
import { MovieGridSkeleton } from "@/components/ui/movie-grid-skeleton";
import type { Movie } from "@/lib/tmdb";

export default function MoviesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Movies</h1>
      
      <Suspense fallback={<MovieGridSkeleton count={15} />}>
        <MovieGrid page={page} />
      </Suspense>
    </div>
  );
}

async function MovieGrid({ page }: { page: number }) {
  const movies = await getPopularMovies(page);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {movies.results.map((movie: Movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-2">
        {page > 1 && (
          <a
            href={`/movies?page=${page - 1}`}
            className="px-4 py-2 border rounded hover:bg-secondary transition-colors"
          >
            Previous
          </a>
        )}
        <span className="px-4 py-2 border rounded bg-primary text-primary-foreground">
          {page}
        </span>
        {page < movies.total_pages && (
          <a
            href={`/movies?page=${page + 1}`}
            className="px-4 py-2 border rounded hover:bg-secondary transition-colors"
          >
            Next
          </a>
        )}
      </div>
    </>
  );
}