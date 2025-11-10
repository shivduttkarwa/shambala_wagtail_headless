"""
Core Abstract Models for Wagtail Headless CMS

Base models that provide common functionality across all page types.
Following the St. Edwards architecture pattern.
"""

from django.db import models
from wagtail.models import Page
from wagtail.images.models import Image
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from modelcluster.fields import ParentalKey


class PageAbstract(models.Model):
    """
    Abstract base model for all pages providing SEO and sitemap settings.
    
    Includes:
    - Sitemap exclusion
    - No-index meta tag
    - Search exclusion
    """
    
    exclude_from_sitemap = models.BooleanField(
        default=False,
        help_text="If checked, this page will be excluded from sitemap.xml"
    )
    
    no_index = models.BooleanField(
        default=False,
        help_text="Check this to add a 'noindex' meta tag (search engines won't index)"
    )
    
    exclude_from_search = models.BooleanField(
        default=False,
        help_text="If checked, this page will be excluded from site search results"
    )

    settings_panels = [
        MultiFieldPanel([
            FieldPanel('exclude_from_sitemap'),
            FieldPanel('exclude_from_search'),
            FieldPanel('no_index'),
        ], heading="SEO & Visibility Settings")
    ]

    def get_sitemap_urls(self, request):
        """Exclude page from sitemap if marked."""
        if self.exclude_from_sitemap:
            return []
        return super().get_sitemap_urls(request)

    class Meta:
        abstract = True


class HeroAbstract(models.Model):
    """
    Abstract hero section model that can be used across different page types.
    
    Features:
    - Pre-title, title, description text
    - Hero image
    - Background video support
    - Popup video with button
    - CTA button with link
    """
    
    pre_title = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        help_text="Small text above the main title (e.g., 'Welcome to')"
    )
    
    title = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        help_text="Main hero heading"
    )
    
    text = models.TextField(
        null=True,
        blank=True,
        help_text="Hero description text"
    )
    
    image = models.ForeignKey(
        Image,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text="Hero background image"
    )
    
    background_video_url = models.URLField(
        null=True,
        blank=True,
        help_text="MP4 video URL for background video"
    )
    
    popup_video_url = models.URLField(
        null=True,
        blank=True,
        max_length=1000,
        help_text="Embedded video URL (YouTube, Vimeo) for popup"
    )
    
    popup_button_label = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        help_text="Label for video popup button (e.g., 'Watch Video')"
    )
    
    button_label = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        help_text="CTA button text"
    )
    
    button_url = models.URLField(
        null=True,
        blank=True,
        help_text="CTA button destination URL"
    )

    overlay_opacity = models.FloatField(
        default=0.5,
        help_text="Background overlay opacity (0.0 - 1.0)"
    )

    panels = [
        MultiFieldPanel([
            FieldPanel('pre_title'),
            FieldPanel('title'),
            FieldPanel('text'),
        ], heading="Hero Content"),
        
        MultiFieldPanel([
            FieldPanel('image'),
            FieldPanel('background_video_url'),
            FieldPanel('overlay_opacity'),
        ], heading="Hero Media"),
        
        MultiFieldPanel([
            FieldPanel('button_label'),
            FieldPanel('button_url'),
        ], heading="CTA Button"),
        
        MultiFieldPanel([
            FieldPanel('popup_video_url'),
            FieldPanel('popup_button_label'),
        ], heading="Video Popup (Optional)"),
    ]

    @property
    def hero_data(self):
        """
        Return hero data formatted for API consumption.
        """
        base_url = 'http://127.0.0.1:8000'  # TODO: Make this configurable
        
        data = {
            'pre_title': self.pre_title,
            'title': self.title,
            'text': self.text,
            'overlay_opacity': self.overlay_opacity,
            'background_image': None,
            'background_video_url': self.background_video_url,
            'popup_video_url': self.popup_video_url,
            'popup_button_label': self.popup_button_label,
            'button': None,
        }
        
        # Add image data
        if self.image:
            data['background_image'] = {
                'url': f"{base_url}{self.image.file.url}",
                'alt': self.image.title,
                'width': self.image.width,
                'height': self.image.height,
            }
        
        # Add button data
        if self.button_label and self.button_url:
            data['button'] = {
                'label': self.button_label,
                'url': self.button_url,
            }
        
        return data

    class Meta:
        abstract = True


