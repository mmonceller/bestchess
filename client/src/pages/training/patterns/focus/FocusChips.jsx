import ChipRow from '../../../../components/ui/chipRow/ChipRow.jsx';
import { PATTERNS } from '../../../../training/patterns/patterns.js';

/* The pattern trainer's focus picker: "Mixed" first, then every unlocked pattern. */
export default function FocusChips({ patterns, focus, onChoose }) {
  const items = [
    { id: null, label: 'Mixed', icon: 'random' },
    ...patterns.map((id) => ({ id, label: PATTERNS[id].name, icon: PATTERNS[id].icon, color: PATTERNS[id].color })),
  ];
  return <ChipRow items={items} value={focus ?? null} onChange={onChoose} label="Choose what to practice" moreLabel="Show more patterns" />;
}
