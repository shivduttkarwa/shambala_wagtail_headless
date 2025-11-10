"""
Reusable blocks for house_designs app and potential use across other apps
These blocks promote consistency and scalability
"""

from wagtail.blocks import (
    CharBlock, TextBlock, RichTextBlock, URLBlock, BooleanBlock,
    StructBlock, ListBlock, PageChooserBlock, StreamBlock, ChoiceBlock,
    IntegerBlock, DecimalBlock
)
from wagtail.images.blocks import ImageChooserBlock


# ===== REUSABLE FOUNDATION BLOCKS =====

class CTAButtonBlock(StructBlock):
    """
    Reusable Call-to-Action button block
    Can be used anywhere in the site for consistency
    """
    button_text = CharBlock(
        max_length=50, 
        default="Learn More",
        help_text="Text displayed on the button"
    )
    button_style = ChoiceBlock(
        choices=[
            ('primary', 'Primary (Filled)'),
            ('secondary', 'Secondary (Outlined)'),
            ('text', 'Text Only'),
        ],
        default='primary',
        help_text="Visual style of the button"
    )
    is_external_link = BooleanBlock(
        default=False,
        required=False,
        help_text="Check if linking to external website"
    )
    external_url = URLBlock(
        required=False,
        help_text="External URL (if external link is checked)"
    )
    page_link = PageChooserBlock(
        required=False,
        help_text="Internal page link (if external link is NOT checked)"
    )
    
    class Meta:
        icon = 'link'
        label = 'CTA Button'


class ResponsiveImageBlock(StructBlock):
    """
    Reusable image block with responsive settings
    """
    image = ImageChooserBlock(help_text="Select an image")
    alt_text = CharBlock(
        max_length=255,
        required=False,
        help_text="Alternative text for accessibility"
    )
    caption = CharBlock(
        max_length=255,
        required=False,
        help_text="Image caption (optional)"
    )
    
    class Meta:
        icon = 'image'
        label = 'Responsive Image'


class BadgeBlock(StructBlock):
    """
    Reusable badge/tag block for labels like "On Display", "Virtual Tour", etc.
    """
    text = CharBlock(max_length=30, help_text="Badge text")
    badge_type = ChoiceBlock(
        choices=[
            ('primary', 'Primary'),
            ('success', 'Success'),
            ('info', 'Info'),
            ('warning', 'Warning'),
        ],
        default='primary',
        help_text="Badge color style"
    )
    icon = CharBlock(
        max_length=50,
        required=False,
        help_text="Icon name (optional, e.g., 'home', 'star')"
    )
    
    class Meta:
        icon = 'tag'
        label = 'Badge'


class FeatureItemBlock(StructBlock):
    """
    Reusable feature item with icon, title, and description
    """
    icon = CharBlock(
        max_length=50,
        required=False,
        help_text="Icon identifier (e.g., 'bed', 'bath', 'garage')"
    )
    label = CharBlock(max_length=50, help_text="Feature label (e.g., 'Bedrooms')")
    value = CharBlock(max_length=50, help_text="Feature value (e.g., '4')")
    
    class Meta:
        icon = 'list-ul'
        label = 'Feature Item'


class FilterOptionBlock(StructBlock):
    """
    Reusable filter option for creating dynamic filters
    """
    label = CharBlock(max_length=100, help_text="Display label")
    value = CharBlock(max_length=100, help_text="Filter value")
    
    class Meta:
        icon = 'radio-empty'
        label = 'Filter Option'


# ===== HOUSE DESIGN SPECIFIC BLOCKS =====

class HouseSpecsBlock(StructBlock):
    """
    Block for house specifications (beds, baths, storeys, etc.)
    """
    storeys = ChoiceBlock(
        choices=[
            ('1', 'Single Storey'),
            ('2', 'Double Storey'),
            ('3', 'Three Storey'),
        ],
        required=False,
        help_text="Number of storeys"
    )
    bedrooms = IntegerBlock(
        required=False,
        min_value=1,
        max_value=10,
        help_text="Number of bedrooms"
    )
    bathrooms = DecimalBlock(
        required=False,
        min_value=1,
        max_value=10,
        decimal_places=1,
        help_text="Number of bathrooms (e.g., 2.5)"
    )
    garage_spaces = IntegerBlock(
        required=False,
        min_value=0,
        max_value=5,
        help_text="Number of garage spaces"
    )
    min_block_width = DecimalBlock(
        required=False,
        decimal_places=1,
        help_text="Minimum block width in meters"
    )
    max_block_width = DecimalBlock(
        required=False,
        decimal_places=1,
        help_text="Maximum block width in meters (optional)"
    )
    
    class Meta:
        icon = 'home'
        label = 'House Specifications'


class HouseImageGalleryBlock(StructBlock):
    """
    Gallery block for house design images
    """
    images = ListBlock(
        ResponsiveImageBlock(),
        min_num=1,
        max_num=20,
        label="Gallery Images"
    )
    layout = ChoiceBlock(
        choices=[
            ('grid', 'Grid Layout'),
            ('masonry', 'Masonry Layout'),
            ('carousel', 'Carousel'),
        ],
        default='grid',
        help_text="Gallery layout style"
    )
    
    class Meta:
        icon = 'image'
        label = 'Image Gallery'


class PricingBlock(StructBlock):
    """
    Pricing information block
    """
    base_price = DecimalBlock(
        required=False,
        decimal_places=2,
        help_text="Base price (leave empty for 'Contact for pricing')"
    )
    price_label = CharBlock(
        max_length=100,
        default="Starting from",
        help_text="Label before price (e.g., 'Starting from', 'From')"
    )
    currency = CharBlock(
        max_length=10,
        default="$",
        help_text="Currency symbol"
    )
    price_note = TextBlock(
        required=False,
        help_text="Additional pricing notes (optional)"
    )
    
    class Meta:
        icon = 'tag'
        label = 'Pricing'


class CompareFeatureBlock(StructBlock):
    """
    Feature for compare table
    """
    feature_name = CharBlock(max_length=100, help_text="Feature name")
    enabled = BooleanBlock(
        default=True,
        required=False,
        help_text="Is this feature available?"
    )
    value = CharBlock(
        max_length=100,
        required=False,
        help_text="Feature value (optional, e.g., 'Included', '10 year warranty')"
    )
    
    class Meta:
        icon = 'tick'
        label = 'Compare Feature'


# ===== STREAMBLOCK FOR FLEXIBLE CONTENT =====

class HouseDesignContentBlock(StreamBlock):
    """
    Flexible content blocks for house design pages
    """
    cta_button = CTAButtonBlock()
    image = ResponsiveImageBlock()
    image_gallery = HouseImageGalleryBlock()
    specifications = HouseSpecsBlock()
    pricing = PricingBlock()
    features_list = ListBlock(
        FeatureItemBlock(),
        label="Features List",
        icon="list-ul"
    )
    
    class Meta:
        icon = 'form'
        label = 'Content Block'
