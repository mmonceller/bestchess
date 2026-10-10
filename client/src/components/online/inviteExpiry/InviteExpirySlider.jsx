import { INVITE_STEPS, formatDuration } from './inviteExpiry.js';
import './inviteExpiry.css';

/* Picks how long a new game's invite stays open, from 10 minutes to 24 hours. */
export default function InviteExpirySlider({ value, onChange }) {
  const index = Math.max(0, INVITE_STEPS.indexOf(value));
  const last = INVITE_STEPS.length - 1;
  return (
    <div className="invite-expiry">
      <div className="invite-expiry-head">
        <label htmlFor="invite-expiry" title="If your friend hasn't joined by then, the code stops working.">Invite expires after</label>
        <b>{formatDuration(value)}</b>
      </div>
      <input
        id="invite-expiry"
        type="range"
        min={0}
        max={last}
        step={1}
        value={index}
        onChange={(e) => onChange(INVITE_STEPS[Number(e.target.value)])}
        aria-valuetext={formatDuration(value)}
        style={{ '--fill': `${(index / last) * 100}%` }}
      />
      <div className="invite-expiry-ends muted small">
        <span>{formatDuration(INVITE_STEPS[0])}</span>
        <span>{formatDuration(INVITE_STEPS[last])}</span>
      </div>
    </div>
  );
}
