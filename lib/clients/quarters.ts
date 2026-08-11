/**
 * Included update hours run in 3 month blocks measured from the site's GO
 * LIVE date — the allowance does not start while a site is still being
 * built. Unused hours do not roll over.
 */
import { addMonths, differenceInMonths } from 'date-fns';

export interface QuarterWindow {
  start: Date;
  end: Date;
  /** 0 = first quarter after go live */
  index: number;
}

export function currentQuarterWindow(
  goLiveDate: string | null,
  now: Date = new Date()
): QuarterWindow | null {
  if (!goLiveDate) return null;
  const start0 = new Date(`${goLiveDate}T00:00:00`);
  if (Number.isNaN(start0.getTime()) || start0 > now) return null;
  const index = Math.floor(differenceInMonths(now, start0) / 3);
  const start = addMonths(start0, index * 3);
  return { start, end: addMonths(start, 3), index };
}

/** Hours used inside the window, from the plain English update entries. */
export function hoursUsedInWindow(
  updates: { created_at: string; hours_used: number | string | null }[],
  window: QuarterWindow
): number {
  return updates.reduce((total, u) => {
    const at = new Date(u.created_at);
    if (at < window.start || at >= window.end) return total;
    return total + Number(u.hours_used ?? 0);
  }, 0);
}
