"""
API Serialization Helpers for Wagtail Headless CMS

Reusable methods and mixins for serializing Wagtail content to API responses.
"""

from wagtail.api import APIField
from wagtail.images.api.fields import ImageRenditionField
from core.utils import get_base_url, get_image_data


class HeadlessSerializerMixin:
    """
    Mixin providing common serialization methods for headless CMS.
    
    Usage:
        class MyPage(HeadlessSerializerMixin, Page):
            ...
    """
    
    @staticmethod
    def get_api_base_url(request=None):
        """Get base URL for API responses."""
        return get_base_url(request)
    
    def serialize_image(self, image, request=None):
        """
        Serialize Wagtail image to API format.
        
        Args:
            image: Wagtail Image object
            request: Django request object (optional)
            
        Returns:
            dict: Image data
        """
        base_url = self.get_api_base_url(request)
        return get_image_data(image, base_url)
    
    def serialize_streamfield(self, streamfield_value, request=None):
        """
        Serialize StreamField value to API format.
        
        Args:
            streamfield_value: StreamField value
            request: Django request object (optional)
            
        Returns:
            list: Serialized blocks
        """
        if not streamfield_value:
            return []
        
        serialized_blocks = []
        for block in streamfield_value:
            serialized_blocks.append({
                'type': block.block_type,
                'value': block.value,
                'id': block.id,
            })
        
        return serialized_blocks
    
    def get_hero_data(self, hero_relation_name, request=None):
        """
        Get hero section data for API.
        
        Args:
            hero_relation_name (str): Name of the hero relation (e.g., 'homepage_hero')
            request: Django request object (optional)
            
        Returns:
            dict: Hero data or None
        """
        hero_relation = getattr(self, hero_relation_name, None)
        if not hero_relation or not hero_relation.exists():
            return None
        
        hero = hero_relation.first()
        return hero.hero_data if hasattr(hero, 'hero_data') else None


class ImageSerializerMixin:
    """
    Mixin for adding image API fields to pages/snippets.
    
    Usage:
        api_fields = [
            APIField('featured_image', serializer=ImageSerializerMixin.image_serializer),
        ]
    """
    
    @staticmethod
    def image_serializer(image):
        """Serialize single image."""
        if not image:
            return None
        
        base_url = get_base_url()
        return get_image_data(image, base_url)
    
    @staticmethod
    def get_image_api_fields(*field_names):
        """
        Generate APIField entries for multiple image fields.
        
        Args:
            *field_names: Image field names
            
        Returns:
            list: APIField objects
        """
        return [
            APIField(field_name, serializer=ImageSerializerMixin.image_serializer)
            for field_name in field_names
        ]


def serialize_page_for_menu(page):
    """
    Serialize page for menu/navigation.
    
    Args:
        page: Wagtail Page object
        
    Returns:
        dict: Page data for menu
    """
    return {
        'id': page.id,
        'title': page.title,
        'slug': page.slug,
        'url': page.url,
        'show_in_menus': page.show_in_menus,
    }


def serialize_child_pages(parent_page, limit=None, include_unpublished=False):
    """
    Serialize child pages of a parent page.
    
    Args:
        parent_page: Parent Page object
        limit (int): Maximum number of children to return
        include_unpublished (bool): Include unpublished pages
        
    Returns:
        list: Child page data
    """
    children = parent_page.get_children()
    
    if not include_unpublished:
        children = children.live()
    
    if limit:
        children = children[:limit]
    
    return [serialize_page_for_menu(child.specific) for child in children]


def serialize_snippet_data(snippet, fields):
    """
    Generic snippet serializer.
    
    Args:
        snippet: Snippet object
        fields (list): List of field names to serialize
        
    Returns:
        dict: Serialized snippet data
    """
    data = {'id': snippet.id}
    
    for field in fields:
        value = getattr(snippet, field, None)
        
        # Handle image fields
        if hasattr(value, 'file'):  # It's an image
            data[field] = ImageSerializerMixin.image_serializer(value)
        else:
            data[field] = value
    
    return data
