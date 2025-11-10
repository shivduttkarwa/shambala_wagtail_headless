"""
House Designs models for Wagtail headless CMS
Includes HouseDesign snippets and HouseDesignsIndexPage for listing
"""

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from wagtail.models import Page
from wagtail.fields import RichTextField, StreamField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel, InlinePanel
from wagtail.snippets.models import register_snippet
from wagtail.api import APIField
from wagtail.images.api.fields import ImageRenditionField
from wagtail.search import index
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel
from taggit.models import TaggedItemBase
from modelcluster.contrib.taggit import ClusterTaggableManager

from .blocks import HouseDesignContentBlock


# ===== CATEGORY MODEL =====

@register_snippet
class HouseCategory(models.Model):
    """
    Categories for house designs (e.g., Freedom, HomeSolution, Designer, etc.)
    """
    name = models.CharField(max_length=100, help_text="Category name (e.g., 'Freedom', 'Designer')")
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True, help_text="Category description")
    icon = models.CharField(
        max_length=50,
        blank=True,
        help_text="Icon identifier (optional)"
    )
    order = models.IntegerField(
        default=0,
        help_text="Display order (lower numbers appear first)"
    )
    
    panels = [
        FieldPanel('name'),
        FieldPanel('slug'),
        FieldPanel('description'),
        FieldPanel('icon'),
        FieldPanel('order'),
    ]
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "House Category"
        verbose_name_plural = "House Categories"
        ordering = ['order', 'name']


# ===== LOCATION/BUILD REGION =====

@register_snippet
class BuildLocation(models.Model):
    """
    Build locations/regions (e.g., Melbourne, Sydney, Brisbane)
    """
    name = models.CharField(max_length=100, help_text="Location name")
    slug = models.SlugField(max_length=100, unique=True)
    is_active = models.BooleanField(
        default=True,
        help_text="Show this location in filters"
    )
    
    panels = [
        FieldPanel('name'),
        FieldPanel('slug'),
        FieldPanel('is_active'),
    ]
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Build Location"
        verbose_name_plural = "Build Locations"
        ordering = ['name']


# ===== HOUSE DESIGN TAG =====

class HouseDesignTag(TaggedItemBase):
    """
    Tags for house designs (e.g., 'Modern', 'Coastal', 'Family Home')
    """
    content_object = ParentalKey(
        'HouseDesign',
        related_name='tagged_items',
        on_delete=models.CASCADE
    )


# ===== MAIN HOUSE DESIGN MODEL =====

