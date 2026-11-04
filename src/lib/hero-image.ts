import avif768 from '../assets/atlas/earth-atlas-768.avif';
import avif1023 from '../assets/atlas/earth-atlas-1023.avif';
import avif1536 from '../assets/atlas/earth-atlas-1536.avif';
import webp768 from '../assets/atlas/earth-atlas-768.webp';
import webp1023 from '../assets/atlas/earth-atlas-1023.webp';

// Match the existing object-fit:cover geometry, including the part cropped
// outside the viewport. This retains enough pixels for high-density displays.
export const heroSizes = '(max-width: 540px) 548px, (max-width: 800px) 720px, 1005px';
export const heroAvifSrcSet = `${avif768.src} 768w, ${avif1023.src} 1023w, ${avif1536.src} 1536w`;
export const heroWebpSrcSet = `${webp768.src} 768w, ${webp1023.src} 1023w, /design/earth-atlas.webp 1536w`;
export const heroPreload = avif1023.src;
