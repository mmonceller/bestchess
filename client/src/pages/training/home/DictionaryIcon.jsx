/* A cartoon dictionary: a standing book with a ribbon, a cover face, and A–Z. */
export default function DictionaryIcon() {
  return (
    <svg className="dictionary-icon" viewBox="0 0 160 140" aria-hidden="true">
      <ellipse cx="82" cy="126" rx="46" ry="8" fill="#000" opacity=".28" />
      <path d="M38 22h18c6 0 8 4 8 8v86c0-6-4-8-8-8H38c-6 0-10 3-10 8V30c0-5 4-8 10-8Z" fill="#3ccf7a" stroke="#22202b" strokeWidth="3" strokeLinejoin="round" />
      <path d="M46 30h10v78H46c-4 0-6 2-6 5V35c0-3 2-5 6-5Z" fill="#f6efe2" />
      <path d="M62 18h68c8 0 12 5 12 12v84c0 6-4 10-10 10H70c-8 0-14-4-16-10V28c0-6 2-10 8-10Z" fill="#7c5cff" stroke="#22202b" strokeWidth="3" strokeLinejoin="round" />
      <path d="M74 30h52c4 0 8 3 8 8v64c0 4-3 7-7 7H78c-5 0-8-3-8-7V36c0-4 1-6 4-6Z" fill="#fff8ec" />
      <path d="M108 18c6 8 8 16 8 28l-10 8-10-8c0-12 2-20 8-28 1 4 3 4 4 0Z" fill="#ffb547" stroke="#22202b" strokeWidth="3" strokeLinejoin="round" />
      <path d="M86 46h28M86 58h22M86 70h26" stroke="#c9bba6" strokeWidth="3" strokeLinecap="round" />
      <text x="100" y="96" textAnchor="middle" fontFamily="inherit" fontSize="22" fontWeight="800" fill="#7c5cff">A–Z</text>
      <circle cx="46" cy="58" r="3" fill="#22202b" />
      <circle cx="58" cy="58" r="3" fill="#22202b" />
      <path d="M45 68c4 5 10 5 14 0" fill="none" stroke="#22202b" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="128" cy="108" r="14" fill="#ffb547" stroke="#22202b" strokeWidth="3" />
      <path d="M128 100v6h5" fill="none" stroke="#22202b" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
