import { useState } from 'react';
import Icon from '../icons/Icon.jsx';
import Modal from '../ui/Modal.jsx';
import './resumeList.css';

function Action({ item }) {
  const cls = `btn small ${item.kind === 'rematch' ? 'good' : 'primary'} icon-text`;
  const label = item.kind === 'rematch' ? 'Rematch?' : 'Resume';
  const icon = item.kind === 'rematch' ? 'retry' : 'play';
  const inner = <><Icon name={icon} size={14} /> {label}</>;
  if (item.href) return <a href={item.href} className={cls}>{inner}</a>;
  return <button type="button" className={cls} onClick={item.onClick}>{inner}</button>;
}

function Extra({ item, onAskResign }) {
  return (
    <span className="resume-actions">
      {item.onAcceptResign && (
        <button type="button" className="btn small good" onClick={item.onAcceptResign}>Accept</button>
      )}
      {item.onDeclineResign && (
        <button type="button" className="btn small" onClick={item.onDeclineResign}>Decline</button>
      )}
      {item.onWithdrawResign && (
        <button type="button" className="btn small" onClick={item.onWithdrawResign}>Withdraw</button>
      )}
      {item.onResign && (
        <button type="button" className="btn small danger icon-text" onClick={() => onAskResign(item)}>
          <Icon name="flag" size={14} /> Resign
        </button>
      )}
      <Action item={item} />
    </span>
  );
}

function Banner({ item, onAskResign }) {
  return (
    <div className="resume-banner">
      <span>{item.blurb || <>You have an unfinished game against <b>{item.name}</b>. {item.detail}</>}</span>
      <Extra item={item} onAskResign={onAskResign} />
    </div>
  );
}

function Row({ item, onAskResign }) {
  return (
    <div className={`resume-row${item.yourTurn ? ' your-turn' : ''}`}>
      {item.dot}
      <span className="resume-copy">
        <b>{item.name}</b>
        {item.started ? <span className="muted"> · {item.started}</span> : null}
        {item.detail ? <span className="muted small resume-detail">{item.detail}</span> : null}
      </span>
      <Extra item={item} onAskResign={onAskResign} />
    </div>
  );
}

/*
 * One unfinished game keeps the roomy banner. Two or more become a compact list:
 * opponent on the left, Resign and Resume on the right.
 */
export default function ResumeList({ items = [], label }) {
  const [ask, setAsk] = useState(null);
  if (!items.length) return null;
  const body = items.length === 1
    ? <Banner item={items[0]} onAskResign={setAsk} />
    : (
      <div className="resume-stack">
        {label ? <span className="label">{label}</span> : null}
        <div className="resume-list">
          {items.map((item) => <Row key={item.id} item={item} onAskResign={setAsk} />)}
        </div>
      </div>
    );
  return (
    <>
      {body}
      {ask && (
        <Modal onClose={() => setAsk(null)}>
          <h2>Resign this game?</h2>
          <p className="muted">{ask.resignConfirm || `This counts as a loss against ${ask.name}.`}</p>
          <div className="row" style={{ marginTop: 12 }}>
            <span className="spacer" />
            <button type="button" className="btn" onClick={() => setAsk(null)}>Keep it</button>
            <button
              type="button"
              className="btn danger"
              onClick={() => { ask.onResign(); setAsk(null); }}
            >
              Resign
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
