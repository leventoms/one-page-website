import type { TemplateDefinition } from '@/types';
import type { TemplateTier } from '@/types';
import Tier1Template from '@/components/templates/Tier1Template';
import Tier2Template from '@/components/templates/Tier2Template';
import Tier3Template from '@/components/templates/Tier3Template';

/**
 * Adding a new self-serve tier means: write its Template.tsx, add one entry
 * here. Nothing in the live-page route, the builder, or order module needs
 * to change — that's the Open/Closed principle in practice.
 *
 * Tier 4 is intentionally NOT registered here. Per the original phase plan
 * it's a manual/white-glove tier (custom, handled 1:1) rather than a
 * self-serve template — it's sold on the landing page via a contact link,
 * never through the order/payment pipeline this registry drives.
 */
const registry: Partial<Record<TemplateTier, TemplateDefinition>> = {
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
  tier3: {
    tier: 'tier3',
    label: 'Tier 3 — Time Capsule',
    priceInPaise: 29900,
    Component: Tier3Template,
  },
};

export function getTemplateDefinition(tier: TemplateTier): TemplateDefinition {
  const def = registry[tier];
  if (!def) throw new Error(`No template registered for tier "${tier}"`);
  return def;
}

export function listAvailableTemplates(): TemplateDefinition[] {
  return Object.values(registry);
}
