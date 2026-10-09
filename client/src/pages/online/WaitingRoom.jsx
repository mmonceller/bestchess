import { useState } from 'react';
import Icon from '../../components/icons/Icon.jsx';

export default function WaitingRoom({ code, options }) {
  const [copied, setCopied] = useState('');
  const link = `${location.origin}${location.pathname}#/online/${code}`;

  async function copy(text, what) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      setCopied('');
    }
  }

  async function share() {
    try { await navigator.share({ title: 'Play chess with me', text: `Join my BestChess game with code ${code}`, url: link }); } catch { /* cancelled */ }
  }

  const tc = options.minutes ? `${options.minutes} + ${options.increment}` : 'No clock';

  return (
    <div className="card waiting center">
      <div className="muted">Share this code with your friend</div>
      <div className="code-display">{code.split('').map((ch, i) => <span key={i}>{ch}</span>)}</div>
      <div className="row" style={{ justifyContent: 'center' }}>
        <button className="btn small" onClick={() => copy(code, 'code')}><Icon name={copied === 'code' ? 'check' : 'copy'} size={15} /> {copied === 'code' ? 'Copied' : 'Copy code'}</button>
        <button className="btn small" onClick={() => copy(link, 'link')}><Icon name={copied === 'link' ? 'check' : 'link'} size={15} /> {copied === 'link' ? 'Copied' : 'Copy link'}</button>
        {navigator.share && <button className="btn small primary" onClick={share}><Icon name="share" size={15} /> Share</button>}
      </div>
      <p className="muted small" style={{ marginTop: 10 }}>
        <span className="spinner" style={{ width: 12, height: 12, verticalAlign: -1 }} /> Waiting for opponent · {tc}{options.allowHints ? ' · hints on' : ''}
      </p>
    </div>
  );
}
