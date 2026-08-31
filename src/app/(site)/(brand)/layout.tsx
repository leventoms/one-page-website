import '../landing.css';
import { FallingLeaves } from '@/features/marketing/components/effects/FallingLeaves';

/**
 * Layout for the autumn-themed brand pages (About, Contact, Examples).
 *
 * These pages share the landing page's painterly look, so this nested route
 * group imports the same stylesheet once and wraps every brand page in the
 * `.sp-landing` theme scope with the ambient falling-leaves layer. Route groups
 * are invisible to the URL, so pages still resolve at /about, /contact,
 * /examples. The shared Nav and font variables come from the parent (site)
 * layout; the Nav switches to autumn chrome on these routes via its own
 * pathname check.
 */
export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sp-landing">
      <FallingLeaves />
      {children}
    </div>
  );
}
