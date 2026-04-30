import { LenisProvider } from './lib/lenis.jsx';

export default function App() {
  return (
    <LenisProvider startLocked={true}>
      <main className="min-h-screen grid place-items-center font-display text-fg">
        <h1 className="text-6xl">K1D T0M1</h1>
      </main>
    </LenisProvider>
  );
}