class SEOAbstract(models.Model):
    """
    Additional SEO fields for pages that need more control.
    
    Features:
    - Custom meta description
    - Custom meta keywords
    - Open Graph image
    - Twitter card type
    """
    
    meta_description = models.TextField(
        max_length=160,
        null=True,
        blank=True,
        help_text="Meta description for search engines (max 160 characters)"
    )
    
    meta_keywords = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        help_text="Comma-separated keywords"
    )
    
    og_image = models.ForeignKey(
        Image,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text="Open Graph image (Facebook, LinkedIn shares)"
    )
    
    twitter_card_type = models.CharField(
        max_length=20,
        choices=[
            ('summary', 'Summary'),
            ('summary_large_image', 'Summary Large Image'),
        ],
        default='summary',
        help_text="Twitter card type"
    )

    seo_panels = [
        MultiFieldPanel([
            FieldPanel('meta_description'),
            FieldPanel('meta_keywords'),
        ], heading="Meta Tags"),
        
        MultiFieldPanel([
            FieldPanel('og_image'),
            FieldPanel('twitter_card_type'),
        ], heading="Social Media"),
    ]

    class Meta:
        abstract = True


class TimestampAbstract(models.Model):
    """
    Timestamp tracking for created and updated dates.
    """
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# Import required modules for settings
from wagtail.contrib.settings.models import BaseSiteSetting, register_setting
from wagtail.fields import StreamField
from core.blocks import NavigationBlock, FooterBlock


@register_setting
class SiteSettings(BaseSiteSetting):
    """
    Site-wide settings for Header and Footer content.
    Editable from Wagtail admin sidebar under Settings > Site Settings.
    """
    
    # Header/Navigation configuration
    header_logo_text = models.CharField(
        max_length=100,
        default="SHAMBALA HOMES",
        help_text="Text to display in the header logo"
    )
    
    header_menu_items = StreamField(
        [('menu_item', NavigationBlock())],
        blank=True,
        use_json_field=True,
        help_text="Configure the main navigation menu items"
    )
    
    # Footer configuration
    footer_content = StreamField(
        [('footer_section', FooterBlock())],
        blank=True,
        use_json_field=True,
        help_text="Configure footer sections (columns, links, social media, etc.)"
    )
    
    footer_copyright = RichTextField(
        blank=True,
        help_text="Copyright text displayed at the bottom of the footer"
    )
    
    # Contact information
    contact_email = models.EmailField(
        blank=True,
        help_text="Primary contact email"
    )
    
    contact_phone = models.CharField(
        max_length=20,
        blank=True,
        help_text="Primary contact phone number"
    )
    
    contact_address = models.TextField(
        blank=True,
        help_text="Physical address"
    )
    
    # Social media links
    facebook_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    
    panels = [
        MultiFieldPanel([
            FieldPanel('header_logo_text'),
            FieldPanel('header_menu_items'),
        ], heading="Header Settings"),
        
        MultiFieldPanel([
            FieldPanel('footer_content'),
            FieldPanel('footer_copyright'),
        ], heading="Footer Settings"),
        
        MultiFieldPanel([
            FieldPanel('contact_email'),
            FieldPanel('contact_phone'),
            FieldPanel('contact_address'),
        ], heading="Contact Information"),
        
        MultiFieldPanel([
            FieldPanel('facebook_url'),
            FieldPanel('twitter_url'),
            FieldPanel('instagram_url'),
            FieldPanel('linkedin_url'),
            FieldPanel('youtube_url'),
        ], heading="Social Media Links"),
    ]
    
    class Meta:
        verbose_name = "Site Settings"

