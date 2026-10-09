/* Flat mascot portraits for the coaches, drawn on a 64×64 grid. */
const ink = '#22202b';
const stroke = (color, width = 2.4) => ({ fill: 'none', stroke: color, strokeWidth: width, strokeLinecap: 'round', strokeLinejoin: 'round' });

const owl = (c) => (<>
  <path d="M14 24 18 9l8 10Z" fill={c} />
  <path d="M50 24 46 9l-8 10Z" fill={c} />
  <ellipse cx="32" cy="39" rx="21" ry="22" fill={c} />
  <ellipse cx="32" cy="48" rx="12" ry="11" fill="#fff" opacity=".35" />
  <circle cx="23.5" cy="31" r="8.5" fill="#fff" />
  <circle cx="40.5" cy="31" r="8.5" fill="#fff" />
  <circle cx="24.5" cy="32" r="4.2" fill={ink} />
  <circle cx="39.5" cy="32" r="4.2" fill={ink} />
  <circle cx="26" cy="30.4" r="1.4" fill="#fff" />
  <circle cx="41" cy="30.4" r="1.4" fill="#fff" />
  <path d="M28.6 38.5h6.8L32 43.6Z" fill="#ffb547" />
</>);

const bear = (c) => (<>
  <circle cx="16.5" cy="19" r="7.5" fill={c} />
  <circle cx="47.5" cy="19" r="7.5" fill={c} />
  <circle cx="16.5" cy="19" r="3.6" fill="#f6dcae" />
  <circle cx="47.5" cy="19" r="3.6" fill="#f6dcae" />
  <circle cx="32" cy="37" r="21" fill={c} />
  <ellipse cx="32" cy="45" rx="10.5" ry="8.5" fill="#f6dcae" />
  <ellipse cx="32" cy="41.5" rx="3.8" ry="2.8" fill={ink} />
  <path d="M28.5 47q3.5 3 7 0" {...stroke(ink, 2)} />
  <circle cx="24.5" cy="32.5" r="2.3" fill={ink} />
  <circle cx="39.5" cy="32.5" r="2.3" fill={ink} />
  <circle cx="24.5" cy="32.5" r="5.8" {...stroke('#fff', 2)} opacity=".9" />
  <circle cx="39.5" cy="32.5" r="5.8" {...stroke('#fff', 2)} opacity=".9" />
  <path d="M30.3 32.5h3.4" {...stroke('#fff', 2)} opacity=".9" />
  <path d="M18.5 24.5q6-3 11 0M34.5 24.5q5-3 11 0" {...stroke('#fbf3e4', 2.6)} />
</>);

const rabbit = (c) => (<>
  <ellipse cx="24" cy="15" rx="5.6" ry="13" fill="#f4ece8" />
  <ellipse cx="40" cy="15" rx="5.6" ry="13" fill="#f4ece8" />
  <ellipse cx="24" cy="16" rx="2.6" ry="9" fill="#f6a5a0" />
  <ellipse cx="40" cy="16" rx="2.6" ry="9" fill="#f6a5a0" />
  <circle cx="32" cy="39" r="19" fill="#f4ece8" />
  <path d="M13.4 32q18.6-8 37.2 0l.4 5.4q-19-8-38 0Z" fill={c} />
  <path d="M46 30.5l6 -4 -1 6Z" fill={c} />
  <circle cx="25.5" cy="41" r="2.7" fill={ink} />
  <circle cx="38.5" cy="41" r="2.7" fill={ink} />
  <circle cx="26.4" cy="40.1" r=".9" fill="#fff" />
  <circle cx="39.4" cy="40.1" r=".9" fill="#fff" />
  <path d="M30 46h4l-2 2.4Z" fill="#f08a8a" />
  <path d="M32 48.4q-2 2.6-4.2 1.2M32 48.4q2 2.6 4.2 1.2" {...stroke(ink, 1.8)} />
  <circle cx="21" cy="47" r="2.6" fill="#f6a5a0" opacity=".7" />
  <circle cx="43" cy="47" r="2.6" fill="#f6a5a0" opacity=".7" />
</>);

