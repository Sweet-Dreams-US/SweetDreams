import type { Metadata } from 'next';
import Websites from './Websites';

const title = 'Free Website in Fort Wayne, You Only Pay Hosting | Sweet Dreams';
const description =
  'We build your full custom website and shoot the photo and video for it, free. You only pay monthly hosting. Hand coded, media included, fully managed. Fort Wayne.';

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
