"""
Centralized StreamField Configuration

This module defines reusable block collections that can be composed
into different page types. Following DRY principles for scalability.

Usage:
    from core.fields import common_blocks, homepage_stream_fields
    
    body = StreamField(homepage_stream_fields, blank=True)
"""

from core.blocks import (
    HtmlSourceBlock,
    SpaceBlock,
    DividerBlock,
    HeadingBlock,
    ContentBlock,
    LeadBlock,
    QuoteBlock,
    ButtonBlock,
    MultipleButtonsBlock,
    ResponsiveImageBlock,
    FullwidthImageBlock,
    VideoBlock,
    ImageGalleryBlock,
    CTAButtonBlock,
    ContentWithVariableWidthBlock,
    TwoColumnBlock,
    ContentWithImageBlock,
    AccordionBlock,
    TableBlock,
    CardGridBlock,
    # DynamicSnippetChooserBlock,  # Commented out - create snippet model if needed
)


# ============================================================================
# COMMON BLOCKS - Used across all page types
# ============================================================================

common_blocks = [
    ('html_source', HtmlSourceBlock()),
    ('space', SpaceBlock()),
    ('divider', DividerBlock()),
    ('heading', HeadingBlock()),
    ('content', ContentBlock()),
    ('lead_text', LeadBlock()),
    ('quote', QuoteBlock()),
    ('button', ButtonBlock()),
    ('multiple_buttons', MultipleButtonsBlock()),
    ('image', ResponsiveImageBlock()),
    ('fullwidth_image', FullwidthImageBlock()),
    ('video', VideoBlock()),
    ('image_gallery', ImageGalleryBlock()),
    ('cta_button', CTAButtonBlock()),
    ('content_with_width', ContentWithVariableWidthBlock()),
    ('two_columns', TwoColumnBlock()),
    ('content_with_image', ContentWithImageBlock()),
    ('accordion', AccordionBlock()),
    ('table', TableBlock()),
    ('card_grid', CardGridBlock()),
    # ('dynamic_snippet', DynamicSnippetChooserBlock()),  # Commented out - create snippet model if needed
]


# ============================================================================
# PAGE-SPECIFIC STREAMFIELDS
# ============================================================================

# Homepage - Full set of blocks
homepage_stream_fields = common_blocks + [
    # Add homepage-specific blocks here if needed
]


# General/Internal Pages - Standard content blocks
generalpage_stream_fields = common_blocks + [
    # Add general page-specific blocks here if needed
]


# Landing Pages - Marketing focused
landingpage_stream_fields = common_blocks + [
    # Add landing page-specific blocks here if needed
]


# Blog/News Pages - Content focused
blogpage_stream_fields = [
    ('html_source', HtmlSourceBlock()),
    ('space', SpaceBlock()),
    ('heading', HeadingBlock()),
    ('content', ContentBlock()),
    ('quote', QuoteBlock()),
    ('image', ResponsiveImageBlock()),
    ('fullwidth_image', FullwidthImageBlock()),
    ('video', VideoBlock()),
    ('two_columns', TwoColumnBlock()),
    ('table', TableBlock()),
]


# Content Holder/Snippets - Minimal blocks for reusable content
content_holder_stream_fields = [
    ('html_source', HtmlSourceBlock()),
    ('heading', HeadingBlock()),
    ('content', ContentBlock()),
    ('quote', QuoteBlock()),
    ('content_with_width', ContentWithVariableWidthBlock()),
]


# House Designs specific (will be moved to house_designs/fields.py)
housedesign_stream_fields = common_blocks + [
    # House design specific blocks will be added
]
