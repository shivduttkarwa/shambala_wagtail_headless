"""
Core app admin configuration
"""

from django.contrib import admin
from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet

# You can register core snippets here if needed
# Example:
# @register_snippet
# class DynamicContentSnippet(models.Model):
#     ...
