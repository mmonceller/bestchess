import { ICONS } from './iconSet.jsx';
import './icons.css';

export default function Icon({ name, size = 20, className = '', title, style }) {
  const shape = ICONS[name];
  if (!shape) return null;
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={style}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {shape}
    </svg>
  );
}
