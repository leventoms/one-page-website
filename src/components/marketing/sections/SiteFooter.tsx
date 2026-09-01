import Link from 'next/link';
import type { BrandContent, FooterColumn, FooterContent } from '@/components/marketing/types';

function Column({ column }: { column: FooterColumn }) {
  return (
    <div>
      <h4>{column.heading}</h4>
      {column.links.map((link) =>
        link.external ? (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ) : (
          <Link key={link.label} href={link.href}>
            {link.label}
          </Link>
        ),
      )}
    </div>
  );
}

interface SiteFooterProps {
  brand: BrandContent;
  footer: FooterContent;
}

/**
 * Site footer. Delete this component from the page if the (site) layout
 * already renders a footer.
 */
export function SiteFooter({ brand, footer }: SiteFooterProps) {
  return (
    <footer className="sp-footer">
      <div className="sp-wrap">
        <div className="sp-foot-grid">
          <div>
            <div className="sp-foot-brand">
              <span
                style={{
                  width: 12,
                  height: 12,
                  background: 'var(--red)',
                  borderRadius: '50%',
                  display: 'inline-block',
                }}
              />{' '}
              {brand.name}
            </div>
            <p style={{ maxWidth: '20em', opacity: 0.8 }}>{brand.tagline}</p>
          </div>
          {footer.columns.map((column) => (
            <Column key={column.heading} column={column} />
          ))}
        </div>
        <div className="sp-foot-bot">
          <span>{footer.copyright}</span>
          <span>{footer.meta}</span>
        </div>
      </div>
    </footer>
  );
}