@register_snippet
class HouseDesign(index.Indexed, ClusterableModel):
    """
    Main House Design model (registered as snippet for flexible reuse)
    Represents individual house designs that can be displayed across the site
    """
    
    # Basic Information
    name = models.CharField(
        max_length=200,
        help_text="House design name (e.g., 'Ainstie', 'Aira')"
    )
    slug = models.SlugField(max_length=200, unique=True)
    
    description = RichTextField(
        blank=True,
        features=['bold', 'italic', 'link', 'ul', 'ol'],
        help_text="Brief description of the house design"
    )
    
    # Main Image
    featured_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text="Main display image for cards/listings"
    )
    
    # Specifications
    storeys = models.CharField(
        max_length=20,
        choices=[
            ('1', 'Single Storey'),
            ('2', 'Double Storey'),
            ('3', 'Three Storey'),
        ],
        default='1',
        help_text="Number of storeys"
    )
    
    bedrooms = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="Number of bedrooms"
    )
    
    bathrooms = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="Number of bathrooms (e.g., 2.5)"
    )
    
    garage_spaces = models.IntegerField(
        default=2,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        help_text="Number of garage/car spaces"
    )
    
    # Block/Land dimensions
    min_block_width = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Minimum block width in meters"
    )
    
    max_block_width = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Maximum block width in meters (optional)"
    )
    
    # Pricing
    base_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Base price (leave empty for 'Contact for pricing')"
    )
    
    price_note = models.CharField(
        max_length=200,
        blank=True,
        help_text="Additional pricing info (e.g., 'Plus site costs')"
    )
    
    # Categories and Classification
    category = models.ForeignKey(
        HouseCategory,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='house_designs',
        help_text="House design category (e.g., Freedom, Designer)"
    )
    
    build_location = models.ForeignKey(
        BuildLocation,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='house_designs',
        help_text="Primary build location"
    )
    
    tags = ClusterTaggableManager(through=HouseDesignTag, blank=True)
    
    # Display Features
    is_on_display = models.BooleanField(
        default=False,
        help_text="Mark as 'On Display'"
    )
    
    has_virtual_tour = models.BooleanField(
        default=False,
        help_text="Has virtual tour available"
    )
    
    virtual_tour_url = models.URLField(
        blank=True,
        help_text="Virtual tour URL (if available)"
    )
    
    # Flexible Content
    additional_content = StreamField(
        [('content', HouseDesignContentBlock())],
        blank=True,
        default=list,
        use_json_field=True,
        help_text="Additional flexible content blocks"
    )
    
    # Metadata
    is_published = models.BooleanField(
        default=True,
        help_text="Show this design on the website"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Search configuration
    search_fields = [
        index.SearchField('name'),
        index.SearchField('description'),
        index.FilterField('storeys'),
        index.FilterField('bedrooms'),
        index.FilterField('bathrooms'),
        index.FilterField('category'),
        index.FilterField('is_published'),
    ]
    
    # Admin panels
    panels = [
        MultiFieldPanel([
            FieldPanel('name'),
            FieldPanel('slug'),
            FieldPanel('description'),
            FieldPanel('featured_image'),
        ], heading="Basic Information"),
        
        MultiFieldPanel([
            FieldPanel('storeys'),
            FieldPanel('bedrooms'),
            FieldPanel('bathrooms'),
            FieldPanel('garage_spaces'),
            FieldPanel('min_block_width'),
            FieldPanel('max_block_width'),
        ], heading="Specifications"),
        
        MultiFieldPanel([
            FieldPanel('base_price'),
            FieldPanel('price_note'),
        ], heading="Pricing"),
        
        MultiFieldPanel([
            FieldPanel('category'),
            FieldPanel('build_location'),
            FieldPanel('tags'),
        ], heading="Classification"),
        
        MultiFieldPanel([
            FieldPanel('is_on_display'),
            FieldPanel('has_virtual_tour'),
            FieldPanel('virtual_tour_url'),
        ], heading="Display Features"),
        
        FieldPanel('additional_content'),
        
        MultiFieldPanel([
            FieldPanel('is_published'),
        ], heading="Publication"),
    ]
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "House Design"
        verbose_name_plural = "House Designs"
        ordering = ['name']
    
    @property
    def block_width_display(self):
        """Format block width for display"""
        if self.min_block_width and self.max_block_width:
            return f"{self.min_block_width}m - {self.max_block_width}m"
        elif self.min_block_width:
            return f"{self.min_block_width}m+"
        return "Any"
    
    @property
    def price_display(self):
        """Format price for display"""
        if self.base_price:
            return f"${self.base_price:,.0f}"
        return "Contact for pricing"


# ===== HOUSE DESIGNS INDEX PAGE =====

class HouseDesignsIndexPage(Page):
    """
    Listing page for all house designs
    Supports filtering and searching
    """
    
    # Page intro content
    intro_title = models.CharField(
        max_length=200,
        default="Home Designs Melbourne",
        help_text="Page title"
    )
    
    intro_text = RichTextField(
        blank=True,
        features=['bold', 'italic', 'link'],
        help_text="Introduction text below title"
    )
    
    # Hero Section
    hero_background_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text="Hero section background image (optional)"
    )
    
    hero_overlay_opacity = models.IntegerField(
        default=50,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Background image overlay darkness (0-100, default 50)"
    )
    
    # Settings
    designs_per_page = models.IntegerField(
        default=12,
        validators=[MinValueValidator(6), MaxValueValidator(100)],
        help_text="Number of designs to show per page"
    )
    
    # Admin panels
    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldPanel('intro_title'),
            FieldPanel('intro_text'),
        ], heading="Hero Section Content"),
        
        MultiFieldPanel([
            FieldPanel('hero_background_image'),
            FieldPanel('hero_overlay_opacity'),
        ], heading="Hero Section Design"),
        
        FieldPanel('designs_per_page'),
    ]
    
    # Restrict parent page types
    parent_page_types = ['home.HomePage']
    
    # API fields
    api_fields = [
        APIField('intro_title'),
        APIField('intro_text'),
        APIField('designs_per_page'),
        APIField('hero_data'),
        APIField('house_designs_data'),
        APIField('filter_options'),
    ]
    
    @property
    def hero_data(self):
        """Return hero section data for API"""
        from django.conf import settings
        
        # Build base URL for media files
        request = getattr(self, '_request', None)
        if request:
            base_url = f"{request.scheme}://{request.get_host()}"
        else:
            base_url = "http://127.0.0.1:8000"
        
        hero_image = None
        if self.hero_background_image:
            hero_image = {
                'url': base_url + self.hero_background_image.file.url,
                'alt': self.hero_background_image.title,
                'width': self.hero_background_image.width,
                'height': self.hero_background_image.height,
            }
        
        return {
            'title': self.intro_title,
            'subtitle': self.intro_text,
            'background_image': hero_image,
            'overlay_opacity': self.hero_overlay_opacity / 100.0,  # Convert to 0-1 range
        }
    
    def get_context(self, request):
        """Add filtered house designs to context"""
        context = super().get_context(request)
        
        # Get all published house designs
        house_designs = HouseDesign.objects.filter(is_published=True)
        
        # Apply filters from query parameters
        storeys = request.GET.get('storeys')
        if storeys:
            house_designs = house_designs.filter(storeys=storeys)
        
        bedrooms = request.GET.get('bedrooms')
        if bedrooms:
            house_designs = house_designs.filter(bedrooms=bedrooms)
        
        bathrooms = request.GET.get('bathrooms')
        if bathrooms:
            house_designs = house_designs.filter(bathrooms=bathrooms)
        
        category = request.GET.get('category')
        if category:
            house_designs = house_designs.filter(category__slug=category)
        
        max_price = request.GET.get('max_price')
        if max_price:
            try:
                house_designs = house_designs.filter(
                    base_price__lte=float(max_price),
                    base_price__isnull=False
                )
            except (ValueError, TypeError):
                pass
        
        context['house_designs'] = house_designs
        context['filter_options'] = self.filter_options
        
        return context
    
    @property
    def house_designs_data(self):
        """Transform house designs for API"""
        from django.conf import settings
        designs = HouseDesign.objects.filter(is_published=True)
        
        # Build base URL for media files
        request = getattr(self, '_request', None)
        if request:
            base_url = f"{request.scheme}://{request.get_host()}"
        else:
            base_url = "http://127.0.0.1:8000"  # Fallback for development
        
        return [
            {
                'id': design.id,
                'name': design.name,
                'slug': design.slug,
                'description': design.description,
                'image': {
                    'url': base_url + design.featured_image.file.url if design.featured_image else None,
                    'alt': design.featured_image.title if design.featured_image else design.name,
                    'width': design.featured_image.width if design.featured_image else None,
                    'height': design.featured_image.height if design.featured_image else None,
                } if design.featured_image else None,
                'specs': {
                    'storeys': design.storeys,
                    'storeys_label': design.get_storeys_display(),
                    'bedrooms': design.bedrooms,
                    'bathrooms': str(design.bathrooms),
                    'garage_spaces': design.garage_spaces,
                    'block_width': design.block_width_display,
                },
                'pricing': {
                    'base_price': str(design.base_price) if design.base_price else None,
                    'display': design.price_display,
                    'note': design.price_note,
                },
                'category': {
                    'name': design.category.name,
                    'slug': design.category.slug,
                } if design.category else None,
                'location': {
                    'name': design.build_location.name,
                    'slug': design.build_location.slug,
                } if design.build_location else None,
                'badges': {
                    'on_display': design.is_on_display,
                    'virtual_tour': design.has_virtual_tour,
                },
                'virtual_tour_url': design.virtual_tour_url if design.has_virtual_tour else None,
                'tags': [tag.name for tag in design.tags.all()],
            }
            for design in designs
        ]
    
    @property
    def filter_options(self):
        """Get available filter options"""
        return {
            'storeys': [
                {'label': 'Single Storey', 'value': '1'},
                {'label': 'Double Storey', 'value': '2'},
                {'label': 'Three Storey', 'value': '3'},
            ],
            'bedrooms': [
                {'label': str(i), 'value': str(i)}
                for i in range(1, 7)  # 1-6 bedrooms
            ],
            'bathrooms': [
                {'label': '1', 'value': '1'},
                {'label': '2', 'value': '2'},
                {'label': '2.5', 'value': '2.5'},
                {'label': '3', 'value': '3'},
                {'label': '3+', 'value': '3'},
            ],
            'categories': [
                {'label': cat.name, 'value': cat.slug}
                for cat in HouseCategory.objects.all()
            ],
            'price_ranges': [
                {'label': 'Under $300k', 'value': '300000'},
                {'label': 'Under $400k', 'value': '400000'},
                {'label': 'Under $500k', 'value': '500000'},
                {'label': 'Under $600k', 'value': '600000'},
                {'label': '$600k+', 'value': '600001'},
            ],
        }
    
    class Meta:
        verbose_name = "House Designs Index Page"
