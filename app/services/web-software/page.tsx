import { permanentRedirect } from 'next/navigation';

// The old Web & Software landing is folded into the /software hub (its Phase 1
// Websites section). Redirect so the old page can't surface anymore.
export default function WebSoftwarePage() {
  permanentRedirect('/software');
}
