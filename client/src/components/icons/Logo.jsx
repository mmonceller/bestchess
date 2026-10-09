import Icon from './Icon.jsx';

export default function Logo({ size = 40 }) {
  return (
    <span className="logo-mark" style={{ width: size, height: size }}>
      <Icon name="knight" size={size * 0.62} />
    </span>
  );
}
