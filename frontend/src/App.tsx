import './styles/App.css';
import { Header, Footer, Preloader } from './components/Layout';
import { useHome } from './hooks/useHome';
import { useEffect } from 'react';
import { ScrollTrigger } from './lib/gsap';

import {
  HeroSection,
  IconLinksSection,
  HorizontalCarousel,
  MediaComparator,
  StudioSection,
  QualityHomes,
  DreamHomeJourney,
  BlogSection,
} from './components/Home';
import NewHeroSection from './components/Home/NewHeroSection';

import { defaultHeroData } from './data/defaultData';

function App() {
  // Load Strapi page data (Hero mapped to your component props shape)
  const { loading, heroProps } = useHome();

  // Global ScrollTrigger coordination
  useEffect(() => {
    // Refresh ScrollTrigger when content loads
    if (!loading) {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
    }
  }, [loading]);

  // Handle window resize for all scroll components
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Vite base path for files in /public
  const publicUrl = import.meta.env.BASE_URL || '/';

  // Featured Residential Projects
  const residentialProjects = [
    {
      image: `${publicUrl}images/l3.jpg`,
      title: 'Modern Family Villa',
      subtitle: 'Contemporary 4-bedroom home with open-plan living and premium finishes',
    },
    {
      image: `${publicUrl}images/l1.jpg`,
      title: 'Luxury Estate Home',
      subtitle: 'Expansive 5-bedroom residence with elegant design and landscaped gardens',
    },
    {
      image: `${publicUrl}images/l4.jpg`,
      title: 'Sustainable Smart Home',
      subtitle: 'Eco-friendly 3-bedroom home with solar panels and smart technology',
    },
    {
      image: `${publicUrl}images/hero.jpg`,
      title: 'Heritage Style Manor',
      subtitle: 'Classic 6-bedroom heritage home with traditional charm and modern amenities',
    },
  ];

  // Commercial & Community Projects
  const commercialProjects = [
    {
      image: `${publicUrl}images/hero.jpg`,
      title: 'Corporate Office Complex',
      subtitle: 'Modern 3-story office building with sustainable design and state-of-the-art facilities',
    },
    {
      image: `${publicUrl}images/5.jpg`,
      title: 'Retail Shopping Center',
      subtitle: 'Contemporary shopping complex with mixed-use spaces and community-focused design',
    },
    {
      image: `${publicUrl}images/6.jpg`,
      title: 'Boutique Hotel Resort',
      subtitle: 'Luxury 4-star boutique hotel with spa facilities and stunning architectural elements',
    },
    {
      image: `${publicUrl}images/l4.jpg`,
      title: 'Educational Campus',
      subtitle: 'State-of-the-art educational facility with innovative learning spaces and green technology',
    },
  ];
 

  return (
    <div className="App">
      {/* Keep your preloader; optional: show it while Strapi loads */}
      {loading && <Preloader />}

      <Header />
      <main>

        
      
        {/* New hero section */}
        <NewHeroSection
        />
        <MediaComparator
          id="residential_projects_comparator"
          title="Featured Residential Projects - Scroll to Explore"
          slides={residentialProjects}
          direction="rtl"
          showComparatorLine={true}
          showOverlayAnimation={true}
        />

        <MediaComparator
          id="commercial_projects_comparator"
          title="Commercial & Community Projects"
          slides={commercialProjects}
          direction="ltr"
          showComparatorLine={true}
          showOverlayAnimation={true}
        />

        <IconLinksSection />
        <HorizontalCarousel title="Our Premium Services" />

        {/* Examples / layout blocks */}
        <StudioSection />

        <QualityHomes />
        <DreamHomeJourney />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
