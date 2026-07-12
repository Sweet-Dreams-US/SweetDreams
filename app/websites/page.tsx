import type { Metadata } from 'next';
import Websites from './Websites';

const title = 'Creative Websites in Fort Wayne, Media Included | Sweet Dreams';
const description =
  'Hand coded websites built to stand out, with cinematic photo and video included. Custom design and motion from a media company, and a live demo built on your brand before you pay a dollar.';

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
