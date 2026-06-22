import { useBrand } from '@hanzo_network/brand-config';
import { cn } from '@hanzo_network/hanzo-ui/utils';
import React, { useContext } from 'react';
import { Outlet } from 'react-router';

import { UpdateBanner } from '../../components/hardware-capabilities/update-banner';
import { LogoTapContext } from '../terms-conditions';

export type OnboardingLayoutProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement>
>;

const OnboardingLayout = ({ className, ...props }: OnboardingLayoutProps) => {
  const { tapCount, setTapCount, setShowLocalNodeOption } =
    useContext(LogoTapContext);

  // Brand-driven logo + (optional) tagline. Read INSIDE the component so each
  // app's injected brand (set by <HanzoAI {...brandConfig}/> before mount) is
  // honored — the previous module-level useBrand() froze on the default brand
  // and forced the Hanzo "H" (visor.svg) onto Zoo/Lux. The brand ships its own
  // mark via brandConfig.logo; nothing brand-specific is hardcoded here.
  // useBrand() THROWS if the brand isn't registered yet — and <HanzoAI/> registers
  // it asynchronously, so it is absent on the first render. Tolerate that (fall back
  // to the served /app-logo.png, which is each app's own mark) instead of throwing
  // and crashing the whole onboarding to a blank screen.
  let brand: {
    name?: string;
    logo?: { light?: string; dark?: string };
    tagline?: string;
  } = {};
  try {
    brand = useBrand() as typeof brand;
  } catch {
    /* brand not configured yet — use the fallbacks below */
  }
  // Each app serves its OWN /app-logo.png (zoo = colorful Venn, lux = triangle,
  // hanzo = H). Use it directly — brand.logo from useBrand() can resolve to the
  // SDK's default Hanzo logo when the brand isn't fully propagated, which leaked
  // the Hanzo mark onto the zoo/lux onboarding landing.
  const logoSrc = '/app-logo.png';
  // Tagline is opt-in: only brands that set brandConfig.tagline show one.
  const tagline = brand.tagline;

  const handleLogoTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount >= 5) {
      setShowLocalNodeOption(true);
      setTapCount(0);
    }
  };

  return (
    <div
      className={cn(
        'bg-bg-dark relative mx-auto flex h-full items-center justify-center px-[48px]',
        className,
      )}
      {...props}
    >
      <UpdateBanner />
      <div className="flex h-[calc(100dvh-100px)] w-full items-center justify-center">
        <div className="mx-auto flex h-[600px] w-full max-w-lg flex-col gap-12">
          <div className="flex flex-col gap-3">
            <img
              alt={`${brand.name ?? ''} logo`}
              className="w-24 cursor-pointer"
              data-cy="app-logo"
              onClick={handleLogoTap}
              src={logoSrc}
            />
            {tagline ? (
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                {tagline}
              </p>
            ) : null}
          </div>

          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
