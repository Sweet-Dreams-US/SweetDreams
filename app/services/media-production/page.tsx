import type { Metadata } from 'next';
import MediaProduction from './MediaProduction';

export const metadata: Metadata = {
  title: 'Media Production Fort Wayne | Brand Films, Commercials & Social Content | Sweet Dreams',
  description:
    'Cinematic media production from Sweet Dreams — brand films, commercials, social content, aerial, event coverage, and recruiting video that make your brand higher quality and impossible to forget. Get a free brand content plan before you pay anything.',
};

export default function Page() {
  return <MediaProduction />;
}
