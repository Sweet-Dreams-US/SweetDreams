import type { Metadata } from 'next';
import MediaProduction from './MediaProduction';

export const metadata: Metadata = {
  title:
    'Media Production Fort Wayne | Brand Films, Social, Aerial & Events | Sweet Dreams',
  description:
    'Cinematic media production from Sweet Dreams — brand films, commercials, short-form social, live event coverage, aerial drone, and photography that make your brand impossible to forget. Get a free 90-day content plan before you pay anything.',
};

export default function Page() {
  return <MediaProduction />;
}
