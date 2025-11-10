import { HouseDesignsPage } from '../components/HouseDesigns';
import { useHouseDesigns } from '../hooks/useHouseDesigns';
import { Preloader } from '../components/Layout';

const HouseDesignsRoute = () => {
  const { loading, error, pageData } = useHouseDesigns();

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2>Error loading House Designs</h2>
        <p>{error}</p>
        <p>Please make sure you have created the House Designs page in Wagtail admin.</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2>House Designs page not found</h2>
        <p>Please create a House Designs Index Page in Wagtail admin.</p>
      </div>
    );
  }

  return <HouseDesignsPage pageData={pageData} />;
};

export default HouseDesignsRoute;