const cat = (c) => (<>
  <path d="M14.5 31 17 9.5l13 11Z" fill={c} />
  <path d="M49.5 31 47 9.5l-13 11Z" fill={c} />
  <path d="M18.5 24.5 19.6 15l6.4 6Z" fill="#fff" opacity=".4" />
  <path d="M45.5 24.5 44.4 15 38 21Z" fill="#fff" opacity=".4" />
  <ellipse cx="32" cy="38.5" rx="20" ry="18" fill={c} />
  <ellipse cx="32" cy="46" rx="8.5" ry="6" fill="#fff" opacity=".4" />
  <path d="M20.5 37.5q4.2 3.4 8.4 0M35.1 37.5q4.2 3.4 8.4 0" {...stroke(ink, 2.4)} />
  <path d="M30 42.5h4l-2 2.4Z" fill="#ff8fb1" />
  <path d="M32 44.9q-1.6 2.2-3.6 1.4M32 44.9q1.6 2.2 3.6 1.4" {...stroke(ink, 1.6)} />
  <path d="M10.5 42.5h9.5M11 47.5l9-1.6M53.5 42.5H44M53 47.5l-9-1.6" {...stroke('#fff', 1.4)} opacity=".7" />
</>);

const fox = (c) => (<>
  <path d="M11 11 28 21.5 16.5 33Z" fill={c} />
  <path d="M53 11 36 21.5 47.5 33Z" fill={c} />
  <path d="M15 16.5 23.5 22l-6 5.5Z" fill={ink} opacity=".45" />
  <path d="M49 16.5 40.5 22l6 5.5Z" fill={ink} opacity=".45" />
  <path d="M13 29q19-17 38 0 2 12-19 28Q11 41 13 29Z" fill={c} />
  <path d="M13.4 33.5q11 3.5 18.6 23.5Q14.8 46.5 13.4 33.5Z" fill="#fff4e8" />
  <path d="M50.6 33.5Q39.6 37 32 57q17.2-10.5 18.6-23.5Z" fill="#fff4e8" />
  <path d="M21.5 34q4.2-3.4 7.6 0-3.8 2.4-7.6 0Z" fill={ink} />
  <path d="M34.9 34q4.2-3.4 7.6 0-3.8 2.4-7.6 0Z" fill={ink} />
  <path d="M35 28.6l7.4-2.4" {...stroke(ink, 2)} />
  <ellipse cx="32" cy="50.5" rx="3.2" ry="2.4" fill={ink} />
</>);

const penguin = (c) => (<>
  <ellipse cx="32" cy="38" rx="21" ry="23" fill={c} />
  <circle cx="25" cy="37" r="9.5" fill="#fff" />
  <circle cx="39" cy="37" r="9.5" fill="#fff" />
  <ellipse cx="32" cy="47" rx="12" ry="9.5" fill="#fff" />
  <circle cx="25.5" cy="36.5" r="2.4" fill={ink} />
  <circle cx="38.5" cy="36.5" r="2.4" fill={ink} />
  <rect x="19" y="31" width="12.5" height="10.5" rx="3.4" {...stroke(ink, 2)} />
  <rect x="32.5" y="31" width="12.5" height="10.5" rx="3.4" {...stroke(ink, 2)} />
  <path d="M28.4 44.2h7.2L32 49Z" fill="#ffb547" />
  <path d="M20 21.5q12-7 24 0" {...stroke('#fff', 2)} opacity=".35" />
</>);

const pip = (c) => (<>
  <circle cx="32" cy="20" r="11.5" fill={c} />
  <path d="M23.6 31.4h16.8l-1.6 3.2c4.1 4 6.6 9 7.6 15.2H17.6c1-6.2 3.5-11.2 7.6-15.2Z" fill={c} />
  <rect x="12.5" y="49" width="39" height="9" rx="4" fill={c} />
  <rect x="12.5" y="49" width="39" height="9" rx="4" fill={ink} opacity=".22" />
  <circle cx="27.5" cy="20" r="2.3" fill={ink} />
  <circle cx="36.5" cy="20" r="2.3" fill={ink} />
  <path d="M27.4 25.2q4.6 3.6 9.2 0" {...stroke(ink, 2.2)} />
  <circle cx="23.6" cy="24.4" r="2" fill="#fff" opacity=".4" />
  <circle cx="40.4" cy="24.4" r="2" fill="#fff" opacity=".4" />
  <circle cx="27.5" cy="13.8" r="2.6" fill="#fff" opacity=".4" />
</>);

export const COACH_FACES = { owl, bear, rabbit, cat, fox, penguin, pip };
