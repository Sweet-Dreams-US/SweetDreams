import type { Metadata } from 'next';
import WebSoftwareLanding from './WebSoftwareLanding';

export const metadata: Metadata = {
  title:
    'Web & Software — Free Spec Website Before You Pay | Sweet Dreams',
  description:
    'Tell us about your business and we hand-code a real, clickable spec website before you pay a dollar — professional photo and video included. Custom sites, web apps, e-commerce, custom software, automation, and SEO from Sweet Dreams in Fort Wayne.',
};

export default function WebSoftwarePage() {
  return <WebSoftwareLanding />;
}
