from wagtail.blocks import (
    CharBlock, TextBlock, RichTextBlock, URLBlock, BooleanBlock,
    StructBlock, ListBlock, PageChooserBlock, StreamBlock
)
from wagtail.images.blocks import ImageChooserBlock
from wagtail.embeds.blocks import EmbedBlock
from wagtail.admin.panels import FieldPanel
from wagtail.models import Page


# REUSABLE BLOCKS - For scaling and consistency

class CTABlock(StructBlock):
    """
    Reusable Call-to-Action block for buttons and links
    """
    button_text = CharBlock(
        max_length=50, 
        default="Get Started",
        help_text="Text for the button"
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
        icon = 'link'
        label = 'Call to Action'


class ImageBlock(StructBlock):
    """
    Reusable image block with alt text
    """
    image = ImageChooserBlock(help_text="Choose an image")
    alt_text = CharBlock(
        max_length=200,
        required=False,
        help_text="Alt text for accessibility (optional - will use image title if not provided)"
    )
    
    class Meta:
        icon = 'image'
        label = 'Image'


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




class ProjectSlideBlock(StructBlock):
    """
    Individual project slide for media comparator sections
    """
    title = CharBlock(max_length=200, help_text="Project title")
    description = TextBlock(required=False, help_text="Project description")
    image = ImageChooserBlock(help_text="Project image")
    
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
        label = 'Project Slide'


class ResidentialProjectsBlock(StructBlock):
    """
    Residential Projects section with horizontal scrolling
    """
    title = CharBlock(
        max_length=200, 
        default="Featured Residential Projects",
        help_text="Section title"
    )
    subtitle = TextBlock(
        required=False,
        help_text="Optional subtitle/description"
    )
    
    projects = ListBlock(
        ProjectSlideBlock(),
        min_num=1,
        max_num=10,
        label="Residential Projects"
    )
    
    class Meta:
        icon = 'home'
        label = 'Residential Projects Section'


class CommercialProjectsBlock(StructBlock):
    """
    Commercial & Community Projects section with horizontal scrolling
    """
    title = CharBlock(
        max_length=200, 
        default="Commercial & Community Projects",
        help_text="Section title"
    )
    subtitle = TextBlock(
        required=False,
        help_text="Optional subtitle/description"
    )
    
    projects = ListBlock(
        ProjectSlideBlock(),
        min_num=1,
        max_num=10,
        label="Commercial Projects"
    )
    
    class Meta:
        icon = 'group'
        label = 'Commercial Projects Section'


class MultiImageContentBlock(StructBlock):
    """
    Multiple image with content block that maps to StudioSection.tsx
    Includes section title, subtitle, rich text description, images, and CTA
    """
    # Section content
    section_title = CharBlock(
        max_length=200,
        default="Bring your dream home to life",
        help_text="Main section title"
    )
    section_subtitle = CharBlock(
        max_length=300,
        required=False,
        help_text="Optional section subtitle"
    )
    description = RichTextBlock(
        help_text="Rich text description for the section"
    )
    
    # Images using reusable ImageBlock
    images = ListBlock(
        ImageBlock(),
        min_num=2,
        max_num=2,
        help_text="Exactly 2 images: First image = Left side (tall format), Second image = Right side (wide format)"
    )
    
    # CTA using reusable CTABlock
    cta = CTABlock(help_text="Call to action button")
    
    class Meta:
        icon = 'image'
        label = 'Multi Image Content Section'


class QualityHomesFeatureBlock(StructBlock):
    """
    Individual feature for Quality Homes section
    """
    icon = CharBlock(
        max_length=10,
        default="✓",
        help_text="Feature icon (emoji or symbol)"
    )
    title = CharBlock(
        max_length=200,
        help_text="Feature title"
    )
    description = TextBlock(
        help_text="Feature description"
    )
    image = ImageChooserBlock(
        help_text="Feature image"
    )
    
    class Meta:
        icon = 'tick'
        label = 'Quality Feature'


class QualityHomesBlock(StructBlock):
    """
    Quality Homes section with features list and CTA
    """
    # Section content
    main_title = CharBlock(
        max_length=200,
        default="Building quality homes for over 40 years",
        help_text="Main section title"
    )
    
    # Features list
    features = ListBlock(
        QualityHomesFeatureBlock(),
        min_num=1,
        max_num=8,
        help_text="Quality features and benefits"
    )
    
    # CTA using reusable CTABlock
    cta = CTABlock(
        required=False,
        help_text="Optional call to action button"
    )
    
    class Meta:
        icon = 'home'
        label = 'Quality Homes Section'


class DreamHomeJourneyBlock(StructBlock):
    """
    Dream Home Journey section with title, description, dual CTAs, and background image
    """
    # Section content
    title = CharBlock(
        max_length=200,
        default="Begin your dream home journey with Shambala Homes",
        help_text="Main section title"
    )
    description = TextBlock(
        default="Discover modern house designs and packages to turn your vision into reality — from open living spaces to stunning alfresco homes.",
        help_text="Section description"
    )
    
    # Background image
    background_image = ImageChooserBlock(
        help_text="Background image for the section"
    )
    
    # Primary CTA using reusable CTABlock
    primary_cta = CTABlock(
        help_text="Primary call to action button"
    )
    
    # Secondary CTA using reusable CTABlock
    secondary_cta = CTABlock(
        help_text="Secondary call to action button"
    )
    
    class Meta:
        icon = 'home'
        label = 'Dream Home Journey Section'


class BlogPostBlock(StructBlock):
    """
    Individual blog post block
    """
    title = CharBlock(
        max_length=200,
        help_text="Blog post title"
    )
    date = CharBlock(
        max_length=50,
        default="14 Oct, 2025",
        help_text="Publication date (e.g., '14 Oct, 2025')"
    )
    category = CharBlock(
        max_length=100,
        default="Design Tips",
        help_text="Blog post category"
    )
    excerpt = TextBlock(
        help_text="Brief description/excerpt of the blog post"
    )
    image = ImageChooserBlock(
        help_text="Blog post image"
    )
    
    # Link configuration
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
        icon = 'doc-full'
        label = 'Blog Post'


class FeaturedBlogPostBlock(StructBlock):
    """
    Featured blog post block (larger, for left side)
    """
    title = CharBlock(
        max_length=200,
        help_text="Featured blog post title"
    )
    date = CharBlock(
        max_length=50,
        default="14 Oct, 2025",
        help_text="Publication date (e.g., '14 Oct, 2025')"
    )
    category = CharBlock(
        max_length=100,
        default="Design Tips",
        help_text="Blog post category"
    )
    excerpt = TextBlock(
        help_text="Brief description/excerpt of the blog post"
    )
    image = ImageChooserBlock(
        help_text="Main blog post image"
    )
    
    # Additional content for featured post
    additional_text = TextBlock(
        required=False,
        help_text="Additional text content (optional)"
    )
    additional_image = ImageChooserBlock(
        required=False,
        help_text="Additional small image (optional)"
    )
    
    # Link configuration
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
        icon = 'doc-full-inverse'
        label = 'Featured Blog Post'


class BlogSectionBlock(StructBlock):
    """
    Blog section with featured post on left and 2 posts on right
    """
    # Section content
    section_title = CharBlock(
        max_length=200,
        default="Design and building tips from our blog",
        help_text="Main section title"
    )
    
    # Featured post (left side - large)
    featured_post = FeaturedBlogPostBlock(
        help_text="Featured blog post (displayed large on the left)"
    )
    
    # Sidebar posts (right side - 2 smaller posts)
    sidebar_posts = ListBlock(
        BlogPostBlock(),
        min_num=2,
        max_num=2,
        help_text="Exactly 2 blog posts for the right side (smaller)"
    )
    
    # Section CTA using reusable CTABlock
    cta = CTABlock(
        required=False,
        help_text="Optional call to action button at the bottom"
    )
    
    class Meta:
        icon = 'list-ul'
        label = 'Blog Section'


# Main StreamField for page body content
class BodyStreamBlock(StreamBlock):
    """
    Main StreamField block containing available content blocks
    """
    residential_projects = ResidentialProjectsBlock()
    commercial_projects = CommercialProjectsBlock()
    horizontal_slider = HorizontalSliderBlock()
    multi_image_content = MultiImageContentBlock()
    quality_homes = QualityHomesBlock()
    dream_home_journey = DreamHomeJourneyBlock()
    blog_section = BlogSectionBlock()
    
    class Meta:
        block_counts = {
            'horizontal_slider': {'max_num': 3},  # Max 3 horizontal sliders per page
            'residential_projects': {'max_num': 1},  # Max 1 residential projects section
            'commercial_projects': {'max_num': 1},  # Max 1 commercial projects section
            'multi_image_content': {'max_num': 5},  # Max 5 multi-image content sections
            'quality_homes': {'max_num': 1},  # Max 1 quality homes section
            'dream_home_journey': {'max_num': 1},  # Max 1 dream home journey section
            'blog_section': {'max_num': 1},  # Max 1 blog section
        }