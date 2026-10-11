import ChipRow from '../../../../components/ui/chipRow/ChipRow.jsx';
import { focusInfo } from '../../../../training/patterns/groups.js';

/* The pattern trainer's focus picker: "Mixed" first, then every unlocked pattern or group. */
export default function FocusChips({ patterns, focus, onChoose }) {
  const items = [
    { id: null, label: 'Mixed', icon: 'random' },
    ...patterns.map((id) => {
      const p = focusInfo(id);
      return { id, label: p.name, icon: p.icon, color: p.color };
    }),
  ];
  return <ChipRow items={items} value={focus ?? null} onChange={onChoose} label="Choose what to practice" moreLabel="Show more patterns" />;
}
