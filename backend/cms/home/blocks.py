from wagtail.blocks import (
    CharBlock, TextBlock, RichTextBlock, URLBlock, BooleanBlock,
    StructBlock, ListBlock, PageChooserBlock, StreamBlock
)
from wagtail.images.blocks import ImageChooserBlock
from wagtail.embeds.blocks import EmbedBlock
from wagtail.admin.panels import FieldPanel
from wagtail.models import Page


class SlideBlock(StructBlock):
    """
    Individual slide for the hero slider
    """
    title = CharBlock(max_length=100, help_text="Slide title")
    description = TextBlock(required=False, help_text="Optional slide description")
    image = ImageChooserBlock(help_text="Slide image (optimized for slider)")
    full_image = ImageChooserBlock(
        required=False,
        help_text="High-resolution image for fullscreen view (optional)"
    )
    
    # Button configuration
    button_text = CharBlock(
        max_length=50, 
        default="Read more",
        help_text="Text for the slide button"
    )
    is_external_link = BooleanBlock(
        default=False,
        required=False,
        help_text="Check if this links to an external website"
    )
    external_url = URLBlock(
        required=False,
        help_text="External URL (only used if 'External Link' is checked)"
    )
    page_link = PageChooserBlock(
        required=False,
        help_text="Internal page to link to (only used if 'External Link' is NOT checked)"
    )
    
    class Meta:
        icon = 'image'
        label = 'Slide'


class HeroSectionBlock(StructBlock):
    """
    Complete hero section block with video background and slider
    """
    # Hero content
    hero_title = CharBlock(
        max_length=200,
        help_text="Main hero title (supports HTML line breaks)",
        default="Transform your<br/>outdoor dreams"
    )
    cta_text = CharBlock(max_length=100, default="Get a Free Site Visit")
    cta_link = URLBlock(default="#contact", help_text="CTA button link")
    
    # Background media
    background_video = URLBlock(
        required=False,
        help_text="Background video URL (mp4 format recommended)"
    )
    background_image = ImageChooserBlock(
        required=False,
        label="Poster Image",
        help_text="Poster image that shows while video loads (also used as fallback if no video)"
    )
    
    # Slider content
    slides = ListBlock(SlideBlock(), min_num=1, max_num=6, label="Slider Images")
    
    # Autoplay settings
    autoplay_enabled = BooleanBlock(default=True, help_text="Enable slider autoplay")
    autoplay_delay = CharBlock(
        max_length=10,
        default="5000",
        help_text="Autoplay delay in milliseconds"
    )
    
    class Meta:
        icon = 'hero'
        label = 'Hero Section'
        template = 'blocks/hero_section.html'


# Note: Other block definitions removed as requested.
# Only keeping HorizontalSliderBlock and HeroSectionBlock.
# Will add new blocks one by one as per requirements.


class HorizontalSlideBlock(StructBlock):
    """
    Individual slide for horizontal slider
    """
    order = CharBlock(
        max_length=3,
        default="1",
        help_text="Display order (1, 2, 3, etc.)"
    )
    title = CharBlock(max_length=200, help_text="Slide title")
    description = TextBlock(required=False, help_text="Slide description")
    image = ImageChooserBlock(help_text="Slide image")
    
    # Button configuration
    button_text = CharBlock(
        max_length=50, 
        default="Learn More",
        help_text="Text for the slide button"
    )
    is_external_link = BooleanBlock(
        default=False,
        required=False,
        help_text="Check if this links to an external website"
    )
    external_url = URLBlock(
        required=False,
        help_text="External URL (only used if 'External Link' is checked)"
    )
    page_link = PageChooserBlock(
        required=False,
        help_text="Internal page to link to (only used if 'External Link' is NOT checked)"
    )
    
    class Meta:
        icon = 'image'
        label = 'Slide'


class HorizontalSliderBlock(StructBlock):
    """
    Horizontal slider section with multiple slides
    """
    title = CharBlock(max_length=200, default="Our Services", help_text="Section title")
    description = TextBlock(required=False, help_text="Section description")
    
    slides = ListBlock(
        HorizontalSlideBlock(),
        min_num=1,
        max_num=10,
        label="Slides"
    )
    
    # Slider settings
    autoplay_enabled = BooleanBlock(default=True, help_text="Enable slider autoplay")
    autoplay_delay = CharBlock(
        max_length=10,
        default="3000",
        help_text="Autoplay delay in milliseconds"
    )
    
    class Meta:
        icon = 'horizontalrule'
        label = 'Horizontal Slider'
        template = 'blocks/horizontal_slider.html'


# Main StreamField for page body content
class BodyStreamBlock(StreamBlock):
    """
    Main StreamField block containing available content blocks
    """
    horizontal_slider = HorizontalSliderBlock()
    
    class Meta:
        block_counts = {
            'horizontal_slider': {'max_num': 3},  # Max 3 horizontal sliders per page
        }