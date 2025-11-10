// Types for Wagtail CMS integration

export interface WagtailImage {
  url: string;
  width: number;
  height: number;
  alt?: string;
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

// House Designs Types
export interface HouseSpecs {
  storeys: string;
  storeys_label: string;
  bedrooms: number;
  bathrooms: string;
  garage_spaces: number;
  block_width: string;
}

export interface HousePricing {
  base_price: string | null;
  display: string;
  note: string;
}

export interface HouseCategory {
  name: string;
  slug: string;
}

export interface HouseLocation {
  name: string;
  slug: string;
}

export interface HouseBadges {
  on_display: boolean;
  virtual_tour: boolean;
}

export interface HouseDesign {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: WagtailImage | null;
  specs: HouseSpecs;
  pricing: HousePricing;
  category: HouseCategory | null;
  location: HouseLocation | null;
  badges: HouseBadges;
  virtual_tour_url: string | null;
  tags: string[];
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface HouseDesignFilters {
  storeys: FilterOption[];
  bedrooms: FilterOption[];
  bathrooms: FilterOption[];
  categories: FilterOption[];
  price_ranges: FilterOption[];
}

export interface HouseDesignsPageData {
  id: number;
  title: string;
  intro_title: string;
  intro_text: string;
  designs_per_page: number;
  hero_data: {
    title: string;
    subtitle: string;
    background_image: WagtailImage | null;
    overlay_opacity: number;
  };
  house_designs_data: HouseDesign[];
  filter_options: HouseDesignFilters;
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
