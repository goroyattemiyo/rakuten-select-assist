export type GenreOption = {
  id: number;
  name: string;
};

export const genreCatalog: GenreOption[] = [
  { id: 100371, name: 'レディースファッション' },
  { id: 100533, name: 'キッズ・ベビー・マタニティ' },
  { id: 100939, name: '美容・コスメ・香水' },
  { id: 100227, name: '食品' },
  { id: 215783, name: '日用品雑貨・文房具・手芸' },
];

export function getGenreNameById(genreId?: number): string {
  if (!genreId) return '';
  return genreCatalog.find((genre) => genre.id === genreId)?.name ?? '';
}
