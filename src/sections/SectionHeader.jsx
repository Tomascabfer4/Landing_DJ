export default function SectionHeader({ index, label }) {
  return (
    <div className="flex items-baseline gap-4 mb-12">
      <span className="font-body text-cyan text-xs tracking-[0.4em]">{index}</span>
      <span className="font-body text-fg/60 text-xs tracking-[0.4em] uppercase">/ {label}</span>
      <span className="ml-auto font-body text-fg/40 text-xs">K1D T0M1</span>
    </div>
  );
}
