import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', 6);

export function createSlug(displayName: string): string {
  const base = displayName
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 20);

  return `${base || 'surprise'}-${nanoid()}`;
}
