import type { Metadata } from 'next';
import ConsultingLanding from './ConsultingLanding';

export const metadata: Metadata = {
  title: 'Consulting — Build a Business That Runs Like a System | Sweet Dreams',
  description:
    'Free strategy audit: get on a call, we find the one bottleneck holding you back, then map the system that breaks it. Growth strategy, offers, SOPs, and scaling systems from Sweet Dreams.',
};

export default function ConsultingPage() {
  return <ConsultingLanding />;
}
