import { useState, useEffect } from 'react';
import { HouseDesignsPageData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v2';

export const useHouseDesigns = (slug: string = 'home-design') => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<HouseDesignsPageData | null>(null);

  useEffect(() => {
    const fetchHouseDesigns = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch page data from Wagtail API
        const url = `${API_BASE_URL}/pages/?type=house_designs.HouseDesignsIndexPage&fields=*&slug=${slug}`;
        console.log('Fetching from:', url);
        
        const response = await fetch(url);

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data.items && data.items.length > 0) {
          const pageItem = data.items[0];
          console.log('Page data:', pageItem);
          setPageData(pageItem);
        } else {
          throw new Error('House Designs page not found');
        }
      } catch (err) {
        console.error('Error fetching house designs:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHouseDesigns();
  }, [slug]);

  return { loading, error, pageData };
};
