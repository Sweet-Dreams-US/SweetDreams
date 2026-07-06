import type { Metadata } from 'next';
import MarketingPage from './MarketingPage';

export const metadata: Metadata = {
  title: 'Marketing That Gets You Found & Chosen | Sweet Dreams',
  description:
    'Free marketing plan for Fort Wayne businesses — we audit where your customers actually are and map the ads, SEO, email, social, and funnels to reach them. No cost to start.',
};

export default function Page() {
  return <MarketingPage />;
}
