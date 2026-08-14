import type { TemplateDefinition } from '@/types/template';
import type { TemplateTier } from '@/types/order';
import Tier1Template from '@/components/templates/Tier1Template';
import Tier2Template from '@/components/templates/Tier2Template';

/**
 * Adding Tier 3 later means: write Tier3Template.tsx, add one entry here.
 * Nothing in the live-page route, the builder, or OrderService needs to
 * change — that's the Open/Closed principle in practice.
 */
const registry: Record<TemplateTier, TemplateDefinition> = {
  tier1: {
    tier: 'tier1',
    label: 'Tier 1 — Simple Wish',
    priceInPaise: 9900,
    Component: Tier1Template,
  },
  tier2: {
    tier: 'tier2',
    label: 'Tier 2 — Memory Lane',
    priceInPaise: 19900,
    Component: Tier2Template,
  },
  // tier3, tier4 slot in here when built.
} as Record<TemplateTier, TemplateDefinition>;

export function getTemplateDefinition(tier: TemplateTier): TemplateDefinition {
  const def = registry[tier];
  if (!def) throw new Error(`No template registered for tier "${tier}"`);
  return def;
}

export function listAvailableTemplates(): TemplateDefinition[] {
  return Object.values(registry);
}
