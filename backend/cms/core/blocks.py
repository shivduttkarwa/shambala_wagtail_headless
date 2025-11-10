"""
Core Reusable Blocks Library for Wagtail Headless CMS

This module contains all the reusable StreamField blocks that can be used
across different page types and apps. Following DRY principles for scalability.

Based on St. Edwards architecture pattern.
"""

from wagtail import blocks
from wagtail.snippets.blocks import SnippetChooserBlock
from wagtail.blocks import PageChooserBlock
from wagtail.documents.blocks import DocumentChooserBlock
from wagtail.images.blocks import ImageChooserBlock
from wagtail.contrib.table_block.blocks import TableBlock
import re
import urllib.parse


# ============================================================================
# CONFIGURATION CHOICES
# ============================================================================

COLUMN_WIDTH_CHOICES = [
    ('col-lg-1', 'col-1'),
    ('col-lg-2', 'col-2'),
    ('col-lg-3', 'col-3'),
    ('col-lg-4', 'col-4'),
    ('col-lg-5', 'col-5'),
    ('col-lg-6', 'col-6'),
    ('col-lg-7', 'col-7'),
    ('col-lg-8', 'col-8'),
    ('col-lg-9', 'col-9'),
    ('col-lg-10', 'col-10'),
    ('col-lg-11', 'col-11'),
    ('col-lg-12', 'col-12'),
]

COLUMN_OFFSET_CHOICES = [
    ('offset-lg-1', 'offset-1'),
    ('offset-lg-2', 'offset-2'),
    ('offset-lg-3', 'offset-3'),
    ('offset-lg-4', 'offset-4'),
    ('offset-lg-5', 'offset-5'),
    ('offset-lg-6', 'offset-6'),
]

TOP_PADDING_CHOICES = [
    ('pt-0', 'No padding'),
    ('pt-1', '1x'),
    ('pt-2', '2x'),
    ('pt-3', '3x'),
    ('pt-4', '4x'),
    ('pt-5', '5x'),
    ('pt-6', '6x'),
    ('pt-7', '7x'),
]

BOTTOM_PADDING_CHOICES = [
    ('pb-0', 'No padding'),
    ('pb-1', '1x'),
    ('pb-2', '2x'),
    ('pb-3', '3x'),
    ('pb-4', '4x'),
    ('pb-5', '5x'),
    ('pb-6', '6x'),
    ('pb-7', '7x'),
]

BUTTON_THEME_CHOICES = [
    ('btn-primary', 'Primary Button'),
    ('btn-secondary', 'Secondary Button'),
    ('btn-outline-primary', 'Primary Outline'),
    ('btn-outline-secondary', 'Secondary Outline'),
    ('btn-link', 'Text Link'),
    ('btn-link-icon', 'Link With Icon'),
]

BACKGROUND_CHOICES = [
    ('bg-white', 'White'),
    ('bg-cream', 'Cream'),
    ('bg-light', 'Light Grey'),
    ('bg-dark', 'Dark'),
    ('bg-accent', 'Accent Color'),
]

ALIGNMENT_CHOICES = [
    ('left', 'Left'),
    ('center', 'Center'),
    ('right', 'Right'),
]

IMAGE_ALIGNMENT_CHOICES = [
    ('left', 'Image Left - Content Right'),
    ('right', 'Content Left - Image Right'),
]


# ============================================================================
# CUSTOM STRUCT VALUES (for advanced logic)
# ============================================================================

class HrefStructValue(blocks.StructValue):
    """Additional logic for URL handling."""

    def target(self):
        """Returns target attribute for links."""
        page_link = self.get('page_link')
        external_link = self.get('external_link')
        document_link = self.get('document_link')
        
        if external_link or document_link:
            return 'target="_blank" rel="noopener noreferrer"'
        return ''

    def url(self):
        """Returns the appropriate URL."""
        page_link = self.get('page_link')
        external_link = self.get('external_link')
        document_link = self.get('document_link')
        free_link = self.get('free_link')
        
        if page_link:
            return page_link.url
        elif external_link:
            return external_link
        elif document_link:
            return document_link.url
        elif free_link:
            return free_link
        return '#'

    def is_url(self):
        """Check if any URL is provided."""
        return bool(self.get('page_link') or self.get('external_link') or 
                   self.get('document_link') or self.get('free_link'))

    def detail(self):
        """Returns additional details (file size for documents)."""
        document_link = self.get('document_link')
        
        if document_link:
            document_size = document_link.file.size / 1024  # bytes to KB
            size_type = 'KB'
            
            if document_size > 1024:
                document_size = document_size / 1024  # KB to MB
                size_type = 'MB'
            
            if document_size > 1024:
                document_size = document_size / 1024  # MB to GB
                size_type = 'GB'
            
            return {
                'size': round(document_size, 2),
                'type': size_type
            }
        return None


