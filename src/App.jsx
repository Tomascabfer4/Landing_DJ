import { LenisProvider } from './lib/lenis.jsx';
import Scanlines from './components/Scanlines.jsx';
import Cursor from './components/Cursor.jsx';
import SectionCurtain from './components/SectionCurtain.jsx';
import Intro from './sections/Intro/Intro.jsx';
import About from './sections/About.jsx';
import DJVisuals from './sections/DJVisuals.jsx';
import Sets from './sections/Sets.jsx';
import Contact from './sections/Contact.jsx';

export default function App() {
  return (
    <LenisProvider startLocked={true}>
      <Scanlines />
      <Cursor />
      <main className="relative text-fg">
        <Intro />
        <SectionCurtain label="01 / ABOUT" />
        <About />
        <SectionCurtain label="02 / LIVE" />
        <DJVisuals />
        <SectionCurtain label="03 / SETS" />
        <Sets />
        <SectionCurtain label="04 / BOOKING" />
        <Contact />
      </main>
    </LenisProvider>
  );
}
