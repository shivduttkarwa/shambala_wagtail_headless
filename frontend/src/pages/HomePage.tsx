import NewHeroSection from '../components/Home/NewHeroSection';
import { EssenceSection, PortfolioSection } from '../components/Home';
import OurVisionSection from '../components/Home/OurVisionSection';
import BodyRenderer from '../components/BodyRenderer';
import { useHome } from '../hooks/useHome';
import { SiteSettings } from '../services/api';

interface HomePageProps {
  settings: SiteSettings | null;
}

const HomePage: React.FC<HomePageProps> = ({ settings: _ }) => {
  const { bodyBlocks } = useHome();
  
  console.log('HomePage bodyBlocks:', bodyBlocks);

  return (
    <>
      <NewHeroSection />
      <EssenceSection />
      <OurVisionSection />
      <PortfolioSection />
      <BodyRenderer blocks={bodyBlocks} />
    </>
  );
};

export default HomePage;
