"""
Admin configuration for Pages app
"""

"""
Pages app admin configuration
No custom admin needed - Wagtail handles page models automatically.
"""

from django.contrib import admin

# Pages are managed through Wagtail admin automatically
# No custom admin registration needed
from .models import GeneralPage, LandingPage

# Pages will be managed through the Wagtail Pages interface
# No ModelAdmin registration needed - use the Pages tree
