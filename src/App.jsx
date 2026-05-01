import { LenisProvider } from './lib/lenis.jsx';
import Scanlines from './components/Scanlines.jsx';
import Cursor from './components/Cursor.jsx';
import SectionDivider from './components/SectionDivider.jsx';
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
        <SectionDivider text="ABOUT" />
        <About />
        <SectionDivider text="LIVE" />
        <DJVisuals />
        <SectionDivider text="SETS" />
        <Sets />
        <SectionDivider text="BOOKING" />
        <Contact />
      </main>
    </LenisProvider>
  );
}
