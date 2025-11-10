"""
Utility functions for Wagtail Headless CMS

Common helper functions used across the project.
"""

import re
from django.core.validators import validate_email
from django.core.exceptions import ValidationError


def is_email_valid(email):
    """
    Validate email address.
    
    Args:
        email (str): Email address to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    try:
        validate_email(email)
        return True
    except ValidationError:
        return False


def get_base_url(request=None):
    """
    Get the base URL for the site.
    
    Args:
        request: Django request object (optional)
        
    Returns:
        str: Base URL (e.g., 'http://127.0.0.1:8000')
    """
    if request:
        return f"{request.scheme}://{request.get_host()}"
    
    # Fallback to settings or default
    from django.conf import settings
    return getattr(settings, 'BASE_URL', 'http://127.0.0.1:8000')


def get_image_data(image, base_url='http://127.0.0.1:8000'):
    """
    Convert Wagtail image to API-friendly data structure.
    
    Args:
        image: Wagtail Image object
        base_url (str): Base URL for image URLs
        
    Returns:
        dict: Image data with URL, alt text, dimensions
    """
    if not image:
        return None
    
    return {
        'url': f"{base_url}{image.file.url}",
        'alt': image.title,
        'width': image.width,
        'height': image.height,
        'file_size': image.file.size,
    }


def get_rendition_data(image, rendition_spec, base_url='http://127.0.0.1:8000'):
    """
    Get specific rendition of an image.
    
    Args:
        image: Wagtail Image object
        rendition_spec (str): Rendition specification (e.g., 'fill-400x300')
        base_url (str): Base URL for image URLs
        
    Returns:
        dict: Rendition data
    """
    if not image:
        return None
    
    rendition = image.get_rendition(rendition_spec)
    return {
        'url': f"{base_url}{rendition.url}",
        'alt': image.title,
        'width': rendition.width,
        'height': rendition.height,
    }


def get_responsive_image_data(image, base_url='http://127.0.0.1:8000'):
    """
    Get multiple renditions for responsive images.
    
    Args:
        image: Wagtail Image object
        base_url (str): Base URL for image URLs
        
    Returns:
        dict: Image data with multiple renditions
    """
    if not image:
        return None
    
    return {
        'original': get_image_data(image, base_url),
        'thumbnail': get_rendition_data(image, 'fill-400x300', base_url),
        'medium': get_rendition_data(image, 'fill-800x600', base_url),
        'large': get_rendition_data(image, 'fill-1200x900', base_url),
    }


def sanitize_slug(text):
    """
    Convert text to a URL-friendly slug.
    
    Args:
        text (str): Text to slugify
        
    Returns:
        str: Slugified text
    """
    # Convert to lowercase
    text = text.lower()
    
    # Replace spaces and special characters with hyphens
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    
    return text


def truncate_text(text, max_length=150, suffix='...'):
    """
    Truncate text to a maximum length.
    
    Args:
        text (str): Text to truncate
        max_length (int): Maximum length
        suffix (str): Suffix to add if truncated
        
    Returns:
        str: Truncated text
    """
    if len(text) <= max_length:
        return text
    
    # Truncate at word boundary
    truncated = text[:max_length].rsplit(' ', 1)[0]
    return f"{truncated}{suffix}"


def get_youtube_embed_url(youtube_url):
    """
    Convert YouTube URL to embed URL.
    
    Args:
        youtube_url (str): YouTube watch URL
        
    Returns:
        str: YouTube embed URL or None if invalid
    """
    # Extract video ID from various YouTube URL formats
    patterns = [
        r'(?:https?://)?(?:www\.)?youtube\.com/watch\?v=([^&]+)',
        r'(?:https?://)?(?:www\.)?youtu\.be/([^?]+)',
        r'(?:https?://)?(?:www\.)?youtube\.com/embed/([^?]+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, youtube_url)
        if match:
            video_id = match.group(1)
            return f"https://www.youtube.com/embed/{video_id}"
    
    return None


def get_vimeo_embed_url(vimeo_url):
    """
    Convert Vimeo URL to embed URL.
    
    Args:
        vimeo_url (str): Vimeo URL
        
    Returns:
        str: Vimeo embed URL or None if invalid
    """
    # Extract video ID from Vimeo URL
    pattern = r'(?:https?://)?(?:www\.)?vimeo\.com/(\d+)'
    match = re.search(pattern, vimeo_url)
    
    if match:
        video_id = match.group(1)
        return f"https://player.vimeo.com/video/{video_id}"
    
    return None


def format_price(price, currency='$'):
    """
    Format price for display.
    
    Args:
        price (float): Price value
        currency (str): Currency symbol
        
    Returns:
        str: Formatted price (e.g., '$450,000')
    """
    if price is None:
        return 'Contact for pricing'
    
    return f"{currency}{price:,.0f}"


def get_reading_time(text, words_per_minute=200):
    """
    Calculate estimated reading time for text.
    
    Args:
        text (str): Text content
        words_per_minute (int): Average reading speed
        
    Returns:
        int: Estimated reading time in minutes
    """
    word_count = len(re.findall(r'\w+', text))
    reading_time = max(1, round(word_count / words_per_minute))
    return reading_time


def strip_html_tags(html_text):
    """
    Remove HTML tags from text.
    
    Args:
        html_text (str): HTML text
        
    Returns:
        str: Plain text
    """
    clean_text = re.sub(r'<[^>]+>', '', html_text)
    return clean_text.strip()
