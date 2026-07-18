import { permanentRedirect } from 'next/navigation';

// The Software hub was folded into the Websites product (with AI as the upsell).
// Send the old /software URL and any inbound links to /websites permanently.
export default function Page() {
  permanentRedirect('/websites');
}