class VideoInformation(blocks.StructValue):
    """Video URL analysis and type detection."""

    def is_youtube(self):
        video_url = self.get('video_url')
        if not video_url:
            return False
        
        parsed_url = urllib.parse.urlparse(video_url)
        domain = parsed_url.netloc.lower()
        
        youtube_patterns = [
            r'youtube\.com',
            r'youtu\.be',
            r'youtube-nocookie\.com'
        ]
        
        return any(re.search(pattern, domain) for pattern in youtube_patterns)

    def is_vimeo(self):
        video_url = self.get('video_url')
        if not video_url:
            return False
        
        parsed_url = urllib.parse.urlparse(video_url)
        domain = parsed_url.netloc.lower()
        return 'vimeo.com' in domain

    def is_html5(self):
        video_url = self.get('video_url')
        if not video_url:
            return False
        
        return any(ext in video_url.lower() for ext in ['.mp4', '.webm', '.ogg', '.mov'])

    def video_type(self):
        """Returns the video type."""
        if self.is_youtube():
            return 'youtube'
        if self.is_vimeo():
            return 'vimeo'
        if self.is_html5():
            return 'html5'
        return 'unknown'


# ============================================================================
# BASIC CONTENT BLOCKS
# ============================================================================

class HtmlSourceBlock(blocks.StructBlock):
    """Raw HTML content block."""
    block_label = blocks.CharBlock(
        required=False,
        help_text="Internal label (not displayed on frontend)"
    )
    source = blocks.TextBlock(label="HTML Source Code")

    class Meta:
        label = "HTML Source"
        icon = "code"
        template = "core/blocks/html_source.html"


class SpaceBlock(blocks.StructBlock):
    """Vertical spacing block."""
    height = blocks.IntegerBlock(
        default=50,
        help_text="Height in pixels"
    )

    class Meta:
        label = "Vertical Space"
        icon = "arrows-up-down"
        template = "core/blocks/space.html"


class DividerBlock(blocks.StructBlock):
    """Horizontal divider line."""
    style = blocks.ChoiceBlock(
        choices=[
            ('solid', 'Solid'),
            ('dashed', 'Dashed'),
            ('dotted', 'Dotted'),
        ],
        default='solid',
        required=False
    )

    class Meta:
        label = "Divider"
        icon = "horizontalrule"
        template = "core/blocks/divider.html"


