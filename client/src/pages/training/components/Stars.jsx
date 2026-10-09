import Icon from '../../../components/icons/Icon.jsx';

export default function Stars({ value = 0, size = 'small' }) {
  return (
    <span className={`stars ${size}`} aria-label={`${value} of 3 stars`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= value ? 'on' : ''} style={{ animationDelay: `${i * 0.15}s` }}>
          <Icon name="star" size="1em" />
        </span>
      ))}
    </span>
  );
}
