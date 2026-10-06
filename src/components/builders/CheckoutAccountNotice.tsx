import Link from 'next/link';

interface Props { isSignedIn: boolean | null; }

/** Explains the account trade-off immediately before payment without blocking guests. */
export default function CheckoutAccountNotice({ isSignedIn }: Props) {
  if (isSignedIn === null) return null;
  if (isSignedIn) {
    return <p className="sp-account-notice saved">✓ This order will be saved to your account.</p>;
  }

  return (
    <div className="sp-account-notice">
      <strong>Checking out as a guest.</strong> No order record will be saved to an account. If anything goes wrong, refunds and troubleshooting can be harder.{' '}
      <Link href="/login?next=/account" className="sp-alink">Log in or create a free account</Link> before paying to keep your page in one place.
    </div>
  );
}
