import { useEffect, useState } from 'react';
import Icon from '../../icons/Icon.jsx';
import { formatCountdown } from './inviteExpiry.js';
import './inviteExpiry.css';

const URGENT_MS = 5 * 60_000;

/* Live countdown to an invite's expiry. `expiresIn` is the time left (ms) when the server last spoke. */
export default function InviteCountdown({ expiresIn }) {
  const [deadline, setDeadline] = useState(() => Date.now() + expiresIn);
  const [now, setNow] = useState(Date.now);

  useEffect(() => { setDeadline(Date.now() + expiresIn); }, [expiresIn]);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const left = Math.max(0, deadline - now);
  return (
    <div className={`invite-countdown${left < URGENT_MS ? ' urgent' : ''}`} role="timer" aria-live="off">
      <Icon name="clock" size={15} />
      {left ? <span>Invite expires in <b>{formatCountdown(left)}</b></span> : <span>Invite expired</span>}
    </div>
  );
}
