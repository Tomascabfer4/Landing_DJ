import Marquee from '../../components/Marquee.jsx';

const SEP = ' ★ ';

export default function DiagonalMarquees({ blur = 0 }) {
  const row1 = `K1D T0M1${SEP}TECHNO${SEP}URBAN${SEP}PRODUCER${SEP}`.repeat(6);
  const row2 = `MORE THAN MUSIC${SEP}AN EXPERIENCE${SEP}LIVE THE BEAT${SEP}`.repeat(4);

  return (
    <div
      className="pointer-events-none absolute right-[-10%] top-0 h-full w-[55%] z-[5]"
      style={{ filter: `blur(${blur}px)` }}
    >
      <Marquee
        text={row1}
        direction="left"
        speed={50}
        rotate={-22}
        className="absolute top-[8%] right-[-30%] w-[180%] font-display text-[clamp(3rem,7vw,7rem)] text-fg/70 leading-none"
      />
      <Marquee
        text={row2}
        direction="right"
        speed={70}
        rotate={-22}
        className="absolute bottom-[10%] right-[-30%] w-[180%] font-display text-[clamp(2rem,5vw,5rem)] text-cyan/60 leading-none tracking-tight"
      />
    </div>
  );
}
