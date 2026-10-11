import { useState } from 'react';
import ComputerSetup from './ComputerSetup.jsx';
import ComputerGame from './ComputerGame.jsx';
import { loadSavedGames, clearSavedGame } from './savedGame.js';
import { useExpiredGame } from './expiry/useExpiredGame.js';
import { isExpired } from './expiry/inactivity.js';
import ExpiredNote from './expiry/ExpiredNote.jsx';
import { resignBotGame } from './resign/resignBotGame.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function PlayComputerPage() {
  const { user, refresh } = useAuth();
  const [config, setConfig] = useState(null);
  const [, setRev] = useState(0);
  const expired = useExpiredGame();
  const saved = loadSavedGames().filter((g) => !isExpired(g));

  if (!config) {
    return (
      <ComputerSetup
        saved={saved}
        notice={expired.notes.map((note, i) => (
          <ExpiredNote key={`${note.level}-${note.movedAt}-${i}`} note={note} onDismiss={() => expired.dismiss(i)} />
        ))}
        onStart={(c) => { expired.dismiss(); setConfig({ ...c, id: Date.now().toString(36), key: Date.now() }); }}
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
