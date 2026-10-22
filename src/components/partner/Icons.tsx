const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const ICONS = {
  brand: (
    <svg viewBox="0 0 48 48" {...P}><rect x="17" y="4" width="14" height="10" rx="2" /><path d="M14 14h20v26a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V14Z" /><path d="M14 24h20" /><circle cx="24" cy="32" r="4" /></svg>
  ),
  retail: (
    <svg viewBox="0 0 48 48" {...P}><path d="M6 18 9 8h30l3 10" /><path d="M6 18a6 6 0 0 0 12 0 6 6 0 0 0 12 0 6 6 0 0 0 12 0" /><path d="M9 23v17h30V23" /><path d="M20 40V30h8v10" /></svg>
  ),
  manufacturer: (
    <svg viewBox="0 0 48 48" {...P}><path d="M5 42V22l10 6v-6l10 6v-6l10 6V8h8v34H5Z" /><path d="M12 35h4M22 35h4M32 35h4" /></svg>
  ),
  distributor: (
    <svg viewBox="0 0 48 48" {...P}><path d="M4 12h24v20H4z" /><path d="M28 18h9l7 8v6H28" /><circle cx="12" cy="36" r="4" /><circle cx="36" cy="36" r="4" /></svg>
  ),
  salon: (
    <svg viewBox="0 0 48 48" {...P}><circle cx="14" cy="34" r="6" /><circle cx="34" cy="34" r="6" /><path d="M18 30 36 6M30 30 12 6" /></svg>
  ),
};
