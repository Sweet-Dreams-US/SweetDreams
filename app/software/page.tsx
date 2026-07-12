import type { Metadata } from 'next';
import SoftwareHub from './SoftwareHub';

const title = 'Software That Runs Your Business | Sweet Dreams';
const description =
  'Two things for Fort Wayne businesses: a website that sells (media included), and AI Workflows, where we teach your team and build the AI that handles the busywork behind it.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/software' },
  openGraph: {
    title,
    description,
    url: '/software',
    type: 'website',
  },
};

export default function Page() {
  return <SoftwareHub />;
}
