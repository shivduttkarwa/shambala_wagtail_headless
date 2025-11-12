import NewHeroSection from '../components/Home/NewHeroSection';
import BodyRenderer from '../components/BodyRenderer';
import { useHome } from '../hooks/useHome';
import { Preloader } from '../components/Layout';
import { SiteSettings } from '../services/api';

interface HomePageProps {
  settings: SiteSettings;
}

const HomePage: React.FC<HomePageProps> = ({ settings: _ }) => {
  const { loading, bodyBlocks } = useHome();

  if (loading) {
    return <Preloader />;
  }

  return (
    <>
      <NewHeroSection />
      <BodyRenderer blocks={bodyBlocks} />
    </>
  );
};

export default HomePage;
