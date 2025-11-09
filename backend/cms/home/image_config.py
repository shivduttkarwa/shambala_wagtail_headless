"""
Global Image Configuration for Frontend Components
This file defines the exact image sizes required by each frontend component
to ensure crisp, properly sized images without blur or stretching.
"""

# Desktop breakpoint: 1400px max container
# Tablet breakpoint: 768px - 1024px  
# Mobile breakpoint: < 768px

IMAGE_CONFIGS = {
    # Hero Section - Full viewport background images and slider thumbnails
    'hero_background': {
        'desktop': 'fill-1920x1080|format-webp',  # Full HD background for video poster
        'tablet': 'fill-1440x900|format-webp',    # Reasonable tablet size
        'mobile': 'fill-1080x1920|format-webp',   # Mobile portrait
    },
    'hero_slide': {
        # Hero slider images need to be much larger for retina displays
        'desktop': 'fill-1200x480|format-webp',   # 2x retina for 600x240 display (240px height)
        'tablet': 'fill-1000x400|format-webp',    # 2x retina for tablet
        'mobile': 'fill-700x280|format-webp',     # 2x retina for mobile
    },
    'hero_slide_full': {
        'desktop': 'width-3840|format-webp',      # 4K width for lightbox
        'tablet': 'width-2048|format-webp',       # 2K for tablet lightbox
        'mobile': 'width-1080|format-webp',       # 1080p for mobile lightbox
    },
    
    # Studio Section - Massive resolution to eliminate blur
    'studio_section': {
        'desktop': 'fill-3000x2000|format-webp',  # Massive size, no blur possible
        'tablet': 'fill-2000x1500|format-webp',   # Massive tablet size
        'mobile': 'fill-1500x1000|format-webp',   # Massive mobile size
    },
    
    # Media Comparator - Much larger for galleries (75rem = 1200px container)
    'media_comparator': {
        # Media comparator can show large images in 1200px containers
        'desktop': 'fill-1600x1200|format-webp',  # High res for large displays
        'tablet': 'fill-1200x900|format-webp',    # Good res for tablets
        'mobile': 'fill-800x600|format-webp',     # Adequate for mobile
    },
    
    # General content images - Increased for better quality
    'content_image': {
        'desktop': 'fill-1200x800|format-webp',   # Much higher than before
        'tablet': 'fill-1000x700|format-webp',    # Better tablet quality
        'mobile': 'fill-700x500|format-webp',     # Better mobile quality
    },
    
    # Video configurations - Optimized poster sizes
    'video_poster': {
        'desktop': 'fill-1920x1080|format-webp',  # Full HD video poster
        'tablet': 'fill-1440x900|format-webp',    # Reasonable tablet poster
        'mobile': 'fill-1080x720|format-webp',    # Mobile optimized poster
    }
}

# Component type mapping - Maps block types to image configs
COMPONENT_IMAGE_MAPPING = {
    # Hero section blocks
    'hero': {
        'background_image': 'hero_background',
        'slides.image': 'hero_slide',
        'slides.full_image': 'hero_slide_full',
    },
    
    # Studio/Multi-image content blocks  
    'multi_image_content': {
        'images.image': 'studio_section',
    },
    
    # Project blocks
    'residential_projects': {
        'projects.image': 'media_comparator',
    },
    'commercial_projects': {
        'projects.image': 'media_comparator', 
    },
    'horizontal_slider': {
        'slides.image': 'media_comparator',
    },
    
    # Quality Homes section
    'quality_homes': {
        'features.image': 'content_image',
    },
    
    # Dream Home Journey section
    'dream_home_journey': {
        'background_image': 'hero_background',
    },
    
    # Blog section
    'blog_section': {
        'blog_featured.image': 'media_comparator',  # Large featured post image
        'blog_post.image': 'content_image',         # Smaller sidebar post images
        'blog_additional.image': 'content_image',   # Additional small image in featured post
    },
    
    # Default fallback
    'default': {
        'image': 'content_image',
    }
}

def get_image_renditions(component_type, field_path='image'):
    """
    Get the appropriate image renditions for a component type and field.
    
    Args:
        component_type (str): The type of component (e.g., 'hero', 'multi_image_content')
        field_path (str): The path to the image field (e.g., 'images.image', 'slides.image')
        
    Returns:
        dict: Dictionary with desktop, tablet, mobile rendition strings
    """
    # Get component mapping or use default
    component_mapping = COMPONENT_IMAGE_MAPPING.get(component_type, COMPONENT_IMAGE_MAPPING['default'])
    
    # Get config key for this field path
    config_key = component_mapping.get(field_path, component_mapping.get('image', 'content_image'))
    
    # Get the actual image config
    return IMAGE_CONFIGS.get(config_key, IMAGE_CONFIGS['content_image'])

def generate_responsive_image_data(image_obj, component_type, field_path='image', base_url='http://127.0.0.1:8000'):
    """
    Generate responsive image data for a Wagtail image object.
    
    Args:
        image_obj: Wagtail Image object
        component_type (str): Type of component using the image
        field_path (str): Path to the image field
        base_url (str): Base URL for the site
        
    Returns:
        dict: Image data with src, desktop, tablet, mobile URLs and alt text
    """
    if not image_obj:
        return None
        
    renditions = get_image_renditions(component_type, field_path)
    
    return {
        'src': f"{base_url}{image_obj.get_rendition(renditions['desktop']).url}",
        'desktop': f"{base_url}{image_obj.get_rendition(renditions['desktop']).url}",
        'tablet': f"{base_url}{image_obj.get_rendition(renditions['tablet']).url}",
        'mobile': f"{base_url}{image_obj.get_rendition(renditions['mobile']).url}",
        'alt': image_obj.title or 'Image',
    }