import { useState, useEffect } from 'react';
import { fetchHomePage, WagtailHomePage, HeroSectionData } from '../services/api';

// Transform Wagtail data to component props format
interface HeroProps {
  mainTitle: string[];
  typedTexts: string[];
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  serviceBoxes: Array<{
    id: number;
    index: number;
    title: string;
    description: string;
    image: string;
    imageSmall?: string;
    fullImage?: string;
  }>;
}

interface UseHomeReturn {
  loading: boolean;
  error: string | null;
  heroProps: HeroProps | null;
  wagtailData: WagtailHomePage | null;
}

interface UseNewHeroReturn {
  loading: boolean;
  error: string | null;
  heroData: HeroSectionData | null;
}

export const useNewHero = (): UseNewHeroReturn => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroData, setHeroData] = useState<HeroSectionData | null>(null);

  useEffect(() => {
    const loadHeroData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchHomePage();
        
        if (data && data.hero_section_data) {
          setHeroData(data.hero_section_data);
        } else {
          console.warn('No hero section data found, using fallback');
          throw new Error('No hero section data found');
        }
      } catch (err) {
        console.error('Failed to load hero section data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load hero section data');
        
        // Provide fallback data when API is not available
        const fallbackHeroData: HeroSectionData = {
          title: 'Transform your<br/>outdoor dreams',
          cta: {
            text: 'Get a Free Site Visit',
            link: '#contact'
          },
          background: {
            video_url: `${import.meta.env.BASE_URL}images/hero2.mp4`
          },
          slides: [
            {
              id: 1,
              title: 'Garden Design & Installation',
              description: 'Custom garden designs that transform your outdoor space.',
              button: {
                text: 'Read more',
                url: '#',
                is_external: false
              },
              image: {
                url: `${import.meta.env.BASE_URL}images/1.jpg`,
                small: `${import.meta.env.BASE_URL}images/1.jpg`,
                tablet: `${import.meta.env.BASE_URL}images/1.jpg`,
                alt: 'Garden Design'
              }
            },
            {
              id: 2,
              title: 'Outdoor Living Spaces',
              description: 'Create the perfect outdoor entertainment area.',
              button: {
                text: 'Read more',
                url: '#',
                is_external: false
              },
              image: {
                url: `${import.meta.env.BASE_URL}images/2.jpg`,
                small: `${import.meta.env.BASE_URL}images/2.jpg`,
                tablet: `${import.meta.env.BASE_URL}images/2.jpg`,
                alt: 'Landscaping Project'
              }
            },
            {
              id: 3,
              title: 'Sustainable Eco-Friendly Gardens',
              description: 'Environmentally conscious landscaping solutions.',
              button: {
                text: 'Read more',
                url: '#',
                is_external: false
              },
              image: {
                url: `${import.meta.env.BASE_URL}images/3.jpg`,
                small: `${import.meta.env.BASE_URL}images/3.jpg`,
                tablet: `${import.meta.env.BASE_URL}images/3.jpg`,
                alt: 'Sustainable Landscaping'
              }
            }
          ],
          settings: {
            autoplay_enabled: true,
            autoplay_delay: 5000
          }
        };
        
        setHeroData(fallbackHeroData);
      } finally {
        setLoading(false);
      }
    };

    loadHeroData();
  }, []);

  return {
    loading,
    error,
    heroData,
  };
};

export const useHome = (): UseHomeReturn => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wagtailData, setWagtailData] = useState<WagtailHomePage | null>(null);
  const [heroProps, setHeroProps] = useState<HeroProps | null>(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchHomePage();
        
        if (data) {
          setWagtailData(data);
          
          // Transform Wagtail data to HeroSection component format
          const API_BASE = import.meta.env.VITE_API_URL?.replace('/api/v2', '') || 'http://127.0.0.1:8000';
          
          const transformedProps: HeroProps = {
            mainTitle: data.main_title || ['we', 'make'],
            typedTexts: data.typed_texts_list || ['eco-friendly outdoors'],
            description: data.description || '',
            ctaText: data.cta_text || 'Get a Free Site Visit',
            ctaLink: data.cta_link || '#contact',
            backgroundImage: data.background_image?.url ? `${API_BASE}${data.background_image.url}` : '',
            serviceBoxes: data.service_boxes_list?.map(box => ({
              id: box.id,
              index: box.index,
              title: box.title,
              description: box.description,
              image: box.image?.url ? `${API_BASE}${box.image.url}` : '',
              imageSmall: box.image?.small ? `${API_BASE}${box.image.small}` : '',
              fullImage: box.image?.full ? `${API_BASE}${box.image.full}` : '',
            })) || [],
          };
          
          setHeroProps(transformedProps);
        }
      } catch (err) {
        console.error('Failed to load home page data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load home page data');
        
        // Provide fallback data when API is not available
        const fallbackProps: HeroProps = {
          mainTitle: ['Transform your', 'outdoor dreams'],
          typedTexts: ['eco-friendly gardens', 'beautiful landscapes', 'relaxing spaces', 'sustainable outdoors'],
          description: 'Create stunning outdoor spaces that reflect your unique style and enhance your property\'s value.',
          ctaText: 'Get a Free Site Visit',
          ctaLink: '#contact',
          backgroundImage: `${import.meta.env.BASE_URL}images/hero.jpg`,
          serviceBoxes: [
            {
              id: 1,
              index: 0,
              title: 'Garden Design & Installation',
              description: 'Custom garden designs that transform your outdoor space into a beautiful sanctuary.',
              image: `${import.meta.env.BASE_URL}images/1.jpg`,
              imageSmall: `${import.meta.env.BASE_URL}images/1.jpg`,
              fullImage: `${import.meta.env.BASE_URL}images/l1.jpg`,
            },
            {
              id: 2,
              index: 1,
              title: 'Outdoor Living Spaces',
              description: 'Create the perfect outdoor entertainment area for your family and friends.',
              image: `${import.meta.env.BASE_URL}images/2.jpg`,
              imageSmall: `${import.meta.env.BASE_URL}images/2.jpg`,
              fullImage: `${import.meta.env.BASE_URL}images/l2.jpg`,
            },
            {
              id: 3,
              index: 2,
              title: 'Sustainable Eco-Friendly Gardens',
              description: 'Environmentally conscious landscaping solutions for a greener future.',
              image: `${import.meta.env.BASE_URL}images/3.jpg`,
              imageSmall: `${import.meta.env.BASE_URL}images/3.jpg`,
              fullImage: `${import.meta.env.BASE_URL}images/l3.jpg`,
            },
          ],
        };
        
        setHeroProps(fallbackProps);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return {
    loading,
    error,
    heroProps,
    wagtailData,
  };
};