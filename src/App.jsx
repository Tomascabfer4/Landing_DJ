import { LenisProvider } from './lib/lenis.jsx';
import AmbientField from './components/AmbientField.jsx';
import Scanlines from './components/Scanlines.jsx';
import Cursor from './components/Cursor.jsx';
import SectionDivider from './components/SectionDivider.jsx';
import TunnelPortal from './components/TunnelPortal.jsx';
import Intro from './sections/Intro/Intro.jsx';
import About from './sections/About.jsx';
import DJVisuals from './sections/DJVisuals.jsx';
import Sets from './sections/Sets.jsx';
import Contact from './sections/Contact.jsx';

export default function App() {
  return (
    <LenisProvider startLocked={true}>
      <AmbientField />
      <Scanlines />
      <Cursor />
      <main className="relative z-[1] text-fg">
        <Intro />
        <TunnelPortal label="ABOUT">
          <About />
        </TunnelPortal>
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
