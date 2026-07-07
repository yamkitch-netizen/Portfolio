import Hero from "../components/Hero/Hero";
import WhyChoose from "../components/WhyChoose/WhyChoose";
import EmployeeExperience from "../components/EmployeeExperience/EmployeeExperience";
import WaysToBring from "../components/WaysToBring/WaysToBring";
import TripuraVideo from "../components/TripuraVideo/TripuraVideo";
import OfferStory from "../components/OfferStory/OfferStory";
import GoogleReview from "../components/GoogleReview/GoogleReview";
import Enquiry from "../components/Enquiry/Enquiry";

const Home = ({ openModal }) => {
  return (
    <>
      <Hero openModal={openModal} />
      <WhyChoose />
      
      <WaysToBring openModal={openModal} />
      <TripuraVideo />
      
      <GoogleReview />
      <Enquiry />
    </>
  );
};

export default Home;