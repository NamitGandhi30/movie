import { getGenreById } from "@/lib/tmdb";
import { GenreSortWrapper } from "./genre-sort-wrapper";
import { notFound } from "next/navigation";

// Set revalidation for ISR (6 hours)
export const revalidate = 21600;

interface GenrePageProps {
  params: { id: string };
  searchParams: { page?: string; sort?: string };
}

export async function generateMetadata({ params }: GenrePageProps) {
  try {
    const genreId = parseInt(params.id, 10);
    const genre = await getGenreById(genreId);
    
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

export default async function GenrePage({
  params,
  searchParams,
}: GenrePageProps) {
  // Get genre ID from params
  const genreId = parseInt(params.id);

  if (isNaN(genreId)) {
    return notFound();
  }

  // Get genre details
  const genre = await getGenreById(genreId);
  
  if (!genre || !genre.name) {
    return notFound();
  }

  // Get page from query params or default to 1
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  
  // Get sort option from query params or default to popularity.desc
  const sort = searchParams.sort || "popularity.desc";

  return (
    <div className="min-h-screen">
      <GenreSortWrapper 
        genreId={genreId} 
        genreName={genre.name}
        initialPage={page} 
        initialSort={sort} 
      />
    </div>
  );
} 