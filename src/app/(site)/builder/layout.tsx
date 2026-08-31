import '../landing.css';
import { FallingLeaves } from '@/features/marketing/components/effects/FallingLeaves';

/**
 * Layout for the four builder/dashboard pages (Simple Wish, Memory Lane,
 * Time Capsule, White Glove).
 *
 * They now share the landing page's autumn/painterly look instead of the old
 * light "paper" chrome, so this route segment imports the same stylesheet and
 * wraps every builder in the `.sp-landing` theme scope with the ambient
 * falling-leaves layer — exactly like the (brand) pages do. The dark product
 * preview inside each builder deliberately stays near-black: it renders the
 * real delivered gift page, which is a separate, intentional surface.
 *
 * The shared Nav (from the parent (site) layout) switches to autumn chrome on
 * these routes via its own `/builder` pathname check.
 */
export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sp-landing">
      <FallingLeaves />
      {children}
    </div>
  );
}
