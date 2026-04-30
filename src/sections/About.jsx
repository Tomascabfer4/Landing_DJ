import SectionHeader from './SectionHeader.jsx';
import RevealImage from '../components/RevealImage.jsx';
import MagneticButton from '../components/MagneticButton.jsx';
import StatNumber from './StatNumber.jsx';

export default function About() {
  return (
    <section id="about" className="relative px-6 sm:px-12 py-32">
      <SectionHeader index="01" label="ABOUT" />

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <RevealImage
          src="/images/portrait/1.png"
          alt="K1D T0M1 portrait"
          direction="top"
          className="lg:col-span-5 aspect-[4/5] w-full"
          imgClassName="h-full w-full object-cover"
        />

        <div className="lg:col-span-7 flex flex-col gap-6">
          <h2 className="font-display text-[clamp(3rem,8vw,8rem)] leading-[0.9] text-fg">
            K1D T0M1
          </h2>
          <p className="font-body text-fg/80 text-lg leading-relaxed max-w-prose">
            Productor y DJ moviéndose entre techno crudo y energía urbana. Cada set construye
            un viaje físico: graves cargados, texturas oxidadas, momentos hipnóticos.
          </p>
          <p className="font-body text-fg/60 leading-relaxed max-w-prose">
            Más que música — una experiencia. Sesiones en clubs, warehouses y eventos privados
            por toda Europa.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <MagneticButton
              as="a"
              href="https://instagram.com/"
              className="font-body uppercase tracking-[0.3em] text-sm border border-fg/30 px-6 py-3 hover:border-cyan hover:text-cyan transition-colors"
            >
              + Instagram
            </MagneticButton>
            <MagneticButton
              as="a"
              href="https://soundcloud.com/"
              className="font-body uppercase tracking-[0.3em] text-sm border border-fg/30 px-6 py-3 hover:border-magenta hover:text-magenta transition-colors"
            >
              + SoundCloud
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-fg/10 pt-10">
        <Stat label="YEARS"   value={5}   suffix="" />
        <Stat label="SETS"    value={120} suffix="+" />
        <Stat label="TRACKS"  value={30}  suffix="" />
        <Stat label="TOUR"    value="EU"  suffix="" />
      </div>
    </section>
  );
}

function Stat({ label, value, suffix }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[clamp(2.5rem,6vw,5rem)] leading-none">
        {typeof value === 'number'
          ? <StatNumber to={value} suffix={suffix} />
          : <span className="font-display text-cyan">{value}</span>}
      </span>
      <span className="font-body text-xs tracking-[0.3em] text-fg/50 uppercase">{label}</span>
    </div>
  );
}
