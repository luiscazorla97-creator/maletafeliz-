import { route } from './routes';
import type { Locale } from '../i18n';
export type Photo = {
  variants?: { src: string; width: number; height: number; sha256: string }[];
  destinationIds: string[];
  id: string;
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
  credit: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  verifiedAt: string;
  sha256: string;
};
export type Section = {
  kind: 'place' | 'practical';
  id: string;
  heading: string;
  paragraphs: string[];
  sourceIds: string[];
  imageId?: string;
};
export type Article = {
  id: string;
  destinationId: string;
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  keyword: string;
  relatedQueries: string[];
  intent: string;
  status: 'draft' | 'review' | 'published';
  publishedAt?: string;
  updatedAt?: string;
  coverImageId: string;
  intro: string[];
  quickFacts: { label: string; value: string }[];
  sections: Section[];
  itinerary: string[];
  faq: { question: string; answer: string }[];
  conclusion: string;
  sources: {
    id: string;
    url: string;
    title: string;
    accessedAt: string;
    evidenceFile: string;
  }[];
  relatedIds: string[];
};
const modules = import.meta.glob('../../content/articles/*.json', {
  eager: true,
  import: 'default',
});
export const articles = Object.values(modules) as Article[];
export const publishedArticles = articles.filter(
  (a) => a.status === 'published',
);
export const forLocale = (lang: Locale) =>
  publishedArticles.filter((a) => a.locale === lang);
export const articlePath = (a: Article) => route(a.locale, 'guides', a.slug);
export const translatedArticle = (a: Article, lang: Locale) =>
  publishedArticles.find((b) => b.id === a.id && b.locale === lang);
import manifest from '../../content/images/manifest.json';
export const photos = manifest as Photo[];
export const photoFor = (id: string) => photos.find((p) => p.id === id);
export const articleText = (a: Article) =>
  [
    ...a.intro,
    ...a.sections.flatMap((s) => [s.heading, ...s.paragraphs]),
    ...a.itinerary,
    ...a.faq.flatMap((f) => [f.question, f.answer]),
    a.conclusion,
  ].join(' ');

export const photoSrcSet = (photo: Photo) =>
  photo.variants?.map((v) => `${v.src} ${v.width}w`).join(', ');
