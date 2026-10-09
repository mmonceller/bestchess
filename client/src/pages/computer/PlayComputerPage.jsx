import { useState } from 'react';
import ComputerSetup from './ComputerSetup.jsx';
import ComputerGame from './ComputerGame.jsx';
import { loadSavedGame, clearSavedGame } from './savedGame.js';

export default function PlayComputerPage() {
  const [config, setConfig] = useState(null);
  const saved = loadSavedGame();

  if (!config) {
    return (
      <ComputerSetup
        saved={saved}
        onStart={(c) => { clearSavedGame(); setConfig({ ...c, key: Date.now() }); }}
        onResume={() => setConfig({ color: saved.color, level: saved.level, pgn: saved.pgn, key: Date.now() })}
      />
    );
  }
  return (
    <ComputerGame
      key={config.key}
      color={config.color}
      level={config.level}
      initialPgn={config.pgn}
      onNewGame={() => { clearSavedGame(); setConfig(null); }}
      onRematch={() => { clearSavedGame(); setConfig({ ...config, pgn: null, key: Date.now() }); }}
    />
  );
}
