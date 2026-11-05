import type { Locale } from '../i18n';
import type { Article, Photo } from './content';

export const festiveDisclosure: Record<Locale, string> = {
  es: 'Imagen real con ambientación ilustrativa generada mediante IA',
  en: 'Real photograph with illustrative AI-generated festive enhancements',
};
type EnhancementRecord = {
  imageId: string;
  originalPhotoId: string;
  modifications: { es: string; en: string };
};
const modules = import.meta.glob('../../content/images/enhancements/*.json', {
  eager: true,
  import: 'default',
});
const records = Object.values(modules) as EnhancementRecord[];
export const enhancementFor = (photo: Photo) =>
  records.find((record) => record.imageId === photo.id);
export function festiveCoverFor(
  article: Article,
  photos: Photo[],
  recordFor: typeof enhancementFor = enhancementFor,
) {
  // Omitted flag = false. The documentary original always remains the fallback.
  const original = photos.find((p) => p.id === article.coverImageId);
  if (article.festive_image_enhancement !== true) return original;
  const enhanced = photos.find((p) => p.id === article.festiveCoverImageId);
  return enhanced?.kind === 'festive-ai-illustration' && recordFor(enhanced)
    ? enhanced
    : original;
}
