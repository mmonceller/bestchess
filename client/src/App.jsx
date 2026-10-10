import { lazy, Suspense } from 'react';
import { useRoute } from './router/router.js';
import Hud from './components/layout/Hud.jsx';
import HomePage from './pages/home/HomePage.jsx';
import MoveTooltip from './components/notation/MoveTooltip.jsx';

const PlayComputerPage = lazy(() => import('./pages/computer/PlayComputerPage.jsx'));
const OnlinePage = lazy(() => import('./pages/online/OnlinePage.jsx'));
const TrainingHub = lazy(() => import('./pages/training/TrainingHub.jsx'));
const LessonPlayer = lazy(() => import('./pages/training/LessonPlayer.jsx'));
const PatternTrainer = lazy(() => import('./pages/training/patterns/PatternTrainer.jsx'));
const WoodpeckerPage = lazy(() => import('./pages/training/woodpecker/WoodpeckerPage.jsx'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage.jsx'));
const GameReviewPage = lazy(() => import('./pages/review/GameReviewPage.jsx'));
const AuthPage = lazy(() => import('./pages/auth/AuthPage.jsx'));
const TermsPage = lazy(() => import('./pages/terms/TermsPage.jsx'));

function Page({ route }) {
  const [section, param] = route.path;
  switch (section) {
    case 'computer': return <PlayComputerPage />;
    case 'online': return <OnlinePage code={param} key={param || 'lobby'} />;
    case 'training': {
      const start = route.query.get('start');
      return param ? <LessonPlayer lessonId={param} start={start} key={`${param}-${start || ''}`} /> : <TrainingHub />;
    }
    case 'puzzles':
      return param === 'woodpecker' ? <WoodpeckerPage setId={route.path[2]} /> : <PatternTrainer />;
    case 'profile': return <ProfilePage />;
    case 'review':
    case 'replay':
      return (
        <GameReviewPage
          gameId={param}
          autoStart={route.query.get('start') === '1'}
          initialPly={route.query.has('ply') ? Number(route.query.get('ply')) : null}
          key={`${param || 'local'}-${route.query.get('start')}-${route.query.get('ply')}`}
        />
      );
    case 'login': return <AuthPage next={route.query.get('next')} />;
    case 'terms': return <TermsPage termId={param} query={route.query.get('q') || ''} key={`${param || ''}-${route.query.get('q') || ''}`} />;
    default: return <HomePage />;
  }
}

export default function App() {
  const route = useRoute();
  const section = route.path[0] || null;
  return (
    <>
      <Hud section={section} param={route.path[1] || null} />
      <main className={`app-main${section ? '' : ' is-home'}`}>
        <Suspense fallback={<div className="center muted" style={{ padding: 40 }}><span className="spinner" /></div>}>
          <Page route={route} />
        </Suspense>
      </main>
      <MoveTooltip />
    </>
  );
}
