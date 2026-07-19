export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-soil-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2 focus-ring rounded">
          <span className="h-2 w-2 rounded-full bg-chlorophyll-bright animate-pulse-slow" aria-hidden="true" />
          <span className="font-display text-lg font-semibold tracking-tight text-parchment">
            AgroPulse
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-parchment-dim md:flex">
          <a href="#tour" className="hover:text-parchment transition-colors focus-ring rounded">Platform</a>
          <a href="#roi" className="hover:text-parchment transition-colors focus-ring rounded">ROI Calculator</a>
          <a href="#pricing" className="hover:text-parchment transition-colors focus-ring rounded">Pricing</a>
        </nav>

        <a
          href="#pricing"
          className="focus-ring rounded-md bg-chlorophyll px-4 py-2 text-sm font-medium text-soil-950 transition-colors hover:bg-chlorophyll-bright"
        >
          Request a demo
        </a>
      </div>
    </header>
  );
}
