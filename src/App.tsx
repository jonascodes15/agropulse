import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import TrustStats from "./components/TrustStats";
import InteractiveTour from "./components/InteractiveTour";
import ROICalculator from "./components/ROICalculator";
import PricingMatrix from "./components/PricingMatrix";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const [loading, setLoading] = useState(true);

  // Lock scroll while the boot sequence plays, on first load and on every refresh.
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onFinish={() => setLoading(false)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen bg-soil-950 text-parchment selection:bg-chlorophyll-bright selection:text-soil-950"
      >
        <Nav />
        <main>
          <Hero />
          <TrustStats />
          <InteractiveTour />
          <ROICalculator />
          <PricingMatrix />
        </main>
        <Footer />
      </motion.div>
    </>
  );
}

export default App;
