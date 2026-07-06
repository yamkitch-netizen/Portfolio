import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import WhyChoose from "../components/WhyChoose/WhyChoose";
import EmployeeExperience from "../components/EmployeeExperience/EmployeeExperience";
import WaysToBring from "../components/WaysToBring/WaysToBring";
import OfferStory from "../components/OfferStory/OfferStory";
import Enquiry from "../components/Enquiry/Enquiry";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyChoose />
      <EmployeeExperience/>
      <WaysToBring />
      <OfferStory />
      <Enquiry />
    </>
  );
};

export default Home;