import '../landing.css';
import { FallingLeaves } from '@/components/marketing/effects/FallingLeaves';

/**
 * Layout for autumn-themed public pages and builders.
 *
 * These pages share the landing page's painterly look, so this nested route
 * group imports the same stylesheet once and wraps every brand page in the
 * `.sp-landing` theme scope with the ambient falling-leaves layer. This route
 * group is invisible to the URL, so pages still resolve at /about, /contact,
 * /examples, and /builder. The shared Nav and font variables come from the
 * parent (site) layout; the Nav switches to autumn chrome from its pathname.
 */
export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sp-landing">
      <FallingLeaves />
      {children}
    </div>
  );
}
