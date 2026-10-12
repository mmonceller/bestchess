import { useEffect, useState } from 'react';
import ComputerSetup from './ComputerSetup.jsx';
import ComputerGame from './ComputerGame.jsx';
import { loadSavedGames, clearSavedGame, MAX_BOT_GAMES } from './savedGame.js';
import { useExpiredGame } from './expiry/useExpiredGame.js';
import { isExpired } from './expiry/inactivity.js';
import ExpiredNote from './expiry/ExpiredNote.jsx';
import { resignBotGame } from './resign/resignBotGame.js';
import { useAuth } from '../../context/AuthContext.jsx';

function resumeConfig(resumeId) {
  if (!resumeId) return null;
  const g = loadSavedGames().find((x) => x.id === resumeId && !isExpired(x));
  if (!g) return null;
  return { color: g.color, level: g.level, pgn: g.pgn, hints: g.hints, id: g.id, key: Date.now() };
}

export default function PlayComputerPage({ resumeId, levelId }) {
  const { user, refresh } = useAuth();
  const [config, setConfig] = useState(() => resumeConfig(resumeId));
  const [, setRev] = useState(0);
  const expired = useExpiredGame();
  const saved = loadSavedGames().filter((g) => !isExpired(g));
  const preferred = Number(levelId);
  const level = Number.isInteger(preferred) && preferred >= 1 && preferred <= 8 ? preferred : null;

  useEffect(() => { setConfig(resumeConfig(resumeId)); }, [resumeId]);

  if (!config) {
    return (
      <ComputerSetup
        key={level ?? 'default'}
        preferredLevel={level}
        saved={saved}
        notice={expired.notes.map((note, i) => (
          <ExpiredNote key={`${note.level}-${note.movedAt}-${i}`} note={note} onDismiss={() => expired.dismiss(i)} />
        ))}
        onStart={(c) => {
          if (saved.length >= MAX_BOT_GAMES) return;
          expired.dismiss();
          setConfig({ ...c, id: Date.now().toString(36), key: Date.now() });
        }}
        onResume={(g) => setConfig({ color: g.color, level: g.level, pgn: g.pgn, hints: g.hints, id: g.id, key: Date.now() })}
        onResign={async (g) => { await resignBotGame(g, user, refresh); setRev((n) => n + 1); }}
      />
    );
  }
  return (
    <ComputerGame
      key={config.key}
      gameId={config.id}
      color={config.color}
      level={config.level}
      initialPgn={config.pgn}
      initialHints={config.hints}
      onNewGame={() => { clearSavedGame(config.id); setConfig(null); }}
      onRematch={() => { clearSavedGame(config.id); setConfig({ ...config, pgn: null, hints: null, id: Date.now().toString(36), key: Date.now() }); }}
    />
  );
}
