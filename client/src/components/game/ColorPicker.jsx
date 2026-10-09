import Icon from '../icons/Icon.jsx';

const OPTIONS = [
  { value: 'w', label: 'White', icon: 'king', cls: 'pick-white' },
  { value: 'random', label: 'Random', icon: 'random', cls: '' },
  { value: 'b', label: 'Black', icon: 'king', cls: 'pick-black' },
];

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="segmented">
      {OPTIONS.map((o) => (
        <button key={o.value} type="button" className={value === o.value ? 'active' : ''} onClick={() => onChange(o.value)}>
          <span className={`pick-icon ${o.cls}`}><Icon name={o.icon} size={18} /></span>{o.label}
        </button>
      ))}
    </div>
  );
}
