import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { navigate } from '../../router/router.js';
import { mergeGuestProgress } from '../../training/progressStore.js';
import { mergeGuestTrainer } from '../../training/trainerStore.js';
import Logo from '../../components/icons/Logo.jsx';

export default function AuthPage({ next }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await (mode === 'login' ? login : register)(username.trim(), password);
      await Promise.all([mergeGuestProgress(), mergeGuestTrainer()]).catch(() => {});
      navigate(next || '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card fade-in" style={{ maxWidth: 400, margin: '20px auto' }}>
      <div className="center" style={{ marginBottom: 14 }}><Logo size={52} /></div>
      <div className="segmented" style={{ marginBottom: 12 }}>
        <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Log in</button>
        <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Create account</button>
      </div>
      <p className="muted">
        {mode === 'login'
          ? 'Welcome back! Your games and lesson progress are waiting for you.'
          : 'Save every game, keep your lesson stars and XP, and earn an online rating.'}
      </p>
      <form onSubmit={submit}>
        <label className="label" htmlFor="u">Username</label>
        <input id="u" className="input" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} maxLength={20} />
        <label className="label" htmlFor="p">Password</label>
        <input id="p" className="input" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        {error && <div className="error-text">{error}</div>}
        <button className="btn primary block" style={{ marginTop: 16 }} disabled={busy}>
          {busy ? <span className="spinner" /> : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
