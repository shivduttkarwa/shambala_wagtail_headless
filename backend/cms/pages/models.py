"""
General Purpose Pages Models

This module provides two main page types:
1. GeneralPage - For internal content pages (About, Services, etc.)
2. LandingPage - For marketing/campaign landing pages

Both leverage core blocks for maximum reusability.
"""

from django.db import models
from wagtail.models import Page
from wagtail.fields import StreamField, RichTextField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel, InlinePanel
from wagtail.api import APIField
from wagtail.search import index
from modelcluster.fields import ParentalKey

from core.models import PageAbstract, HeroAbstract, SEOAbstract
from core.fields import generalpage_stream_fields, landingpage_stream_fields
from core.api import HeadlessSerializerMixin


# ============================================================================
# GENERAL PAGE (Internal Pages)
# ============================================================================

class GeneralPageHero(HeroAbstract):
    """Hero section for General Pages"""
    page = ParentalKey('GeneralPage', related_name='generalpage_hero')


class GeneralPage(PageAbstract, SEOAbstract, HeadlessSerializerMixin, Page):
    """
    General/Internal Page for standard content.
    
    Use cases:
    - About Us
    - Services
    - Team
    - Contact
    - Privacy Policy
    - Terms & Conditions
    - Any standard content page
    
    Features:
    - Hero section (optional)
    - Flexible StreamField body
    - Full SEO controls
    - Sitemap controls
    - API-ready for headless
    """
    
    # Introduction section (optional, appears before StreamField)
    intro_title = models.CharField(
        max_length=255,
        blank=True,
        help_text="Optional intro title (if not using hero)"
    )
    
    intro_text = RichTextField(
        blank=True,
        help_text="Optional intro text (if not using hero)"
    )
    
    # Main content area with all core blocks
    body = StreamField(
        generalpage_stream_fields,
        blank=True,
        help_text="Main page content using flexible blocks"
    )
    
    # Search indexing
    search_fields = Page.search_fields + [
        index.SearchField('intro_title'),
        index.SearchField('intro_text'),
        index.SearchField('body'),
    ]
    
    # Admin panels
    content_panels = Page.content_panels + [
        InlinePanel('generalpage_hero', label="Hero Section", max_num=1),
        MultiFieldPanel([
            FieldPanel('intro_title'),
            FieldPanel('intro_text'),
        ], heading="Introduction (if not using hero)"),
        FieldPanel('body'),
    ]
    
    promote_panels = PageAbstract.settings_panels + SEOAbstract.seo_panels
    
    # API configuration for headless CMS
    api_fields = [
        APIField('intro_title'),
        APIField('intro_text'),
        APIField('body'),
        APIField('hero_data', serializer=lambda self: self.get_hero_data('generalpage_hero')),
    ]
    
    class Meta:
        verbose_name = 'General Page'
        verbose_name_plural = 'General Pages'
    
    def get_hero(self):
        """Get hero section if exists"""
        if self.generalpage_hero.exists():
            return self.generalpage_hero.first()
        return None


# ============================================================================
# LANDING PAGE (Marketing Pages)
# ============================================================================

class LandingPageHero(HeroAbstract):
    """Hero section for Landing Pages"""
    page = ParentalKey('LandingPage', related_name='landingpage_hero')


class LandingPage(PageAbstract, SEOAbstract, HeadlessSerializerMixin, Page):
    """
    Landing Page for marketing campaigns.
    
    Use cases:
    - Product launches
    - Campaign pages
    - Special offers
    - Event pages
    - Lead generation pages
    - A/B testing pages
    
    Features:
    - Hero section (highly recommended)
    - Flexible StreamField body
    - Full SEO controls
    - Can be excluded from main navigation
    - Ideal for marketing campaigns
    - API-ready for headless
    """
    
    # Subtitle/tagline
    subtitle = models.CharField(
        max_length=255,
        blank=True,
        help_text="Catchy subtitle or tagline for the landing page"
    )
    
    # Main content area with all core blocks
    body = StreamField(
        landingpage_stream_fields,
        blank=True,
        help_text="Landing page content using flexible blocks"
    )
    
    # Landing page specific settings
    hide_from_navigation = models.BooleanField(
        default=False,
        help_text="Hide this page from main navigation menus"
    )
    
    conversion_tracking_code = models.TextField(
        blank=True,
        help_text="Optional: Add conversion tracking code (Google Analytics, Facebook Pixel, etc.)"
    )
    
    # Search indexing
    search_fields = Page.search_fields + [
        index.SearchField('subtitle'),
        index.SearchField('body'),
    ]
    
    # Admin panels
    content_panels = Page.content_panels + [
        InlinePanel('landingpage_hero', label="Hero Section (Recommended)", max_num=1),
        FieldPanel('subtitle'),
        FieldPanel('body'),
    ]
    
    promote_panels = PageAbstract.settings_panels + SEOAbstract.seo_panels
    
    settings_panels = Page.settings_panels + [
        MultiFieldPanel([
            FieldPanel('hide_from_navigation'),
            FieldPanel('conversion_tracking_code'),
        ], heading="Landing Page Settings"),
    ]
    
    # API configuration for headless CMS
    api_fields = [
        APIField('subtitle'),
        APIField('body'),
        APIField('hide_from_navigation'),
        APIField('hero_data', serializer=lambda self: self.get_hero_data('landingpage_hero')),
    ]
    
    class Meta:
        verbose_name = 'Landing Page'
        verbose_name_plural = 'Landing Pages'
    
    def get_hero(self):
        """Get hero section if exists"""
        if self.landingpage_hero.exists():
            return self.landingpage_hero.first()
        return None
    
    def serve(self, request, *args, **kwargs):
        """
        Custom serve method to inject tracking code in template context.
        Override in template if needed.
        """
        response = super().serve(request, *args, **kwargs)
        return response
