import './styles/App.css';
import { Header, Footer, Preloader } from './components/Layout';
import { useHome } from './hooks/useHome';

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

import { defaultHeroData } from './data/defaultData';

function App() {
  // Load Strapi page data (Hero mapped to your component props shape)
  const { loading, heroProps } = useHome();

  // Vite base path for files in /public
  const publicUrl = import.meta.env.BASE_URL || '/';

  // Demo slides (these use /public/images/*)
  const landscapingSlides = [
    {
      image: `${publicUrl}images/l3.jpg`,
      title: 'Garden Design & Planning',
      subtitle: 'Transform your outdoor space with expert design',
    },
    {
      image: `${publicUrl}images/l1.jpg`,
      title: 'Professional Lawn Care',
      subtitle: 'Maintain a lush, healthy lawn year-round',
    },
    {
      image: `${publicUrl}images/l4.jpg`,
      title: 'Hardscaping Solutions',
      subtitle: 'Patios, walkways, and retaining walls',
    },
  ];

  const maintenanceSlides = [
    {
      image: `${publicUrl}images/hero.jpg`,
      title: 'Tree & Plant Care',
      subtitle: 'Expert pruning and plant health services',
    },
    {
      image: `${publicUrl}images/5.jpg`,
      title: 'Irrigation Systems',
      subtitle: 'Efficient watering solutions for your landscape',
    },
    {
      image: `${publicUrl}images/6.jpg`,
      title: 'Seasonal Maintenance',
      subtitle: 'Year-round care for your outdoor spaces',
    },
  ];
 

  return (
    <div className="App">
      {/* Keep your preloader; optional: show it while Strapi loads */}
      {loading && <Preloader />}

      <Header />
      <main>

        
      
        {/* Hero wired to Strapi, with safe fallbacks to your defaults */}
        <HeroSection
  mainTitle={heroProps?.mainTitle ?? defaultHeroData.mainTitle}
  typedTexts={heroProps?.typedTexts ?? defaultHeroData.typedTexts}
  description={heroProps?.description ?? defaultHeroData.description}
  ctaText={heroProps?.ctaText ?? defaultHeroData.ctaText}
  ctaLink={heroProps?.ctaLink ?? defaultHeroData.ctaLink}
  backgroundImage={heroProps?.backgroundImage ?? defaultHeroData.backgroundImage}
  serviceBoxes={heroProps?.serviceBoxes ?? defaultHeroData.serviceBoxes}
/>
        <MediaComparator
          id="landscaping_services_comparator"
          title="Our Landscaping Services - Scroll to Explore"
          slides={landscapingSlides}
          direction="rtl"
          showComparatorLine={true}
          showOverlayAnimation={true}
        />

        <MediaComparator
          id="maintenance_services_comparator"
          title="Maintenance & Care Services"
          slides={maintenanceSlides}
          direction="ltr"
          showComparatorLine={true}
          showOverlayAnimation={true}
        />

        <IconLinksSection />
        <HorizontalCarousel title="Our Premium Services" />

        {/* Examples / layout blocks */}
        <StudioSection />
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
