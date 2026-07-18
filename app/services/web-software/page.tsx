import { permanentRedirect } from 'next/navigation';

// The old Web & Software landing is folded into the Websites product.
// Redirect so the old page can't surface anymore.
export default function WebSoftwarePage() {
  permanentRedirect('/websites');
}
