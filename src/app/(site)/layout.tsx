import Nav from '@/components/Nav';
import { fontVariables } from '@/components/marketing/typography';

/**
 * The font-variable wrapper lives here (not just on the landing page) so the
 * shared Nav can render its wordmark in the same Fraunces serif the landing
 * page uses. Only elements that opt into `var(--font-fraunces)` pick it up, so
 * the paper-themed builder/terms pages are visually unaffected.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={fontVariables}>
      <Nav />
      {children}
    </div>
  );
}
