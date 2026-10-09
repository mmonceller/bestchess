import Modal from '../ui/Modal.jsx';
import Icon from '../icons/Icon.jsx';
import Move from './Move.jsx';
import MoveLine from './MoveLine.jsx';
import './notation.css';

/* Quick guide to reading moves, using the same colours as the rest of the app. */
const PIECES = [
  { letter: 'K', name: 'King', example: 'Ke2' },
  { letter: 'Q', name: 'Queen', example: 'Qh5' },
  { letter: 'R', name: 'Rook', example: 'Rd1' },
  { letter: 'B', name: 'Bishop', example: 'Bc4' },
  { letter: 'N', name: 'Knight', example: 'Nf3', note: 'N, because K is the king' },
];

const SYMBOLS = [
  { kind: 'capture', mark: 'x', label: 'Captures', example: 'Bxc6', text: 'The piece takes whatever stands on that square.' },
  { kind: 'check', mark: '+', label: 'Check', example: 'Qh5+', text: 'The move attacks the enemy king.' },
  { kind: 'mate', mark: '#', label: 'Checkmate', example: 'Qf7#', text: 'The king is attacked and cannot escape. Game over!' },
  { kind: 'castle', mark: 'O-O', label: 'Castling', example: 'O-O', text: 'O-O is short castling (king\'s side); O-O-O is long castling (queen\'s side).' },
  { kind: 'promote', mark: '=Q', label: 'Promotion', example: 'e8=Q', text: 'A pawn reaches the last row and becomes the piece shown.' },
  { kind: 'from', mark: 'b', label: 'Which piece', example: 'Nbd2', text: 'When two pieces could go there, an extra letter or number says which one — here, the knight from the b-file.' },
];

const ANNOTATIONS = [
  { mark: '!', text: 'Good move', tone: 'good' },
  { mark: '!!', text: 'Brilliant move', tone: 'good' },
  { mark: '?', text: 'Mistake', tone: 'bad' },
  { mark: '??', text: 'Blunder', tone: 'bad' },
  { mark: '!?', text: 'Interesting try', tone: 'mixed' },
  { mark: '?!', text: 'Doubtful move', tone: 'mixed' },
];

export default function NotationGuide({ onClose }) {
  return (
    <Modal onClose={onClose} className="notation-guide-modal">
      <div className="notation-guide">
        <header className="ng-head">
          <h2>How to read moves</h2>
          <button className="btn ghost small" onClick={onClose} aria-label="Close"><Icon name="close" size={18} /></button>
        </header>
        <p className="muted">
          Each move is written as <b>piece + square</b>. Colours show what each part means.
          Hover over or tap any move in the app to read it in plain words.
        </p>

        <section>
          <h3><span className="ng-swatch san-piece">K</span> Pieces</h3>
          <div className="ng-pieces">
            {PIECES.map((p) => (
              <div key={p.letter} className="ng-piece">
                <b className="san-piece">{p.letter}</b>
                <span>{p.name}{p.note && <span className="muted small"> — {p.note}</span>}</span>
                <Move san={p.example} />
              </div>
            ))}
            <div className="ng-piece">
              <b className="muted">–</b>
              <span>Pawn <span className="muted small">— no letter, just the square</span></span>
              <Move san="e4" />
            </div>
          </div>
        </section>

        <section>
          <h3><span className="ng-swatch san-square">f3</span> Squares</h3>
          <p>A letter for the column (<b>a</b> to <b>h</b>, left to right from White&apos;s side) and a number for the row (<b>1</b> to <b>8</b>, from White&apos;s side). So <Move san="Nf3" /> means “knight to f3”.</p>
        </section>

        <section>
          <h3>Symbols</h3>
          <div className="ng-symbols">
            {SYMBOLS.map((s) => (
              <div key={s.kind} className="ng-symbol">
                <span className={`ng-swatch san-${s.kind}`}>{s.mark}</span>
                <div>
                  <b>{s.label}</b> <Move san={s.example} />
                  <p className="muted small">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3><span className="ng-swatch san-num">12.</span> Move numbers</h3>
          <p>
            <Move san="Nf3" prefix="12." /> is White&apos;s 12th move. Three dots mean Black&apos;s move: <Move san="Nc6" prefix="12..." />.
            In a line like <MoveLine moves={['e4', 'e5', 'Nf3', 'Nc6']} />, moves take turns: White, Black, White, Black.
          </p>
        </section>

        <section>
          <h3>Comments on moves</h3>
          <div className="ng-annotations">
            {ANNOTATIONS.map((a) => (
              <span key={a.mark} className="ng-annotation">
                <b className={`san-annotation ${a.tone}`}>{a.mark}</b> {a.text}
              </span>
            ))}
          </div>
        </section>
      </div>
    </Modal>
  );
}
