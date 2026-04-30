import { LenisProvider } from './lib/lenis.jsx';
import Scanlines from './components/Scanlines.jsx';
import Cursor from './components/Cursor.jsx';
import DiagonalMarquees from './sections/Intro/DiagonalMarquees.jsx';

export default function App() {
  return (
    <LenisProvider startLocked={true}>
      <Scanlines />
      <Cursor />
      <main className="relative min-h-screen overflow-hidden">
        <DiagonalMarquees />
      </main>
    </LenisProvider>
  );
}
