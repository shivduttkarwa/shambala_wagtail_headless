from django.db import models

from wagtail.models import Page, Orderable
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel, InlinePanel, MultiFieldPanel
from wagtail.images import get_image_model_string
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel

# API exposure
from wagtail.api import APIField
from wagtail.images.api.fields import ImageRenditionField


class ServiceBox(Orderable):
    """
    Service boxes for the hero section grid
    """
    page = ParentalKey('home.HomePage', on_delete=models.CASCADE, related_name='service_boxes')
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ForeignKey(
        get_image_model_string(),
        null=True, blank=True, on_delete=models.SET_NULL, related_name="+"
    )
    
    panels = [
        FieldPanel('title'),
        FieldPanel('description'),
        FieldPanel('image'),
    ]
    
    def __str__(self):
        return self.title


class TypedText(Orderable):
    """
    Rotating typed text phrases for hero section
    """
    page = ParentalKey('home.HomePage', on_delete=models.CASCADE, related_name='typed_texts')
    text = models.CharField(max_length=200)
    
    panels = [
        FieldPanel('text'),
    ]
    
    def __str__(self):
        return self.text


class HomePage(Page):
    """
    Enhanced headless home page with full hero section support:
      - Hero content (title words, description, CTA)
      - Background image
      - Typed text phrases (rotating)
      - Service boxes grid
    Exposed on the API with optimized image renditions.
    """

    # Hero section fields
    main_title_word_1 = models.CharField(max_length=50, default="we", help_text="First word of main title")
    main_title_word_2 = models.CharField(max_length=50, default="make", help_text="Second word of main title")
    description = models.TextField(blank=True, help_text="Hero description text")
    cta_text = models.CharField(max_length=100, default="Get a Free Site Visit", help_text="Call-to-action button text")
    cta_link = models.CharField(max_length=200, default="#contact", help_text="Call-to-action link")
    
    # Background image
    background_image = models.ForeignKey(
        get_image_model_string(),
        null=True, blank=True, on_delete=models.SET_NULL, related_name="+",
        help_text="Hero background image"
    )
    
    # Legacy fields (keeping for backward compatibility)
    intro = RichTextField(blank=True)
    hero_image = models.ForeignKey(
        get_image_model_string(),
        null=True, blank=True, on_delete=models.SET_NULL, related_name="+"
    )

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldPanel("main_title_word_1"),
            FieldPanel("main_title_word_2"),
            FieldPanel("description"),
            FieldPanel("cta_text"),
            FieldPanel("cta_link"),
            FieldPanel("background_image"),
        ], heading="Hero Section"),
        InlinePanel('typed_texts', label="Typed Text Phrases", min_num=1),
        InlinePanel('service_boxes', label="Service Boxes", min_num=0, max_num=8),
        MultiFieldPanel([
            FieldPanel("intro"),
            FieldPanel("hero_image"),
        ], heading="Legacy Fields", classname="collapsed"),
    ]

    # API fields for headless frontend
    api_fields = [
        APIField("title"),
        APIField("main_title"),
        APIField("typed_texts_list"),
        APIField("description"),
        APIField("cta_text"),
        APIField("cta_link"),
        APIField("background_image", serializer=ImageRenditionField("fill-1920x1080|format-webp")),
        APIField("service_boxes_list"),
        # Legacy fields
        APIField("intro"),
        APIField("hero", serializer=ImageRenditionField("fill-1600x900|format-webp")),
    ]

    @property
    def main_title(self):
        """Return main title as array for frontend"""
        return [self.main_title_word_1, self.main_title_word_2]
    
    @property
    def typed_texts_list(self):
        """Return typed texts as array for frontend"""
        return [item.text for item in self.typed_texts.all()]
    
    @property
    def service_boxes_list(self):
        """Return service boxes with optimized images for frontend"""
        boxes = []
        for i, box in enumerate(self.service_boxes.all()):
            box_data = {
                'id': box.pk,
                'index': i,
                'title': box.title,
                'description': box.description,
            }
            
            if box.image:
                # Generate multiple image sizes for optimal loading
                box_data['image'] = {
                    'url': box.image.get_rendition('fill-400x300|format-webp').url,
                    'small': box.image.get_rendition('fill-200x150|format-webp').url,
                    'full': box.image.get_rendition('width-1920|format-webp').url,
                }
            else:
                box_data['image'] = None
                
            boxes.append(box_data)
        return boxes

    @property
    def hero(self):
        """Legacy property for backward compatibility"""
        return self.hero_image
