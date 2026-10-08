import type { SVGProps } from 'react';

export type IconName =
  | 'home'
  | 'document'
  | 'wallet'
  | 'tag'
  | 'pie'
  | 'target'
  | 'logout'
  | 'plus'
  | 'chevron-left'
  | 'chevron-right'
  | 'x'
  | 'pencil'
  | 'trash'
  | 'check'
  | 'search'
  | 'alert'
  | 'flag'
  | 'sun'
  | 'moon';

const SHAPES: Record<IconName, React.ReactNode> = {
  home: (
    <>
      <polyline points="4,12 12,5 20,12" />
      <polyline points="6,10 6,20 10,20 10,14 14,14 14,20 18,20 18,10" />
    </>
  ),
  document: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="1.5" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="17" cy="14.5" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  tag: (
    <>
      <polygon points="4,12 11,5 19,5 19,13 12,20" />
      <circle cx="15" cy="9" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  pie: (
    <>
      <circle cx="12" cy="12" r="8" />
      <line x1="12" y1="12" x2="12" y2="4" />
      <line x1="12" y1="12" x2="18" y2="16" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  flag: (
    <>
      <line x1="5" y1="21" x2="5" y2="4" />
      <polygon points="5,4 19,4 15,9 19,14 5,14" />
    </>
  ),
  logout: (
    <>
      <rect x="3" y="4" width="8" height="16" rx="1.5" />
      <line x1="9" y1="12" x2="21" y2="12" />
      <polyline points="17,8 21,12 17,16" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  'chevron-left': <polyline points="15,6 9,12 15,18" />,
  'chevron-right': <polyline points="9,6 15,12 9,18" />,
  x: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </>
  ),
  pencil: (
    <>
      <polygon points="4,20 4,16 15,5 19,9 8,20" />
      <line x1="13" y1="7" x2="17" y2="11" />
    </>
  ),
  trash: (
    <>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
      <polyline points="6,7 6,20 18,20 18,7" />
      <polyline points="9,7 9,4 15,4 15,7" />
    </>
  ),
  check: <polyline points="5,13 10,18 19,7" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.5" />
      <line x1="12" y1="2.5" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="21.5" />
      <line x1="4.6" y1="4.6" x2="6.3" y2="6.3" />
      <line x1="17.7" y1="17.7" x2="19.4" y2="19.4" />
      <line x1="2.5" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="21.5" y2="12" />
      <line x1="4.6" y1="19.4" x2="6.3" y2="17.7" />
      <line x1="17.7" y1="6.3" x2="19.4" y2="4.6" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {SHAPES[name]}
    </svg>
  );
}
