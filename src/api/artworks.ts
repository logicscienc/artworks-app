// src/api/artworks.ts
import axios from "axios";
// Importing axios to make HTTP requests

// Define a TypeScript interface for an Artwork object
// This helps us know exactly what shape of data each artwork has

export interface Artwork {
  id: number;
  title: string | null;
  place_of_origin: string | null;
  artist_display: string | null;
  inscriptions: string | null;
  date_start: number | null;
  date_end: number | null;
}


// Function to fetch one page of artworks from API
export async function fetchArtworksPage(page: number) {
   // Make GET request to the Art Institute of Chicago API with pagination
  const response = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
  const data = response.data.data;


   // Convert raw API response into an array of Artwork objects
  // Using `map` to loop through each artwork and normalize its structure
  const artworks: Artwork[] = data.map((d: any) => ({
    id: d.id,
    title: d.title ?? null,
    place_of_origin: d.place_of_origin ?? null,
    artist_display: d.artist_display ?? null,
    inscriptions: d.inscriptions ?? null,
    date_start: d.date_start ?? null,
    date_end: d.date_end ?? null,
  }));


  
  // Return both the artworks array and pagination info
  // Pagination is used later to handle next/previous pages
  return {
    artworks,
    pagination: response.data.pagination,
  };
}
