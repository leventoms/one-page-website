import type { ComponentType } from 'react';
import type { TemplateConfig, TemplateTier } from './order';

/**
 * Every template tier implements this shape. The live-page route and the
 * preview route depend only on this interface (Dependency Inversion) —
 * they never import Tier1Template/Tier2Template directly.
 */
export interface TemplateProps<TConfig = unknown> {
  config: TConfig;
  /** true when rendering the free preview (placeholder-safe, no paid assets) */
  isPreview?: boolean;
}

export interface TemplateDefinition {
  tier: TemplateTier;
  label: string;
  priceInPaise: number;
  Component: ComponentType<TemplateProps<any>>;
}

export function isTemplateConfigForTier(
  config: TemplateConfig,
  tier: TemplateTier
): boolean {
  return config.tier === tier;
}
