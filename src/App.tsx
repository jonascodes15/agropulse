import Nav from "./components/Nav";
import Hero from "./components/Hero";
import InteractiveTour from "./components/InteractiveTour";
import ROICalculator from "./components/ROICalculator";
import PricingMatrix from "./components/PricingMatrix";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-soil-950 text-parchment selection:bg-chlorophyll-bright selection:text-soil-950">
      <Nav />
      <main>
        <Hero />
        <InteractiveTour />
        <ROICalculator />
        <PricingMatrix />
      </main>
      <Footer />
    </div>
  );
}

export default App;
