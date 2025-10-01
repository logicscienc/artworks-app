// src/api/artworks.ts
import axios from "axios";

export interface Artwork {
  id: number;
  title: string | null;
  place_of_origin: string | null;
  artist_display: string | null;
  inscriptions: string | null;
  date_start: number | null;
  date_end: number | null;
}

export async function fetchArtworksPage(page: number) {
  const response = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
  const data = response.data.data;

  const artworks: Artwork[] = data.map((d: any) => ({
    id: d.id,
    title: d.title ?? null,
    place_of_origin: d.place_of_origin ?? null,
    artist_display: d.artist_display ?? null,
    inscriptions: d.inscriptions ?? null,
    date_start: d.date_start ?? null,
    date_end: d.date_end ?? null,
  }));

  return {
    artworks,
    pagination: response.data.pagination,
  };
}
