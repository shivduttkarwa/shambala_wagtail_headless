import './styles/App.css';
import { Header, Footer, Preloader } from './components/Layout';
import { useHome } from './hooks/useHome';
import { useEffect } from 'react';
import { ScrollTrigger } from './lib/gsap';

import NewHeroSection from './components/Home/NewHeroSection';
import BodyRenderer from './components/BodyRenderer';

function App() {
  // Load Wagtail page data
  const { loading, bodyBlocks } = useHome();
  
  // Global ScrollTrigger coordination
  useEffect(() => {
    if (!loading && bodyBlocks.length > 0) {
      // Add delay to ensure all components are mounted
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [loading, bodyBlocks]);


  return (
    <div className="App">
      {/* Keep your preloader; optional: show it while Wagtail loads */}
      {loading && <Preloader />}

      <Header />
      <main>
        {/* New hero section */}
        <NewHeroSection />
        
        {/* Render body blocks from Wagtail CMS */}
        <BodyRenderer blocks={bodyBlocks} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
