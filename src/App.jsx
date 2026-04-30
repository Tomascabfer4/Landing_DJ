import { LenisProvider } from './lib/lenis.jsx';
import Scanlines from './components/Scanlines.jsx';

export default function App() {
  return (
    <LenisProvider startLocked={true}>
      <Scanlines />
      <main className="min-h-screen grid place-items-center font-display text-fg">
        <h1 className="text-6xl">K1D T0M1</h1>
      </main>
    </LenisProvider>
  );
}
