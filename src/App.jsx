import { useState, useEffect } from "react";
import Home from "./pages/Home";
import CorporatePage from "./pages/CorporatePage";
import AboutPage from "./pages/AboutPage";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton";
import SubscriptionModal from "./components/SubscriptionModal/SubscriptionModal";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("subscription");

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash);
      // Smooth scroll back to top of page on navigation
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Match current hash routes
  const isCorporate = currentPath === "#/corporate" || currentPath === "#corporate";
  const isAbout = currentPath === "#/about" || currentPath === "#about";

  return (
    <>
      <Navbar currentPath={currentPath} />
      {isCorporate ? (
        <CorporatePage />
      ) : isAbout ? (
        <AboutPage />
      ) : (
        <Home openModal={openModal} />
      )}
      <Footer />
      <WhatsAppButton />
      <SubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialType={modalType} />
    </>
  );
}

export default App;