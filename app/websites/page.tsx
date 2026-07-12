import type { Metadata } from 'next';
import Websites from './Websites';

const title = 'Custom Websites in Fort Wayne, Built Before You Pay | Sweet Dreams';
const description =
  'Hand coded, funnel built websites with professional media included. Real SEO, fast, and yours to keep. We build a live demo on your business before you pay a dollar.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/websites' },
  openGraph: {
    title,
    description,
    url: '/websites',
    type: 'website',
  },
};

export default function Page() {
  return <Websites />;
}
