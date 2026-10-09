import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { GLYPH, FILES, parseFen } from './pieces.js';
import Arrows from './Arrows.jsx';
import PromotionPicker from './PromotionPicker.jsx';
import Icon from '../icons/Icon.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import './board.css';

const DRAG_THRESHOLD = 4;

function squareAt(row, col, flipped) {
  return flipped ? FILES[7 - col] + (row + 1) : FILES[col] + (8 - row);
}

/*
 * Chessboard with click-to-move and drag-and-drop.
 * getMoves(square) must return chess.js-style verbose moves for that square.
 * `markers` maps squares to icon names drawn on top of the square (e.g. collectible stars).
 */
function Board({
  fen,
  orientation = 'white',
  movableColor = null,
  getMoves,
  onMove,
  lastMove,
  checkSquare,
  arrows,
  highlights,
  markers,
  onSquareClick,
  showCoords,
}) {
  const { settings } = useSettings();
  const coords = showCoords ?? settings.showCoords;
  const flipped = orientation === 'black';
  const pieces = useMemo(() => parseFen(fen), [fen]);
  const [selected, setSelected] = useState(null);
  const [promo, setPromo] = useState(null);
  const [ghost, setGhost] = useState(null);
  const boardRef = useRef(null);
  const drag = useRef(null);

  useEffect(() => { setSelected(null); setPromo(null); }, [fen, movableColor]);

  const targets = useMemo(() => {
    if (!selected || !getMoves) return new Map();
    const map = new Map();
    for (const m of getMoves(selected)) map.set(m.to, m);
    return map;
  }, [selected, getMoves, fen]);

  const canMove = (color) => movableColor === 'both' || movableColor === color;

  function squareFromPoint(x, y) {
    const rect = boardRef.current.getBoundingClientRect();
    const col = Math.floor(((x - rect.left) / rect.width) * 8);
    const row = Math.floor(((y - rect.top) / rect.height) * 8);
    if (col < 0 || col > 7 || row < 0 || row > 7) return null;
    return squareAt(row, col, flipped);
  }

  function tryMove(from, to) {
    const candidates = getMoves(from).filter((m) => m.to === to);
    if (!candidates.length) return false;
    setSelected(null);
    if (candidates.some((m) => m.promotion)) setPromo({ from, to, color: pieces[from].color });
    else onMove?.({ from, to });
    return true;
  }

  function onPointerDown(e) {
    if (promo || (e.button !== undefined && e.button !== 0)) return;
    const sq = squareFromPoint(e.clientX, e.clientY);
    if (!sq) return;
    if (onSquareClick) { onSquareClick(sq); return; }
    if (!movableColor) return;
    const piece = pieces[sq];
    if (selected && selected !== sq && targets.has(sq)) { tryMove(selected, sq); return; }
    if (piece && canMove(piece.color)) {
      drag.current = { from: sq, x: e.clientX, y: e.clientY, moved: false, wasSelected: selected === sq };
      setSelected(sq);
      boardRef.current.setPointerCapture?.(e.pointerId);
    } else {
      setSelected(null);
    }
  }

  function onPointerMove(e) {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < DRAG_THRESHOLD) return;
    d.moved = true;
    const rect = boardRef.current.getBoundingClientRect();
    setGhost({ x: e.clientX - rect.left, y: e.clientY - rect.top, size: rect.width / 8, piece: pieces[d.from] });
  }

  function onPointerUp(e) {
    const d = drag.current;
    drag.current = null;
    setGhost(null);
    if (!d) return;
    const sq = squareFromPoint(e.clientX, e.clientY);
    if (d.moved) {
      if (sq && sq !== d.from) tryMove(d.from, sq);
    } else if (d.wasSelected) {
      setSelected(null);
    }
  }

  function onPointerCancel() {
    drag.current = null;
    setGhost(null);
  }

  const squares = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const sq = squareAt(row, col, flipped);
      const piece = pieces[sq];
      const isLight = (FILES.indexOf(sq[0]) + Number(sq[1])) % 2 === 0;
      const target = targets.get(sq);
      const cls = ['sq', isLight ? 'light' : 'dark'];
      if (lastMove && (lastMove.from === sq || lastMove.to === sq)) cls.push('last');
      if (selected === sq) cls.push('selected');
      if (checkSquare === sq) cls.push('check');
      if (highlights?.[sq]) cls.push(`hl-${highlights[sq]}`);
      squares.push(
        <div key={sq} className={cls.join(' ')} data-square={sq}>
          {coords && col === 0 && <span className="coord rank">{sq[1]}</span>}
          {coords && row === 7 && <span className="coord file">{sq[0]}</span>}
          {piece && (
            <span className={`piece ${piece.color === 'w' ? 'white' : 'black'}${ghost && drag.current?.from === sq ? ' dragging' : ''}`}>
              {GLYPH[piece.type]}
            </span>
          )}
          {markers?.[sq] && <span className={`marker marker-${markers[sq]}`}><Icon name={markers[sq]} size="100%" /></span>}
          {target && <span className={piece || target.flags?.includes('e') ? 'target capture' : 'target'} />}
        </div>,
      );
    }
  }

  return (
    <div className="board-wrap">
      <div
        ref={boardRef}
        className={`board${movableColor || onSquareClick ? ' interactive' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onContextMenu={(e) => e.preventDefault()}
      >
        {squares}
        <Arrows arrows={arrows} flipped={flipped} />
        {ghost && (
          <span
            className={`piece ghost ${ghost.piece.color === 'w' ? 'white' : 'black'}`}
            style={{ width: ghost.size, height: ghost.size, transform: `translate(${ghost.x - ghost.size / 2}px, ${ghost.y - ghost.size / 2}px)` }}
          >
            {GLYPH[ghost.piece.type]}
          </span>
        )}
        {promo && (
          <PromotionPicker
            color={promo.color}
            onPick={(t) => { onMove?.({ from: promo.from, to: promo.to, promotion: t }); setPromo(null); }}
            onCancel={() => setPromo(null)}
          />
        )}
      </div>
    </div>
  );
}

export default memo(Board);
