'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const DREAMSUITE_BOOK = 'https://www.dreamsuite.us/#book';

/**
 * Shared "Book a Call" chrome link.
 *
 * The AI page is the DreamSuite spoke, so every booking action there has to land
 * on DreamSuite's own booking, not our internal /book. Since the nav, mobile nav,
 * and footer are shared across the whole site, this component reroutes to
 * DreamSuite only while the visitor is on /ai, and books a Sweet Dreams call on
 * every other page.
 */
export default function BookCallLink({
  className = '',
  activeClassName = '',
  onClick,
  children,
}: {
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const onAi = pathname === '/ai' || pathname?.startsWith('/ai/');

  if (onAi) {
    return (
      <a
        href={DREAMSUITE_BOOK}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  const cls = `${className} ${pathname === '/book' ? activeClassName : ''}`.trim();
  return (
    <Link href="/book" className={cls} onClick={onClick}>
      {children}
    </Link>
  );
}
