// Wagtail API service
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v2';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface WagtailImage {
  url: string;
  width: number;
  height: number;
}

export interface WagtailServiceBox {
  id: number;
  index: number;
  title: string;
  description: string;
  image: {
    url: string;
    small: string;
    full: string;
  } | null;
}

export interface WagtailHomePage {
  id: number;
  title: string;
  main_title: string[];
  typed_texts_list: string[];
  description: string;
  cta_text: string;
  cta_link: string;
  background_image: WagtailImage;
  service_boxes_list: WagtailServiceBox[];
  intro?: string;
  hero?: WagtailImage;
}

export interface WagtailApiResponse<T> {
  meta: {
    total_count: number;
  };
  items: T[];
}

// Fetch home page data from Wagtail API
export const fetchHomePage = async (): Promise<WagtailHomePage | null> => {
  try {
    const response = await api.get<WagtailApiResponse<WagtailHomePage>>('/pages/', {
      params: {
        type: 'home.HomePage',
        fields: 'title,main_title,typed_texts_list,description,cta_text,cta_link,background_image,service_boxes_list,intro,hero',
        limit: 1,
      },
    });

    if (response.data.items.length > 0) {
      return response.data.items[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching home page:', error);
    throw error;
  }
};

export default api;