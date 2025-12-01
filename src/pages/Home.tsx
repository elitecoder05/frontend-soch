import { IntroductionHero } from "@/components/IntroductionHero";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/explorer');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <IntroductionHero onGetStarted={handleGetStarted} />
      <Footer />
    </div>
  );
};

export default Home;
