// Shared Tailwind class strings so setup + online lobby screens stay visually consistent.
// Colors come from the site-wide dark palette tokens in app/globals.css.

const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-semibold transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-raised disabled:text-muted-foreground disabled:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export const btnPrimary = `${btnBase} bg-brand text-white hover:bg-brand-hover`;
export const btnSuccess = `${btnBase} bg-orange text-orange-foreground hover:bg-orange-hover`;
export const btnDanger = `${btnBase} bg-danger text-white hover:bg-danger-hover`;
export const btnSecondary = `${btnBase} border border-line-strong bg-raised text-foreground hover:bg-raised-hover`;

export const btnBack =
  'inline-flex items-center gap-1 text-sm font-medium text-brand-soft hover:text-foreground transition-colors';

export const btnRemove =
  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-danger/15 hover:text-danger-soft transition-colors';

export const input =
  'w-full rounded-lg border border-line-strong bg-background px-4 py-2.5 text-base text-foreground placeholder:text-muted-foreground outline-none transition focus:border-brand-soft focus:ring-2 focus:ring-brand/40';

export const select =
  'w-full appearance-none rounded-lg border border-line-strong bg-background py-2.5 pl-3 pr-9 text-base font-medium text-foreground cursor-pointer outline-none transition hover:border-muted-foreground focus:border-brand-soft focus:ring-2 focus:ring-brand/40';

export const fieldLabel = 'mb-1.5 block text-sm font-semibold text-muted-foreground';

export const panel = 'w-full rounded-xl border border-border bg-card p-4 shadow-lg shadow-black/20 md:p-6';

export const panelTitle = 'text-lg font-bold text-foreground';

export const listItem =
  'flex items-center gap-2 rounded-lg border border-border bg-raised py-2 pl-4 pr-2 font-medium';

export const segmented = 'inline-flex rounded-lg border border-border bg-background p-1';

export const segment = (active: boolean) =>
  `rounded-md px-4 py-1.5 text-sm font-semibold transition-colors md:px-6 ${active ? 'bg-brand text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
  }`;
