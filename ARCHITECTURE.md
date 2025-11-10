# Shambala Wagtail Headless CMS - Architecture Guide

## 🏗️ Project Architecture Overview

This project follows a **scalable, DRY (Don't Repeat Yourself) architecture** inspired by enterprise Wagtail projects. The structure emphasizes reusability, maintainability, and scalability.

---

## 📁 Directory Structure

```
backend/cms/
├── core/                           # Core reusable components
│   ├── blocks.py                   # Reusable StreamField blocks
│   ├── models.py                   # Abstract base models
│   ├── fields.py                   # StreamField configurations
│   ├── utils.py                    # Utility functions
│   ├── api.py                      # API serialization helpers
│   └── templates/core/blocks/      # Block templates
│
├── home/                           # Home page app
│   ├── models.py                   # HomePage model
│   └── templates/home/             # Home page templates
│
├── house_designs/                  # House designs app
│   ├── blocks.py                   # House-specific blocks
│   ├── models.py                   # HouseDesign models
│   └── templates/house_designs/    # House design templates
│
├── search/                         # Search functionality
│
└── cms/                            # Django project settings
    ├── settings/
    │   ├── base.py                # Base settings
    │   ├── dev.py                 # Development settings
    │   └── production.py          # Production settings
    ├── urls.py
    └── wsgi.py
```

---

## 🧩 Core Components

### 1. **Core Blocks Library** (`core/blocks.py`)

The heart of content reusability. All StreamField blocks are defined here and can be used across any page type.

#### Available Block Categories:

**Basic Content Blocks:**
- `HtmlSourceBlock` - Raw HTML content
- `SpaceBlock` - Vertical spacing
- `DividerBlock` - Horizontal divider
- `HeadingBlock` - Headings with styling
- `ContentBlock` - Rich text content
- `LeadBlock` - Lead/intro text
- `QuoteBlock` - Blockquotes

**Media Blocks:**
- `ResponsiveImageBlock` - Images with captions
- `FullwidthImageBlock` - Full-width images
- `VideoBlock` - YouTube, Vimeo, HTML5 video
- `ImageGalleryBlock` - Image galleries/sliders

**Interactive Blocks:**
- `ButtonBlock` - Themed buttons
- `MultipleButtonsBlock` - Button groups
- `CTAButtonBlock` - Call-to-action sections
- `AccordionBlock` - Collapsible content

**Layout Blocks:**
- `ContentWithVariableWidthBlock` - Flexible width content
- `TwoColumnBlock` - Two-column layouts
- `ContentWithImageBlock` - Content + image layouts
- `CardGridBlock` - Card grids
- `TableBlock` - Data tables

**Advanced Blocks:**
- `DynamicSnippetChooserBlock` - Reusable content snippets
- `HrefBlock` - Flexible URL handling (internal pages, external links, documents, emails, phone)

#### Block Features:
- ✅ Configurable padding (top/bottom)
- ✅ Background color options
- ✅ Column width control (Bootstrap grid)
- ✅ Custom CSS classes
- ✅ Responsive by default

---

### 2. **Abstract Base Models** (`core/models.py`)

Reusable abstract models that provide common functionality.

#### `PageAbstract`
Provides SEO and visibility settings for all pages:
- Sitemap exclusion
- No-index meta tag
- Search exclusion

```python
from core.models import PageAbstract

class MyPage(PageAbstract, Page):
    # Your page fields...
    pass
```

#### `HeroAbstract`
Reusable hero section for any page type:
- Pre-title, title, description
- Hero image
- Background video
- Popup video with button
- CTA button
- Configurable overlay opacity

```python
from core.models import HeroAbstract
from modelcluster.fields import ParentalKey

class MyPageHero(HeroAbstract):
    page = ParentalKey('MyPage', related_name='mypage_hero')

class MyPage(Page):
    # Use the hero in your page
    def get_hero(self):
        if self.mypage_hero.all():
            return self.mypage_hero.first()
        return None
```

#### Other Abstract Models:
- `SEOAbstract` - Advanced SEO fields
- `TimestampAbstract` - Created/updated timestamps

---

### 3. **Field Configurations** (`core/fields.py`)

Centralized StreamField configurations that compose blocks into reusable collections.

```python
from core.fields import common_blocks, homepage_stream_fields

# Use in your models
class MyPage(Page):
    body = StreamField(homepage_stream_fields, blank=True)
```

**Available Field Sets:**
- `common_blocks` - All reusable blocks
- `homepage_stream_fields` - Homepage blocks
- `generalpage_stream_fields` - Internal pages
- `landingpage_stream_fields` - Marketing pages
- `blogpage_stream_fields` - Blog/news content
- `content_holder_stream_fields` - Snippets

**Benefits:**
- ✅ Update blocks in one place, affects all pages
- ✅ Consistent content structure
- ✅ Easy to create new page types by composing blocks

---

### 4. **Utility Functions** (`core/utils.py`)

Common helper functions used throughout the project:

```python
from core.utils import (
    is_email_valid,
    get_image_data,
    format_price,
    truncate_text,
    get_youtube_embed_url,
    get_reading_time,
)
```

**Available Utilities:**
- Email validation
- Image data serialization
- Price formatting
- Text truncation
- YouTube/Vimeo URL processing
- Reading time calculation
- HTML stripping

---

### 5. **API Serialization** (`core/api.py`)

Mixins and helpers for headless CMS API responses:

```python
from core.api import HeadlessSerializerMixin

class MyPage(HeadlessSerializerMixin, Page):
    # Automatic serialization methods available
    pass
```

**Features:**
- Image serialization
- StreamField serialization
- Hero data serialization
- Menu/navigation serialization

---

## 🎯 How to Use This Architecture

### Creating a New Page Type

**1. Define your page model:**

```python
# myapp/models.py
from django.db import models
from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel
from modelcluster.fields import ParentalKey

from core.models import PageAbstract, HeroAbstract
from core.fields import generalpage_stream_fields
from core.api import HeadlessSerializerMixin

class MyPageHero(HeroAbstract):
    page = ParentalKey('MyPage', related_name='mypage_hero')

class MyPage(PageAbstract, HeadlessSerializerMixin, Page):
    intro_text = models.TextField(blank=True)
    body = StreamField(generalpage_stream_fields, blank=True)
    
    content_panels = Page.content_panels + [
        InlinePanel('mypage_hero', label="Hero Section", max_num=1),
        FieldPanel('intro_text'),
        FieldPanel('body'),
    ]
    
    # API fields for headless CMS
    api_fields = [
        APIField('intro_text'),
        APIField('body'),
        APIField('hero_data', serializer=lambda self: self.get_hero_data('mypage_hero')),
    ]
```

**2. Use existing blocks (no need to recreate):**
- All blocks from `core/blocks.py` are automatically available in your StreamField
- No need to define HeadingBlock, ContentBlock, VideoBlock, etc. again

**3. Create app-specific blocks (only if needed):**

```python
# myapp/blocks.py
from wagtail import blocks
from core.blocks import ContentStreamBlock  # Reuse nested blocks

class MyCustomBlock(blocks.StructBlock):
    title = blocks.CharBlock()
    content = ContentStreamBlock()  # Nest core blocks
    
    class Meta:
        label = "My Custom Block"
        template = "myapp/blocks/my_custom_block.html"
```

---

## 🔄 Scaling Strategy

### Adding New Apps

1. **Create the app:**
   ```bash
   python manage.py startapp myapp
   ```

2. **Add to INSTALLED_APPS** (in `cms/settings/base.py`):
   ```python
   INSTALLED_APPS = [
       "core",  # Always first after CORS
       "home",
       "myapp",  # Your new app
       # ...
   ]
   ```

3. **Import and use core components:**
   - Use `PageAbstract` for SEO
   - Use `HeroAbstract` for heroes
   - Use `common_blocks` for content
   - Use `core.utils` for helpers

### Adding New Blocks

**For reusable blocks (used across multiple apps):**
- Add to `core/blocks.py`
- Add to appropriate field set in `core/fields.py`
- Create template in `core/templates/core/blocks/`

**For app-specific blocks:**
- Create `myapp/blocks.py`
- Import and extend core blocks if needed
- Create app-specific field configuration

---

## 🎨 Template Structure

Templates follow Wagtail's block template pattern:

```
cms/
├── core/templates/core/blocks/
│   ├── heading.html
│   ├── content.html
│   ├── video.html
│   └── ...
│
├── house_designs/templates/house_designs/
│   └── house_designs_index_page.html
│
└── home/templates/home/
    └── home_page.html
```

**Block Template Example:**

```html
{# core/templates/core/blocks/heading.html #}
<div class="heading-block {{ self.alignment }} {{ self.css_class }}">
    {{ self.heading }}
</div>
```

---

## 🔌 API Structure (Headless CMS)

### API Endpoints

```
/api/v2/pages/           # All pages
/api/v2/pages/{id}/      # Single page
/api/v2/images/          # Images
/api/v2/documents/       # Documents
```

### Adding API Fields to Models

```python
from wagtail.api import APIField
from core.api import ImageSerializerMixin

class MyPage(Page):
    featured_image = models.ForeignKey('wagtailimages.Image', ...)
    
    api_fields = [
        APIField('featured_image', serializer=ImageSerializerMixin.image_serializer),
        APIField('custom_data', serializer=lambda self: {'key': 'value'}),
    ]
```

---

## 📦 Reusable Components Checklist

When building new features, ask yourself:

- ✅ **Can this block be used in other page types?** → Add to `core/blocks.py`
- ✅ **Do other pages need this functionality?** → Create an abstract model in `core/models.py`
- ✅ **Is this a common operation?** → Add utility function to `core/utils.py`
- ✅ **Will the API need this data?** → Add serializer to `core/api.py`
- ✅ **Is this specific to one app?** → Keep it in the app directory

---

## 🚀 Benefits of This Architecture

1. **DRY (Don't Repeat Yourself)**
   - Write blocks once, use everywhere
   - Update in one place, affects all pages

2. **Scalability**
   - Easy to add new page types
   - Easy to add new apps
   - Clear separation of concerns

3. **Maintainability**
   - Centralized block library
   - Consistent code patterns
   - Easy to find and update code

4. **Headless-Ready**
   - Built-in API serialization
   - Reusable serializer mixins
   - Consistent API responses

5. **Team Collaboration**
   - Clear patterns to follow
   - New developers can understand quickly
   - Reduces code conflicts

---

## 📚 Next Steps

1. **Explore existing blocks** in `core/blocks.py`
2. **Use `PageAbstract` and `HeroAbstract`** in new pages
3. **Import blocks from `core.fields`** instead of recreating
4. **Add app-specific blocks** only when needed
5. **Follow the patterns** in `house_designs` and `home` apps

---

## 🎓 Learning Resources

- **Wagtail StreamField Docs**: https://docs.wagtail.org/en/stable/topics/streamfield.html
- **Wagtail API Docs**: https://docs.wagtail.org/en/stable/advanced_topics/api/
- **This Project's Core**: `backend/cms/core/` - Your reusable component library

---

**Remember**: Before creating a new block, check `core/blocks.py` - it probably already exists! 🎉
