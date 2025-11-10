#!/usr/bin/env python
"""Check and clean ContentType entries for deleted apps"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cms.settings.dev')
django.setup()

from django.contrib.contenttypes.models import ContentType
from wagtail.models import Page

print("Checking for content types from deleted apps...")

# Find content types for 'about' app
about_content_types = ContentType.objects.filter(app_label='about')
print(f"\nFound {about_content_types.count()} content types for 'about' app:")
for ct in about_content_types:
    print(f"  - {ct.app_label}.{ct.model}")

# Find pages using these content types
if about_content_types.exists():
    print("\nFinding pages using these content types...")
    for ct in about_content_types:
        pages = Page.objects.filter(content_type=ct)
        print(f"\n  Content Type: {ct.app_label}.{ct.model}")
        print(f"  Pages using it: {pages.count()}")
        for page in pages:
            print(f"    - ID: {page.id}, Title: '{page.title}'")
        
        if pages.exists():
            print(f"\n  Deleting {pages.count()} pages...")
            pages.delete()
            print("  ✓ Pages deleted")
    
    print("\nDeleting content types...")
    about_content_types.delete()
    print("✓ Content types deleted")
    print("\nCleanup complete!")
else:
    print("\nNo 'about' content types found - already clean!")
