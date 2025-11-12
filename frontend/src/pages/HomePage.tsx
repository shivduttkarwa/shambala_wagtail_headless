import NewHeroSection from '../components/Home/NewHeroSection';
import BodyRenderer from '../components/BodyRenderer';
import { useHome } from '../hooks/useHome';
import { SiteSettings } from '../services/api';

interface HomePageProps {
  settings: SiteSettings | null;
}

const HomePage: React.FC<HomePageProps> = ({ settings: _ }) => {
  const { bodyBlocks } = useHome();

  return (
    <>
      <NewHeroSection />
      <BodyRenderer blocks={bodyBlocks} />
    </>
  );
};

export default HomePage;
