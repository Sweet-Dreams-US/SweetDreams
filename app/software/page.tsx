import type { Metadata } from 'next';
import SoftwareHub from './SoftwareHub';

export const metadata: Metadata = {
  title: 'Software That Runs Your Business | Sweet Dreams',
  description:
    'One ladder for Fort Wayne businesses: a website that sells (media included), then Dream Suite — the ops platform in your own backend — then AI automations that run the pipelines for you.',
};

export default function Page() {
  return <SoftwareHub />;
}
