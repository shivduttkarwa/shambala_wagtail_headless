import NewHeroSection from '../components/Home/NewHeroSection';
import BodyRenderer from '../components/BodyRenderer';
import { useHome } from '../hooks/useHome';
import { Preloader } from '../components/Layout';

const HomePage = () => {
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
