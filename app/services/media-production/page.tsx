import type { Metadata } from 'next';
import MediaProduction from './MediaProduction';

const title =
  'Media Production Fort Wayne | Brand Films, Social, Aerial & Events | Sweet Dreams';
const description =
  'Cinematic media production from Sweet Dreams — brand films, commercials, short-form social, live event coverage, aerial drone, and photography that make your brand impossible to forget. Get a free 90-day content plan before you pay anything.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/services/media-production' },
  openGraph: {
    title,
    description,
    url: '/services/media-production',
    type: 'website',
  },
};

export default function Page() {
  return <MediaProduction />;
}
