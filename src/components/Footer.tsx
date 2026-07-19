export default function Footer() {
  return (
    <footer className="border-t border-line/70 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-parchment-faint sm:flex-row">
        <p>© {new Date().getFullYear()} AgroPulse. Built as a portfolio demo.</p>
        <p className="readout text-xs">v1.0.0 · NORTH-BLOCK-DEMO</p>
      </div>
    </footer>
  );
}
