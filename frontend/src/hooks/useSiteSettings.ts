import { useState, useEffect } from 'react';
import { fetchSiteSettings, SiteSettings } from '../services/api';

interface UseSiteSettingsReturn {
  loading: boolean;
  error: string | null;
  settings: SiteSettings | null;
}

export const useSiteSettings = (): UseSiteSettingsReturn => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSiteSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load site settings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load settings');
        
        // Provide fallback settings
        setSettings({
          header: {
            logo_text: 'SHAMBALA HOMES',
            menu_items: []
          },
          footer: {
            sections: [],
            copyright: '© 2025 Shambala Homes. All rights reserved.'
          },
          contact: {
            email: '',
            phone: '',
            address: ''
          },
          social: {}
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  return { loading, error, settings };
};
