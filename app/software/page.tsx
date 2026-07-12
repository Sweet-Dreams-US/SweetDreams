import type { Metadata } from 'next';
import SoftwareHub from './SoftwareHub';

const title = 'Software That Runs Your Business | Sweet Dreams';
const description =
  'One ladder for Fort Wayne businesses: a website that sells (media included), then Dream Suite, the ops platform in your own backend, then AI automations that run the pipelines for you.';

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
