import OnlineLobby from './OnlineLobby.jsx';
import OnlineGame from './OnlineGame.jsx';
import './online.css';

export default function OnlinePage({ code }) {
  return code ? <OnlineGame code={code.toUpperCase()} /> : <OnlineLobby />;
}
