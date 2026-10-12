import { aimText } from '../../../../training/woodpecker/aim.js';

/* After the line, one or two sentences on what the exercise was actually for. */
export default function AimNote({ puzzle }) {
  const text = aimText(puzzle);
  if (!text) return null;
  return <p className="wp-aim">{text}</p>;
}
