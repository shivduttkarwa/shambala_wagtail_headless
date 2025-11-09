// Types for Wagtail CMS integration

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

export interface ServiceBox {
  id: number;
  title: string;
  description: string;
  image: string;
  imageSmall?: string;
  fullImage?: string;
  index: number;
}

export interface HeroContent {
  id: number;
  mainTitle: string[];
  typedTexts: string[];
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  serviceBoxes: ServiceBox[];
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

export interface IconLink {
  id: number;
  title: string;
  icon: string;
  link: string;
}

export interface MenuItem {
  id: number;
  label: string;
  link: string;
}
