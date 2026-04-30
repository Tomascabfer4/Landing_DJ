import { LenisProvider } from './lib/lenis.jsx';
import Scanlines from './components/Scanlines.jsx';
import Cursor from './components/Cursor.jsx';
import Intro from './sections/Intro/Intro.jsx';
import About from './sections/About.jsx';

export default function App() {
  return (
    <LenisProvider startLocked={true}>
      <Scanlines />
      <Cursor />
      <main className="relative bg-bg text-fg">
        <Intro />
        <About />
      </main>
    </LenisProvider>
  );
}
