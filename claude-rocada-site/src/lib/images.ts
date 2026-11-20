import type { ImageMetadata } from 'astro';

const photos = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.{jpg,jpeg,png,webp}', {
  eager: true,
});
const coaches = import.meta.glob<{ default: ImageMetadata }>('../assets/coaches/*.{jpg,jpeg,png,webp}', {
  eager: true,
});
const news = import.meta.glob<{ default: ImageMetadata }>('../assets/news/*.{jpg,jpeg,png,webp}', {
  eager: true,
});

function pick(map: Record<string, { default: ImageMetadata }>, dir: string, file: string | undefined) {
  if (!file) return undefined;
  const hit = map[`../assets/${dir}/${file}`];
  if (!hit) throw new Error(`Imaginea "${file}" nu există în src/assets/${dir}/`);
  return hit.default;
}

export const photo = (file?: string) => pick(photos, 'photos', file);
export const coachPhoto = (file?: string) => pick(coaches, 'coaches', file);
export const newsCover = (file?: string) => pick(news, 'news', file);