class HeadingBlock(blocks.StructBlock):
    """Heading with customizable styling."""
    heading = blocks.RichTextBlock(
        features=['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'bold', 'italic']
    )
    alignment = blocks.ChoiceBlock(
        choices=ALIGNMENT_CHOICES,
        default='left',
        required=False
    )
    css_class = blocks.CharBlock(required=False, help_text="Custom CSS classes")

    class Meta:
        label = "Heading"
        icon = "title"
        template = "core/blocks/heading.html"


class ContentBlock(blocks.StructBlock):
    """Rich text content block."""
    content = blocks.RichTextBlock(
        features=[
            'h2', 'h3', 'h4', 'bold', 'italic', 'link', 
            'ol', 'ul', 'hr', 'blockquote', 'document', 'image'
        ]
    )
    list_style = blocks.ChoiceBlock(
        choices=[
            ('default', 'Default'),
            ('check-list', 'Checklist'),
            ('numbered', 'Numbered'),
        ],
        default='default',
        required=False
    )
    css_class = blocks.CharBlock(required=False)

    class Meta:
        label = "Rich Text Content"
        icon = "pilcrow"
        template = "core/blocks/content.html"


class LeadBlock(blocks.StructBlock):
    """Lead/intro text (larger text)."""
    content = blocks.TextBlock()
    alignment = blocks.ChoiceBlock(
        choices=ALIGNMENT_CHOICES,
        default='left',
        required=False
    )
    css_class = blocks.CharBlock(required=False)

    class Meta:
        label = "Lead Text"
        icon = "openquote"
        template = "core/blocks/lead_text.html"


class QuoteBlock(blocks.StructBlock):
    """Simple quote block."""
    quote = blocks.TextBlock()
    author = blocks.CharBlock(required=False)
    position = blocks.CharBlock(required=False, help_text="Author's position/title")

    class Meta:
        label = "Quote"
        icon = "openquote"
        template = "core/blocks/quote.html"


# ============================================================================
# LINK & BUTTON BLOCKS
# ============================================================================

class HrefBlock(blocks.StructBlock):
    """Flexible URL block supporting multiple link types."""
    page_link = PageChooserBlock(required=False, label="Internal Page")
    external_link = blocks.URLBlock(required=False, label="External URL")
    document_link = DocumentChooserBlock(required=False, label="Document")
    free_link = blocks.CharBlock(
        required=False,
        help_text='Email (mailto:), phone (tel:), or hash (#section-id)',
        label="Custom Link"
    )

    class Meta:
        icon = "link"
        label = "URL"
        value_class = HrefStructValue


class ButtonBlock(blocks.StructBlock):
    """Themed button block."""
    text = blocks.CharBlock(label="Button Text")
    href = HrefBlock()
    theme = blocks.ChoiceBlock(
        choices=BUTTON_THEME_CHOICES,
        default='btn-primary',
        required=False
    )
    size = blocks.ChoiceBlock(
        choices=[
            ('btn-sm', 'Small'),
            ('btn-md', 'Medium'),
            ('btn-lg', 'Large'),
        ],
        default='btn-md',
        required=False
    )

    class Meta:
        label = "Button"
        icon = "plus-inverse"
        template = "core/blocks/button.html"


class MultipleButtonsBlock(blocks.StructBlock):
    """Multiple buttons in a row."""
    buttons = blocks.ListBlock(ButtonBlock())
    alignment = blocks.ChoiceBlock(
        choices=ALIGNMENT_CHOICES,
        default='left',
        required=False
    )

    class Meta:
        label = "Multiple Buttons"
        icon = "plus-inverse"
        template = "core/blocks/multiple_buttons.html"


# ============================================================================
# MEDIA BLOCKS
# ============================================================================

class ResponsiveImageBlock(blocks.StructBlock):
    """Responsive image with caption."""
    image = ImageChooserBlock()
    alt_text = blocks.CharBlock(
        required=False,
        help_text="Alternative text for accessibility"
    )
    caption = blocks.CharBlock(required=False)
    attribution = blocks.CharBlock(required=False, help_text="Photo credit")

    class Meta:
        label = "Image"
        icon = "image"
        template = "core/blocks/image.html"


class FullwidthImageBlock(blocks.StructBlock):
    """Full-width image block."""
    image = ImageChooserBlock()
    caption = blocks.CharBlock(required=False)
    alt_text = blocks.CharBlock(required=False)

    class Meta:
        label = "Fullwidth Image"
        icon = "image"
        template = "core/blocks/fullwidth_image.html"


class VideoBlock(blocks.StructBlock):
    """Video block supporting YouTube, Vimeo, and HTML5."""
    video_url = blocks.TextBlock(
        help_text="YouTube, Vimeo, or direct video file URL (.mp4, .webm, .ogg)"
    )
    poster_image = ImageChooserBlock(
        required=False,
        help_text="Thumbnail image shown before video plays"
    )
    is_autoplay = blocks.BooleanBlock(
        required=False,
        default=False,
        help_text="Auto-play video (muted)"
    )
    caption = blocks.CharBlock(required=False)

    class Meta:
        label = "Video"
        icon = "media"
        template = "core/blocks/video.html"
        value_class = VideoInformation


class ImageGalleryBlock(blocks.StructBlock):
    """Image gallery/slider."""
    title = blocks.CharBlock(required=False)
    images = blocks.ListBlock(
        blocks.StructBlock([
            ('image', ImageChooserBlock()),
            ('caption', blocks.CharBlock(required=False)),
        ])
    )
    layout = blocks.ChoiceBlock(
        choices=[
            ('slider', 'Slider/Carousel'),
            ('grid-2', '2 Column Grid'),
            ('grid-3', '3 Column Grid'),
            ('grid-4', '4 Column Grid'),
        ],
        default='slider'
    )

    class Meta:
        label = "Image Gallery"
        icon = "image"
        template = "core/blocks/image_gallery.html"


# ============================================================================
# LAYOUT BLOCKS
# ============================================================================

class CTAButtonBlock(blocks.StructBlock):
    """Call-to-Action button block."""
    title = blocks.CharBlock(required=False)
    text = blocks.TextBlock(required=False)
    button = ButtonBlock()
    background = blocks.ChoiceBlock(
        choices=BACKGROUND_CHOICES,
        default='bg-accent',
        required=False
    )

    class Meta:
        label = "CTA Button"
        icon = "pick"
        template = "core/blocks/cta_button.html"


class ContentStreamBlock(blocks.StreamBlock):
    """Nested content stream for flexible layouts."""
    html = HtmlSourceBlock()
    heading = HeadingBlock()
    content = ContentBlock()
    lead = LeadBlock()
    quote = QuoteBlock()
    space = SpaceBlock()
    divider = DividerBlock()
    button = ButtonBlock()
    multiple_buttons = MultipleButtonsBlock()
    image = ResponsiveImageBlock()
    video = VideoBlock()


class ContentWithVariableWidthBlock(blocks.StructBlock):
    """Content block with customizable width and padding."""
    top_padding = blocks.ChoiceBlock(choices=TOP_PADDING_CHOICES, required=False)
    bottom_padding = blocks.ChoiceBlock(choices=BOTTOM_PADDING_CHOICES, required=False)
    column_width = blocks.ChoiceBlock(
        choices=COLUMN_WIDTH_CHOICES,
        default='col-lg-12'
    )
    column_offset = blocks.ChoiceBlock(choices=COLUMN_OFFSET_CHOICES, required=False)
    background = blocks.ChoiceBlock(choices=BACKGROUND_CHOICES, required=False)
    content_blocks = ContentStreamBlock()
    css_class = blocks.CharBlock(required=False)

    class Meta:
        label = "Content with Variable Width"
        icon = "doc-full"
        template = "core/blocks/content_with_variable_width.html"


class TwoColumnBlock(blocks.StructBlock):
    """Two column layout."""
    top_padding = blocks.ChoiceBlock(choices=TOP_PADDING_CHOICES, required=False)
    bottom_padding = blocks.ChoiceBlock(choices=BOTTOM_PADDING_CHOICES, required=False)
    background = blocks.ChoiceBlock(choices=BACKGROUND_CHOICES, required=False)
    
    left_column_width = blocks.ChoiceBlock(
        choices=COLUMN_WIDTH_CHOICES,
        default='col-lg-6'
    )
    left_column_offset = blocks.ChoiceBlock(choices=COLUMN_OFFSET_CHOICES, required=False)
    left_column = ContentStreamBlock()
    
    right_column_width = blocks.ChoiceBlock(
        choices=COLUMN_WIDTH_CHOICES,
        default='col-lg-6'
    )
    right_column_offset = blocks.ChoiceBlock(choices=COLUMN_OFFSET_CHOICES, required=False)
    right_column = ContentStreamBlock()
    
    css_class = blocks.CharBlock(required=False)

    class Meta:
        label = "Two Columns"
        icon = "grip"
        template = "core/blocks/two_column.html"


class ContentWithImageBlock(blocks.StructBlock):
    """Content with image alignment option."""
    top_padding = blocks.ChoiceBlock(choices=TOP_PADDING_CHOICES, required=False)
    bottom_padding = blocks.ChoiceBlock(choices=BOTTOM_PADDING_CHOICES, required=False)
    background = blocks.ChoiceBlock(choices=BACKGROUND_CHOICES, required=False)
    
    image = ImageChooserBlock()
    alignment = blocks.ChoiceBlock(
        choices=IMAGE_ALIGNMENT_CHOICES,
        default='left'
    )
    content = ContentStreamBlock()
    css_class = blocks.CharBlock(required=False)

    class Meta:
        label = "Content with Image"
        icon = "doc-full-inverse"
        template = "core/blocks/content_with_image.html"


class AccordionBlock(blocks.StructBlock):
    """Accordion/collapsible content."""
    items = blocks.ListBlock(
        blocks.StructBlock([
            ('title', blocks.CharBlock()),
            ('content', ContentStreamBlock()),
        ])
    )

    class Meta:
        label = "Accordion"
        icon = "list-ul"
        template = "core/blocks/accordion.html"


class TableBlock(blocks.StructBlock):
    """Table block."""
    table = TableBlock()
    caption = blocks.CharBlock(required=False)
    css_class = blocks.CharBlock(required=False)

    class Meta:
        label = "Table"
        icon = "table"
        template = "core/blocks/table.html"


# ============================================================================
# CARD & GRID BLOCKS
# ============================================================================

class CardBlock(blocks.StructBlock):
    """Individual card for card grids."""
    title = blocks.CharBlock()
    text = blocks.TextBlock(required=False)
    image = ImageChooserBlock(required=False)
    link = HrefBlock()

    class Meta:
        label = "Card"
        icon = "doc-empty"


class CardGridBlock(blocks.StructBlock):
    """Grid of cards."""
    top_padding = blocks.ChoiceBlock(choices=TOP_PADDING_CHOICES, required=False)
    bottom_padding = blocks.ChoiceBlock(choices=BOTTOM_PADDING_CHOICES, required=False)
    title = blocks.CharBlock(required=False)
    cards = blocks.ListBlock(CardBlock())
    columns = blocks.ChoiceBlock(
        choices=[
            ('2', '2 Columns'),
            ('3', '3 Columns'),
            ('4', '4 Columns'),
        ],
        default='3'
    )

    class Meta:
        label = "Card Grid"
        icon = "grip"
        template = "core/blocks/card_grid.html"


# ============================================================================
# SNIPPET CHOOSER BLOCKS
# ============================================================================

# Commented out - create DynamicContentSnippet model in core/models.py if needed
# class DynamicSnippetChooserBlock(blocks.StructBlock):
#     """Reusable dynamic content snippet."""
#     content = SnippetChooserBlock('core.DynamicContentSnippet')
#     css_class = blocks.CharBlock(required=False)
# 
#     class Meta:
#         label = "Dynamic Content Snippet"
#         icon = "snippet"
#         template = "core/blocks/dynamic_snippet_chooser.html"


# ============================================================================
# SITE SETTINGS BLOCKS (Header/Footer)
# ============================================================================

class SubMenuItemBlock(blocks.StructBlock):
    """Sub-menu item for navigation."""
    label = blocks.CharBlock(max_length=100)
    link = blocks.URLBlock(required=False, help_text="External URL or leave blank for internal page")
    page = PageChooserBlock(required=False, help_text="Or choose an internal page")
    
    class Meta:
        label = "Sub-menu Item"
        icon = "link"


class NavigationBlock(blocks.StructBlock):
    """Navigation menu item with optional sub-items."""
    label = blocks.CharBlock(max_length=100, help_text="Menu item text")
    aria_label = blocks.CharBlock(max_length=100, help_text="Accessibility label")
    link = blocks.URLBlock(required=False, help_text="External URL or leave blank for internal page")
    page = PageChooserBlock(required=False, help_text="Or choose an internal page")
    sub_items = blocks.ListBlock(SubMenuItemBlock(), required=False, help_text="Add sub-menu items")
    
    class Meta:
        label = "Menu Item"
        icon = "list-ul"


class FooterLinkBlock(blocks.StructBlock):
    """Individual footer link."""
    text = blocks.CharBlock(max_length=100)
    link = blocks.URLBlock(required=False, help_text="External URL")
    page = PageChooserBlock(required=False, help_text="Or choose an internal page")
    
    class Meta:
        label = "Footer Link"
        icon = "link"


class FooterColumnBlock(blocks.StructBlock):
    """Footer column with heading and links."""
    heading = blocks.CharBlock(max_length=100, help_text="Column heading (e.g., 'Quick Links')")
    links = blocks.ListBlock(FooterLinkBlock())
    
    class Meta:
        label = "Footer Column"
        icon = "list-ul"


class FooterBlock(blocks.StructBlock):
    """Footer section configuration."""
    section_type = blocks.ChoiceBlock(
        choices=[
            ('columns', 'Link Columns'),
            ('text', 'Text Content'),
            ('contact', 'Contact Info'),
        ],
        default='columns',
        help_text="Type of footer section"
    )
    
    # For columns type
    columns = blocks.ListBlock(
        FooterColumnBlock(),
        required=False,
        help_text="Add footer columns (for 'Link Columns' type)"
    )
    
    # For text type
    content = blocks.RichTextBlock(
        required=False,
        help_text="Rich text content (for 'Text Content' type)"
    )
    
    # For contact type
    show_email = blocks.BooleanBlock(required=False, default=True)
    show_phone = blocks.BooleanBlock(required=False, default=True)
    show_address = blocks.BooleanBlock(required=False, default=True)
    
    class Meta:
        label = "Footer Section"
        icon = "form"

