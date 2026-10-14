import { useEffect, useState } from 'react';

/* Temporary control. Remove this folder when goal points are no longer edited by hand. */
export default function GoalPointsEditor({ username, points, onSave }) {
  const [value, setValue] = useState(String(points));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { setValue(String(points)); }, [points]);

  const next = Number(value);
  const valid = value.trim() !== '' && Number.isInteger(next) && next >= 0 && next <= 1_000_000;
  const dirty = valid && next !== points;

  async function submit(e) {
    e.preventDefault();
    if (!dirty || busy) return;
    setBusy(true);
    setError('');
    setSaved(false);
    try {
      await onSave(next);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-goal" onSubmit={submit}>
      <label htmlFor={`goal-${username}`}>Goal points</label>
      <div className="admin-goal-row">
        <input
          id={`goal-${username}`}
          className="input"
          inputMode="numeric"
          value={value}
          onChange={(e) => { setValue(e.target.value); setSaved(false); }}
          aria-label={`Goal points for ${username}`}
        />
        <button className="btn small primary" type="submit" disabled={!dirty || busy}>
          {busy ? 'Saving' : 'Save'}
        </button>
        {saved && <span className="muted small">Saved</span>}
      </div>
      {error && <p className="admin-error">{error}</p>}
    </form>
  );
}
