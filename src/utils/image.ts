// src/utils/image.ts
const FALLBACK = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400';

export const getImageUrl = (path?: string) => {
    if (!path) return FALLBACK;

    if (path.startsWith('http')) return path;
    return `https://le-minh-thanh.onrender.com${path}`;
};