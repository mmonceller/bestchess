import { useEffect, useRef, useState } from 'react';
import { online } from '../../api/onlineSocket.js';
import Icon from '../../components/icons/Icon.jsx';

const QUICK = ['Good luck!', 'Nice move!', 'Oops!', 'Good game!', 'Rematch?'];

export default function ChatBox({ messages = [], canSend, you }) {
  const [text, setText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  function send(t) {
    const v = (t ?? text).trim();
    if (!v) return;
    online.chat(v);
    setText('');
  }

  return (
    <div className="card chat">
      <h3 className="icon-text"><Icon name="chat" size={18} /> Chat</h3>
      <div className="chat-list" ref={listRef}>
        {!messages.length && <div className="muted small">Say hi to your opponent!</div>}
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg${m.color === you ? ' mine' : ''}`}>
            <b>{m.from}</b> {m.text}
          </div>
        ))}
      </div>
      {canSend && (
        <>
          <div className="chat-quick">
            {QUICK.map((q) => <button key={q} className="btn small ghost" onClick={() => send(q)}>{q}</button>)}
          </div>
          <form className="row" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <input className="input" style={{ flex: 1 }} value={text} maxLength={200} placeholder="Message" onChange={(e) => setText(e.target.value)} />
            <button className="btn">Send</button>
          </form>
        </>
      )}
    </div>
  );
}
