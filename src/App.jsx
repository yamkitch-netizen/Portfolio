import { useState, useEffect } from "react";
import Home from "./pages/Home";
import CorporatePage from "./pages/CorporatePage";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash);
      // Smooth scroll back to top of page on navigation
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Match both #/corporate and #corporate styles
  const isCorporate = currentPath === "#/corporate" || currentPath === "#corporate";

  return (
    <>
      <Navbar currentPath={currentPath} />
      {isCorporate ? <CorporatePage /> : <Home />}
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default App;