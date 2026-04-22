'use client';

import { useEffect, useRef } from 'react';
import styles from "./Friends.module.css";
import { gsap } from 'gsap';

// Each client optionally links out to their own site. Confirmed URLs
// come from the websiteProjects list in app/work/page.tsx (sites we
// built ourselves) and from public org sites. Any `href: undefined`
// renders as a non-clickable logo — update when the real URL is known.
interface ClientLogo {
  name: string;
  url: string;       // logo image
  href?: string;     // external site to backlink to
}

const CLIENT_LOGOS: ClientLogo[] = [
  {
    name: "MC Sim Racing",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/logoMCSimRacing.png",
    href: "https://mcracingfortwayne.com",
  },
  {
    name: "Coleman Automotive Group",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/colemanautomotivegrouplogoblack.png",
    href: "https://colemanautomotivegroup.com",
  },
  {
    name: "Prime Dealer Equity Fund",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/Primedealerequityfundlogoblack.png",
    href: "https://primedealerfund.com",
  },
  {
    name: "Brookfield Zoo",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/BrookfieldZooLogo.png",
    href: "https://www.brookfieldzoo.org",
  },
  {
    name: "Crooked Lake Music Festival",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/CrookedLakeLogo.png",
    href: "https://crookedlakesandbarmusicfest.com",
  },
  {
    name: "Indianapolis Children's Museum",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/IndyChildrensMuseumLogo.png",
    href: "https://www.childrensmuseum.org",
  },
  {
    name: "Kissel Entertainment",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/KisselLogo.png",
    href: "https://www.kisselentertainment.com",
  },
  {
    name: "Nissan",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/nissanredlogo.png",
    href: "https://www.nissanusa.com",
  },
  {
    name: "RideWorx",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/RideWorxLogo.png",
    href: "https://rideworx.com",
  },
  {
    name: "Summit City Vintage",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SummitCityVintageLogo.png",
    href: "https://www.summitcityvintage.com",
  },
  {
    name: "Trusted Dental",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/TrustedDentalLogo.png",
    href: "https://www.aegisdentalgroup.com",
  },
  {
    name: "Sno Biz",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/logo-snobiz-footer-ret.png",
    href: "https://snobiz.com",
  },
  {
    name: "Sliced by Sonny",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/slicedBySonny.png",
    href: "https://www.slicedbysonny.com",
  },
  {
    name: "The Landing",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/TheLandingLogo.png",
    href: "https://thelandingfw.com",
  },
  {
    name: "City of Fort Wayne",
    url: "https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/CityofFortWayneLogo.png",
    href: "https://www.cityoffortwayne.org",
  },
];

export default function FriendsAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    let oldX = 0;
    let oldY = 0;
    let deltaX = 0;
    let deltaY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate movement delta
      deltaX = e.clientX - oldX;
      deltaY = e.clientY - oldY;

      // Update old coordinates
      oldX = e.clientX;
      oldY = e.clientY;
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);

    // Wait a bit to ensure all logos are rendered
    const setupAnimations = () => {
      // Add hover effect to each logo
      const logoItems = container.querySelectorAll(`.${styles.logoItem}`);

      logoItems.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          const tl = gsap.timeline({
            onComplete: () => {
              tl.kill();
            }
          });

          tl.timeScale(1.2); // Animation plays 20% faster

          const img = el.querySelector('img');
          if (!img) return;

          // Fling effect - simulate inertia manually since we don't have the plugin
          const velocityX = deltaX * 30;
          const velocityY = deltaY * 30;

          // Animate with momentum effect
          tl.to(img, {
            x: velocityX / 10, // Scale down for reasonable movement
            y: velocityY / 10,
            duration: 0.6,
            ease: 'power2.out',
          });

          // Return to original position
          tl.to(img, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)',
          });

          // Random rotation with yoyo
          tl.fromTo(img, {
            rotate: 0
          }, {
            duration: 0.4,
            rotate: (Math.random() - 0.5) * 30, // Random angle between -15 and 15
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
          }, '<'); // Start at same time as first tween

          // Increase z-index on hover
          gsap.set(el, { zIndex: 10 });
          tl.eventCallback('onComplete', () => {
            gsap.set(el, { zIndex: 1 });
          });
        });
      });
    };

    // Setup animations immediately
    setupAnimations();

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className={styles.section} data-cursor-hide>
      <div className={styles.container} ref={containerRef}>
        <div className={styles.textSection}>
          <h2 className={styles.title}>TRUSTED BY</h2>
          <h3 className={styles.mainText}>OUR FRIENDS</h3>
        </div>

        <div className={styles.logosGrid}>
          {CLIENT_LOGOS.map((client, index) => {
            const logoInner = (
              <img
                src={client.url}
                alt={client.name}
                className={styles.logo}
                style={{ willChange: 'transform' }}
              />
            );

            // Wrap logo in an anchor when we have a verified URL so
            // each logo becomes a backlink to the client's own site
            // (good for SEO + useful for visitors). Falls back to a
            // plain div for clients without a known href.
            return client.href ? (
              <a
                key={index}
                href={client.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.logoItem}
                aria-label={`Visit ${client.name}'s website`}
              >
                {logoInner}
              </a>
            ) : (
              <div key={index} className={styles.logoItem}>
                {logoInner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
