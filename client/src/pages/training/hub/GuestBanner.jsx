import Icon from '../../../components/icons/Icon.jsx';

export default function GuestBanner() {
  return (
    <div className="guest-banner" role="note">
      <Icon name="warning" size={20} />
      <p>
        <b>You're learning as a guest.</b> Your progress will not be saved when you leave this page.{' '}
        <a className="link" href="#/login?next=/training">Log in or sign up</a> to keep it.
      </p>
    </div>
  );
}
