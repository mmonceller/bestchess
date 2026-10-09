import { lazy, Suspense } from 'react';
import { useRoute } from './router/router.js';
import Hud from './components/layout/Hud.jsx';
import HomePage from './pages/home/HomePage.jsx';

const PlayComputerPage = lazy(() => import('./pages/computer/PlayComputerPage.jsx'));
const OnlinePage = lazy(() => import('./pages/online/OnlinePage.jsx'));
const TrainingHub = lazy(() => import('./pages/training/TrainingHub.jsx'));
const LessonPlayer = lazy(() => import('./pages/training/LessonPlayer.jsx'));
const PatternTrainer = lazy(() => import('./pages/training/patterns/PatternTrainer.jsx'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage.jsx'));
const GameReplay = lazy(() => import('./pages/profile/GameReplay.jsx'));
const AuthPage = lazy(() => import('./pages/auth/AuthPage.jsx'));

function Page({ route }) {
  const [section, param] = route.path;
  switch (section) {
    case 'computer': return <PlayComputerPage />;
    case 'online': return <OnlinePage code={param} key={param || 'lobby'} />;
    case 'training': return param ? <LessonPlayer lessonId={param} key={param} /> : <TrainingHub />;
    case 'puzzles': return <PatternTrainer />;
    case 'profile': return <ProfilePage />;
    case 'replay': return <GameReplay gameId={param} />;
    case 'login': return <AuthPage next={route.query.get('next')} />;
    default: return <HomePage />;
  }
}

export default function App() {
  const route = useRoute();
  const section = route.path[0] || null;
  return (
    <>
      <Hud section={section} />
      <main className={`app-main${section ? '' : ' is-home'}`}>
        <Suspense fallback={<div className="center muted" style={{ padding: 40 }}><span className="spinner" /></div>}>
          <Page route={route} />
        </Suspense>
      </main>
    </>
  );
}
