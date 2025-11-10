"""
API Views for Core App - Site Settings
"""

from django.http import JsonResponse
from wagtail.models import Site
from core.models import SiteSettings
from core.utils import get_base_url, get_image_data


def site_settings_api(request):
    """
    API endpoint to retrieve site-wide settings (header/footer configuration).
    
    Returns header navigation, footer content, contact info, and social links.
    """
    try:
        site = Site.objects.get(is_default_site=True)
        settings = SiteSettings.for_site(site)
        base_url = get_base_url(request)
        
        # Serialize header menu items
        header_menu = []
        for menu_item in settings.header_menu_items:
            item_data = {
                'label': menu_item.value.get('label', ''),
                'aria_label': menu_item.value.get('aria_label', ''),
                'link': menu_item.value.get('link', ''),
            }
            
            # Check if page is selected instead of URL
            if menu_item.value.get('page'):
                page = menu_item.value['page']
                item_data['link'] = page.url if hasattr(page, 'url') else ''
            
            # Serialize sub-items
            sub_items = menu_item.value.get('sub_items', [])
            if sub_items:
                item_data['subItems'] = []
                for sub_item in sub_items:
                    sub_data = {
                        'label': sub_item.get('label', ''),
                        'link': sub_item.get('link', ''),
                    }
                    if sub_item.get('page'):
                        page = sub_item['page']
                        sub_data['link'] = page.url if hasattr(page, 'url') else ''
                    item_data['subItems'].append(sub_data)
            
            header_menu.append(item_data)
        
        # Serialize footer sections
        footer_sections = []
        for section in settings.footer_content:
            section_data = {
                'type': section.value.get('section_type', 'columns'),
            }
            
            if section.value.get('section_type') == 'columns':
                columns = section.value.get('columns', [])
                section_data['columns'] = []
                for column in columns:
                    column_data = {
                        'heading': column.get('heading', ''),
                        'links': []
                    }
                    for link in column.get('links', []):
                        link_data = {
                            'text': link.get('text', ''),
                            'link': link.get('link', ''),
                        }
                        if link.get('page'):
                            page = link['page']
                            link_data['link'] = page.url if hasattr(page, 'url') else ''
                        column_data['links'].append(link_data)
                    section_data['columns'].append(column_data)
            
            elif section.value.get('section_type') == 'text':
                section_data['content'] = section.value.get('content', '')
            
            elif section.value.get('section_type') == 'contact':
                section_data['contact'] = {
                    'show_email': section.value.get('show_email', True),
                    'show_phone': section.value.get('show_phone', True),
                    'show_address': section.value.get('show_address', True),
                    'email': settings.contact_email,
                    'phone': settings.contact_phone,
                    'address': settings.contact_address,
                }
            
            footer_sections.append(section_data)
        
        # Build social media links
        social_links = {}
        if settings.facebook_url:
            social_links['facebook'] = settings.facebook_url
        if settings.twitter_url:
            social_links['twitter'] = settings.twitter_url
        if settings.instagram_url:
            social_links['instagram'] = settings.instagram_url
        if settings.linkedin_url:
            social_links['linkedin'] = settings.linkedin_url
        if settings.youtube_url:
            social_links['youtube'] = settings.youtube_url
        
        # Build response
        response_data = {
            'header': {
                'logo_text': settings.header_logo_text,
                'menu_items': header_menu,
            },
            'footer': {
                'sections': footer_sections,
                'copyright': settings.footer_copyright,
            },
            'contact': {
                'email': settings.contact_email,
                'phone': settings.contact_phone,
                'address': settings.contact_address,
            },
            'social': social_links,
        }
        
        return JsonResponse(response_data)
    
    except Exception as e:
        return JsonResponse(
            {'error': f'Failed to load site settings: {str(e)}'},
            status=500
        )
