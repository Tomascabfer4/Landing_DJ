import { LenisProvider } from './lib/lenis.jsx';
import Scanlines from './components/Scanlines.jsx';
import Cursor from './components/Cursor.jsx';
import SectionCurtain from './components/SectionCurtain.jsx';
import Intro from './sections/Intro/Intro.jsx';
import About from './sections/About.jsx';
import Sets from './sections/Sets.jsx';
import Gallery from './sections/Gallery.jsx';
import Contact from './sections/Contact.jsx';

export default function App() {
  return (
    <LenisProvider startLocked={true}>
      <Scanlines />
      <Cursor />
      <main className="relative bg-bg text-fg">
        <Intro />
        <SectionCurtain label="01 / ABOUT" />
        <About />
        <SectionCurtain label="02 / SETS" />
        <Sets />
        <SectionCurtain label="03 / GALLERY" />
        <Gallery />
        <SectionCurtain label="04 / BOOKING" />
        <Contact />
      </main>
    </LenisProvider>
  );
}
