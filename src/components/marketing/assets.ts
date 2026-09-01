/**
 * Asset helpers. Centralizes the public path for illustrations so the base
 * directory is defined in exactly one place (Single Responsibility) and the
 * content module never hard-codes string prefixes.
 */
import type { ImageAsset } from '@/components/marketing/types';

const ILLUSTRATIONS_BASE = '/illustrations';

/** Build a typed ImageAsset for an illustration in /public/illustrations. */
export function illustration(
  file: string,
  alt: string,
  width: number,
  height: number,
): ImageAsset {
  return { src: `${ILLUSTRATIONS_BASE}/${file}`, alt, width, height };
}
