from django.db import models
from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel
from wagtail.api import APIField
from wagtail.images.api.fields import ImageRenditionField

# Import blocks
from .blocks import BodyStreamBlock, HeroSectionBlock


class HomePage(Page):
    """
    Modern HomePage with flexible content blocks and hero section
    """
    
    # Hero section (single block)
    hero_section = StreamField(
        [('hero', HeroSectionBlock())],
        max_num=1,
        blank=True,
        default=list,
        help_text="Hero section with video background and slider"
    )
    
    # Page body content (flexible blocks)
    body = StreamField(
        BodyStreamBlock(),
        blank=True,
        default=list,
        help_text="Main page content using flexible blocks"
    )
    
    # Admin panel configuration
    content_panels = Page.content_panels + [
        FieldPanel("hero_section", heading="Hero Section"),
        FieldPanel("body", heading="Page Content"),
    ]
    
    # API fields for headless frontend
    api_fields = [
        APIField("title"),
        APIField("slug"),
        APIField("hero_section_data"),  # Custom property
        APIField("body"),
    ]
    
    @property
    def hero_section_data(self):
        """
        Transform hero section StreamField to frontend-compatible format
        """
        if not self.hero_section:
            return None
            
        # Get the first (and only) hero block
        hero_block = None
        for block in self.hero_section:
            if block.block_type == 'hero':
                hero_block = block.value
                break
                
        if not hero_block:
            return None
        
        # Transform slides data
        slides_data = []
        for slide in hero_block.get('slides', []):
            slide_data = {
                'id': len(slides_data) + 1,  # Simple incremental ID
                'title': slide.get('title', ''),
                'description': slide.get('description', ''),
            }
            
            # Handle button configuration
            button_text = slide.get('button_text', 'Read more')
            is_external = slide.get('is_external_link', False)
            
            # Check if this is an old slide with just a 'link' field
            legacy_link = slide.get('link', '')
            
            if is_external and slide.get('external_url'):
                slide_data['button'] = {
                    'text': button_text,
                    'url': slide.get('external_url'),
                    'is_external': True
                }
            elif not is_external and slide.get('page_link'):
                # Get the page URL
                page_url = '/'
                try:
                    if hasattr(slide['page_link'], 'url'):
                        page_url = slide['page_link'].url
                    elif hasattr(slide['page_link'], 'get_url'):
                        page_url = slide['page_link'].get_url()
                except:
                    page_url = '/'
                    
                slide_data['button'] = {
                    'text': button_text,
                    'url': page_url,
                    'is_external': False
                }
            elif legacy_link:
                # Handle legacy slides that only have the 'link' field
                slide_data['button'] = {
                    'text': button_text,
                    'url': legacy_link,
                    'is_external': True  # Assume external for legacy links
                }
            else:
                # Default button for slides without any link configuration
                slide_data['button'] = {
                    'text': button_text,
                    'url': '#',
                    'is_external': False
                }
            
            # Main slider image - optimized for actual slide dimensions
            if slide.get('image'):
                slide_data['image'] = {
                    'url': f"http://127.0.0.1:8000{slide['image'].get_rendition('fill-600x240|format-webp').url}",  # Desktop: ~240px height, wide aspect
                    'small': f"http://127.0.0.1:8000{slide['image'].get_rendition('fill-300x120|format-webp').url}",  # Mobile: ~120px height 
                    'tablet': f"http://127.0.0.1:8000{slide['image'].get_rendition('fill-700x280|format-webp').url}",  # Tablet: ~280px height
                    'alt': slide['image'].title or slide.get('title', ''),
                }
            
            # Full image for lightbox/fullscreen
            if slide.get('full_image'):
                slide_data['full_image'] = {
                    'url': f"http://127.0.0.1:8000{slide['full_image'].get_rendition('width-1920|format-webp').url}",
                    'large': f"http://127.0.0.1:8000{slide['full_image'].get_rendition('fill-1920x1080|format-webp').url}",
                    'alt': slide['full_image'].title or slide.get('title', ''),
                }
            elif slide.get('image'):
                # Use main image as fallback
                slide_data['full_image'] = {
                    'url': f"http://127.0.0.1:8000{slide['image'].get_rendition('width-1920|format-webp').url}",
                    'large': f"http://127.0.0.1:8000{slide['image'].get_rendition('fill-1920x1080|format-webp').url}",
                    'alt': slide['image'].title or slide.get('title', ''),
                }
            
            slides_data.append(slide_data)
        
        # Background media
        background_data = {}
        if hero_block.get('background_video'):
            background_data['video_url'] = hero_block['background_video']
            
        if hero_block.get('background_image'):
            background_data['image'] = {
                'url': f"http://127.0.0.1:8000{hero_block['background_image'].get_rendition('fill-1920x1080|format-webp').url}",
                'large': f"http://127.0.0.1:8000{hero_block['background_image'].get_rendition('width-1920|format-webp').url}",
                'alt': hero_block['background_image'].title or 'Hero background',
            }
        
        # Parse autoplay delay (convert string to int)
        autoplay_delay = 5000
        try:
            if hero_block.get('autoplay_delay'):
                autoplay_delay = int(hero_block['autoplay_delay'])
        except (ValueError, TypeError):
            autoplay_delay = 5000
        
        return {
            'title': hero_block.get('hero_title', 'Transform your<br/>outdoor dreams'),
            'cta': {
                'text': hero_block.get('cta_text', 'Get a Free Site Visit'),
                'link': hero_block.get('cta_link', '#contact'),
            },
            'background': background_data,
            'slides': slides_data,
            'settings': {
                'autoplay_enabled': hero_block.get('autoplay_enabled', True),
                'autoplay_delay': autoplay_delay,
            }
        }
    
    class Meta:
        verbose_name = "Home Page"