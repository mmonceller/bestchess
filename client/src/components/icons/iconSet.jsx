/*
 * Flat duotone icons on a 24×24 grid. Solid shapes use currentColor; the lighter
 * layer uses the `.duo` class so it picks up the theme's secondary opacity.
 */
const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Duo = (props) => <path className="duo" {...props} />;

const gearTeeth = Array.from({ length: 8 }, (_, i) => (
  <rect key={i} x="10.4" y="1.6" width="3.2" height="4.6" rx="1" transform={`rotate(${i * 45} 12 12)`} />
));

export const ICONS = {
  home: (<>
    <Duo d="M5 10.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9.5L12 5Z" />
    <path d="M12 3 2.6 11.1a1.1 1.1 0 0 0 1.4 1.7L12 5.9l8 6.9a1.1 1.1 0 0 0 1.4-1.7Z" />
  </>),
  friends: (<>
    <circle className="duo" cx="16.5" cy="8.5" r="3" />
    <Duo d="M13.2 14.3A6 6 0 0 1 22 19.6v.4h-5.4" />
    <circle cx="9" cy="8" r="3.6" />
    <path d="M2.5 20.2a6.5 6.5 0 0 1 13 0V21h-13Z" />
  </>),
  bot: (<>
    <circle cx="12" cy="3.4" r="1.6" />
    <rect x="11.1" y="4" width="1.8" height="3.4" />
    <rect className="duo" x="4" y="7" width="16" height="13.5" rx="4.2" />
    <rect x="1.8" y="11.2" width="2.2" height="5" rx="1.1" />
    <rect x="20" y="11.2" width="2.2" height="5" rx="1.1" />
    <circle cx="9" cy="12.8" r="2.1" />
    <circle cx="15" cy="12.8" r="2.1" />
    <rect x="8.8" y="16.4" width="6.4" height="1.8" rx=".9" />
  </>),
  learn: (<>
    <Duo d="M5.5 11.3V16c0 1.9 2.9 3.6 6.5 3.6s6.5-1.7 6.5-3.6v-4.7L12 14.5Z" />
    <path d="M12 3.6 1.5 8.8 12 14l10.5-5.2Z" />
    <path {...line} strokeWidth="1.7" d="M20.6 9.6v5.8" />
    <circle cx="20.6" cy="16.6" r="1.4" />
  </>),
  settings: (<>
    {gearTeeth}
    <path fillRule="evenodd" d="M12 4.6a7.4 7.4 0 1 0 0 14.8 7.4 7.4 0 0 0 0-14.8Zm0 4.4a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
  </>),
  user: (<>
    <circle cx="12" cy="8" r="4.2" />
    <Duo d="M3.5 21a8.5 8.5 0 0 1 17 0Z" />
  </>),
  logout: (<>
    <Duo d="M4 4.5A1.5 1.5 0 0 1 5.5 3H13v18H5.5A1.5 1.5 0 0 1 4 19.5Z" />
    <path {...line} d="M10 12h11M17.5 8l3.8 4-3.8 4" />
  </>),
  back: <path {...line} d="M15 5l-7 7 7 7" />,
  arrowRight: <path {...line} d="M5 12h14M13 6l6 6-6 6" />,
  arrowLeft: <path {...line} d="M19 12H5M11 6l-6 6 6 6" />,
  close: <path {...line} d="M6 6l12 12M18 6 6 18" />,
  check: <path {...line} strokeWidth="2.6" d="M4.5 12.5l5 5 10-11" />,
  menu: <path {...line} d="M4 7h16M4 12h16M4 17h16" />,
  hint: (<>
    <path d="M12 2.5a7 7 0 0 0-4.3 12.5c.8.6 1.3 1.5 1.3 2.5h6c0-1 .5-1.9 1.3-2.5A7 7 0 0 0 12 2.5Z" />
    <rect className="duo" x="9" y="18.6" width="6" height="3" rx="1.3" />
    <path d="M10 8.5a2.6 2.6 0 0 1 2-1.2" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.6" strokeLinecap="round" />
  </>),
  undo: <path {...line} d="M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />,
  flip: <path {...line} d="M7 4v16M3.5 7.5 7 4l3.5 3.5M17 20V4M13.5 16.5 17 20l3.5-3.5" />,
  flag: (<>
    <path {...line} d="M5 21V3.8" />
    <path d="M5 4.4c3-1.8 5.6 1.8 8.6 0s4.4-.8 5.4 0v9.2c-1-.8-2.4-1.8-5.4 0s-5.6-1.8-8.6 0Z" />
  </>),
  draw: (<>
    <circle className="duo" cx="12" cy="12" r="9.5" />
    <rect x="7" y="8.6" width="10" height="2.3" rx="1.15" />
    <rect x="7" y="13.1" width="10" height="2.3" rx="1.15" />
  </>),
  eye: (<>
    <Duo d="M12 5C6.5 5 2.7 9.4 1.6 12c1.1 2.6 4.9 7 10.4 7s9.3-4.4 10.4-7C21.3 9.4 17.5 5 12 5Z" />
    <circle cx="12" cy="12" r="3.6" />
  </>),
  chat: (<>
    <Duo d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
    <circle cx="8" cy="11" r="1.5" /><circle cx="12" cy="11" r="1.5" /><circle cx="16" cy="11" r="1.5" />
  </>),
  copy: (<>
    <rect className="duo" x="3" y="3" width="13" height="13" rx="2.5" />
    <rect x="8" y="8" width="13" height="13" rx="2.5" />
  </>),
  share: (<>
    <path {...line} strokeWidth="1.8" className="duo" d="M8 11 16 6.5M8 13l8 4.5" />
    <circle cx="6" cy="12" r="3" /><circle cx="18" cy="5.5" r="3" /><circle cx="18" cy="18.5" r="3" />
  </>),
  link: <path {...line} d="M10 14a4.5 4.5 0 0 0 6.4 0l3.2-3.2a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3.2 3.2a4.5 4.5 0 0 0 6.4 6.4l1-1" />,
  clock: (<>
    <circle className="duo" cx="12" cy="12" r="9.5" />
    <path {...line} d="M12 7v5.3l3.4 2.2" />
  </>),
  target: (<>
    <circle className="duo" cx="12" cy="12" r="9.5" />
    <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="2.4" />
  </>),
  retry: <path {...line} d="M20 12a8 8 0 1 1-2.3-5.7M20.2 3.8v4.8h-4.8" />,
  star: <path d="M12 2.6l2.9 5.9 6.4.9-4.7 4.5 1.1 6.4L12 17.3l-5.7 3 1.1-6.4-4.7-4.5 6.4-.9Z" />,
  trophy: (<>
    <Duo d="M5 4H2.5v2.5A4.5 4.5 0 0 0 7 11M19 4h2.5v2.5A4.5 4.5 0 0 1 17 11" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M5.5 3h13v5.5a6.5 6.5 0 0 1-13 0Z" />
    <rect className="duo" x="10.6" y="14.5" width="2.8" height="3.5" />
    <rect x="7" y="18" width="10" height="3" rx="1.2" />
  </>),
  crown: (<>
    <path d="M3 8.5 6.6 17h10.8L21 8.5l-5 3.6L12 5l-4 7.1Z" />
    <rect className="duo" x="6" y="18.2" width="12" height="2.8" rx="1.2" />
    <circle cx="3" cy="7.5" r="1.6" /><circle cx="12" cy="4" r="1.6" /><circle cx="21" cy="7.5" r="1.6" />
  </>),
  bolt: <path d="M13.5 2 4.5 13.5H11L9.8 22l9.7-12.3H13Z" />,
  sparkle: (<>
    <path d="M10 2.5c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7Z" />
    <path className="duo" d="M18.5 13.5c.3 2.2 1.3 3.2 3.5 3.5-2.2.3-3.2 1.3-3.5 3.5-.3-2.2-1.3-3.2-3.5-3.5 2.2-.3 3.2-1.3 3.5-3.5Z" />
  </>),
  warning: (<>
    <Duo d="M10.3 3.6a2 2 0 0 1 3.4 0l8.4 14.6a2 2 0 0 1-1.7 3H3.6a2 2 0 0 1-1.7-3Z" />
    <rect x="10.8" y="8.5" width="2.4" height="6.5" rx="1.2" />
    <circle cx="12" cy="17.8" r="1.4" />
  </>),
  xCircle: (<>
    <circle className="duo" cx="12" cy="12" r="9.5" />
    <path {...line} d="M8.5 8.5l7 7M15.5 8.5l-7 7" />
  </>),
  checkCircle: (<>
    <circle className="duo" cx="12" cy="12" r="9.5" />
    <path {...line} d="M7.5 12.3l3 3 6-6.3" />
  </>),
  play: <path d="M7 4.2v15.6a1 1 0 0 0 1.5.9l12.4-7.8a1 1 0 0 0 0-1.8L8.5 3.3A1 1 0 0 0 7 4.2Z" />,
  first: (<><rect x="4" y="5" width="2.6" height="14" rx="1.1" /><path d="M20 5.8v12.4a1 1 0 0 1-1.6.8L9.6 12.8a1 1 0 0 1 0-1.6l8.8-6.2a1 1 0 0 1 1.6.8Z" /></>),
  chevron: <path {...line} d="M9 6l6 6-6 6" />,
  prev: <path d="M17 5.8v12.4a1 1 0 0 1-1.6.8L6.6 12.8a1 1 0 0 1 0-1.6l8.8-6.2a1 1 0 0 1 1.6.8Z" />,
  next: <path d="M7 5.8v12.4a1 1 0 0 0 1.6.8l8.8-6.2a1 1 0 0 0 0-1.6L8.6 5a1 1 0 0 0-1.6.8Z" />,
  last: (<><rect x="17.4" y="5" width="2.6" height="14" rx="1.1" /><path d="M4 5.8v12.4a1 1 0 0 0 1.6.8l8.8-6.2a1 1 0 0 0 0-1.6L5.6 5A1 1 0 0 0 4 5.8Z" /></>),
  random: (<>
    <rect className="duo" x="3" y="3" width="18" height="18" rx="4.5" />
    <circle cx="8" cy="8" r="1.8" /><circle cx="16" cy="8" r="1.8" /><circle cx="12" cy="12" r="1.8" />
    <circle cx="8" cy="16" r="1.8" /><circle cx="16" cy="16" r="1.8" />
  </>),
  lock: (<>
    <path {...line} d="M7.5 10.5V8a4.5 4.5 0 0 1 9 0v2.5" />
    <rect x="4.5" y="10" width="15" height="11" rx="3" />
  </>),
  puzzle: <path d="M10 3.5a2.5 2.5 0 0 1 4.9.7V6H19a1 1 0 0 1 1 1v4h-1.6a2.5 2.5 0 1 0 0 5H20v4a1 1 0 0 1-1 1h-4v-1.6a2.5 2.5 0 1 0-5 0V21H6a1 1 0 0 1-1-1v-4h1.6a2.5 2.5 0 1 0 0-5H5V7a1 1 0 0 1 1-1h4Z" />,
  fire: (<>
    <path d="M12 2.5c.6 3.3 4.2 5.2 5.6 8.6 1.9 4.6-1.2 10-5.6 10.4-4.4.4-7.8-3-7.6-7.2.1-2.5 1.4-4.3 2.8-5.6.2 1.8 1 3 2.2 3.6-.6-3.7.8-7 2.6-9.8Z" />
    <path className="duo" fill="#fff" d="M12.3 13c.4 1.7 2.4 2.6 2.4 4.6a2.7 2.7 0 0 1-5.4.2c0-1.2.6-2 1.3-2.6.1.9.5 1.4 1.1 1.7-.3-1.3 0-2.7.6-3.9Z" />
  </>),
  gem: (<>
    <path d="M6.5 3.5h11L22 9.2 12 21 2 9.2Z" />
    <Duo fill="#fff" d="M2 9.2h20L12 21Z" />
  </>),
  info: (<>
    <circle className="duo" cx="12" cy="12" r="9.5" />
    <rect x="10.8" y="10.5" width="2.4" height="7" rx="1.2" />
    <circle cx="12" cy="7.3" r="1.5" />
  </>),
  cpu: (<>
    <path {...line} strokeWidth="1.8" d="M9 2.5v3M15 2.5v3M9 18.5v3M15 18.5v3M2.5 9h3M2.5 15h3M18.5 9h3M18.5 15h3" />
    <rect className="duo" x="5" y="5" width="14" height="14" rx="3" />
    <rect x="9" y="9" width="6" height="6" rx="1.4" />
  </>),
  map: (<>
    <Duo d="M3 5.5 8.5 3.5l7 2.5 5.5-2v14.5l-5.5 2-7-2.5L3 20Z" />
    <path {...line} strokeWidth="1.8" d="M8.5 3.5v14.5M15.5 6v14.5" />
  </>),
  search: (<>
    <circle className="duo" cx="10.5" cy="10.5" r="6.5" />
    <circle {...line} cx="10.5" cy="10.5" r="6.5" />
    <path {...line} strokeWidth="2.8" d="m15.6 15.6 5 5" />
  </>),
  book: (<>
    <Duo d="M12 6.2C10 4.6 7 4 3 4v14c4 0 7 .6 9 2.2Z" />
    <path d="M12 6.2C14 4.6 17 4 21 4v14c-4 0-7 .6-9 2.2Z" />
  </>),
  seedling: (<>
    <path {...line} d="M12 21v-9" />
    <path d="M12 12.5C12 8 9 5 3.5 5 3.5 10 6.5 12.5 12 12.5Z" />
    <Duo d="M12 10c0-3.6 2.6-6.5 8.5-6.5 0 4.4-2.8 6.5-8.5 6.5Z" />
  </>),
  swords: (<>
    <path d="M3 3h4.5l9.2 9.2-3.2 3.2L4.3 6.2Z" />
    <Duo d="M21 3h-4.5l-9.2 9.2 3.2 3.2 9.2-9.2Z" />
    <path {...line} d="M4.5 14.5l5 5M19.5 14.5l-5 5M6 21l2-2M18 21l-2-2" />
  </>),
  mountain: (<>
    <Duo d="M14.5 8 22 20H9.5Z" />
    <path d="M9 4.5 17 20H1Z" />
    <path fill="#fff" fillOpacity=".7" d="M9 4.5 11.4 9.2 9.9 8.4 8.3 9.6 7.2 8.3Z" />
  </>),
  mind: (<>
    <Duo d="M12 3a8 8 0 0 0-8 8c0 2.4 1 4.4 2.5 5.8V21h7v-2h2a2 2 0 0 0 2-2v-2h2l-1.6-3.6A8 8 0 0 0 12 3Z" />
    <circle cx="11.5" cy="10.5" r="3.4" />
  </>),
  question: (<>
    <circle className="duo" cx="12" cy="12" r="9.5" />
    <path {...line} d="M9.2 9.3a2.9 2.9 0 0 1 5.6 1c0 1.9-2.8 2.4-2.8 4" />
    <circle cx="12" cy="17.6" r="1.4" />
  </>),
  grid: (<>
    <rect className="duo" x="3" y="3" width="18" height="18" rx="3" />
    <rect x="3" y="3" width="9" height="9" rx="2" />
    <rect x="12" y="12" width="9" height="9" rx="2" />
  </>),
  pawn: (<>
    <circle cx="12" cy="6.5" r="3.4" />
    <path d="M9.2 10.6h5.6l-.6 1.6c1.4 1.5 2.4 3.6 2.8 6.1H7c.4-2.5 1.4-4.6 2.8-6.1Z" />
    <rect className="duo" x="5.2" y="18.6" width="13.6" height="3" rx="1.3" />
  </>),
  knight: (<>
    <path d="M7.2 18.6c.3-2 1.9-3.7 3.1-5l-2.7.6-1.8 1.5-1.4-.6a1.4 1.4 0 0 1-.7-1.9l1.8-3.4c.3-1.9 1.2-3.6 2.7-4.7L9.4 3l.6 1.6c3.2.5 5.1 2.4 6.3 4.8 1.2 2.4 1.6 5.4 1.3 9.2Z" />
    <circle cx="10" cy="7.8" r="1" fill="#fff" fillOpacity=".75" />
    <rect className="duo" x="5.2" y="18.6" width="13.6" height="3" rx="1.3" />
  </>),
  bishop: (<>
    <circle cx="12" cy="3.6" r="1.7" />
    <path d="M12 5.6c-3.1 2.2-4.6 4.6-4.6 6.9 0 2 1.3 3.3 2.6 3.8h4c1.3-.5 2.6-1.8 2.6-3.8 0-1.2-.4-2.3-1.2-3.5l-2.6 3-1.2-1.1 2.8-3.2A12 12 0 0 0 12 5.6Z" />
    <path d="M8.4 16.8h7.2l.9 1.8h-9Z" />
    <rect className="duo" x="5.2" y="18.6" width="13.6" height="3" rx="1.3" />
  </>),
  rook: (<>
    <path d="M6 3.5h2.6v2.1h2V3.5h2.8v2.1h2V3.5H18v4.4l-2.2 1.6v6l2 2.4v.7H6.2v-.7l2-2.4v-6L6 7.9Z" />
    <rect className="duo" x="5.2" y="18.6" width="13.6" height="3" rx="1.3" />
  </>),
  queen: (<>
    <path d="M3.6 8.6 7 17.4h10l3.4-8.8-4.2 3.3L12 5.5l-4.2 6.4Z" />
    <circle cx="3.6" cy="7.4" r="1.6" /><circle cx="12" cy="4" r="1.6" /><circle cx="20.4" cy="7.4" r="1.6" />
    <rect className="duo" x="5.2" y="18.6" width="13.6" height="3" rx="1.3" />
  </>),
  king: (<>
    <path d="M11 1.5h2v2.2h2.2v2H13V8h-2V5.7H8.8v-2H11Z" />
    <path d="M6.2 11c0-1.7 2.6-3 5.8-3s5.8 1.3 5.8 3l-1.6 6.6H7.8Z" />
    <rect className="duo" x="5.2" y="18.6" width="13.6" height="3" rx="1.3" />
  </>),
};

export const ICON_NAMES = Object.keys(ICONS);
