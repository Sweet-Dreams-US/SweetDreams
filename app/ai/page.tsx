import type { Metadata } from 'next';
import AiWorkflows from './AiWorkflows';

const title = 'AI Workflows for Business in Fort Wayne | Sweet Dreams';
const description =
  'We teach your team to use AI and build the workflows that fit how you actually work, so the busywork runs itself. Hands on, hourly, and yours to keep. Fort Wayne, Indiana.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/ai' },
  openGraph: {
    title,
    description,
    url: '/ai',
    type: 'website',
  },
};

export default function Page() {
  return <AiWorkflows />;
}
