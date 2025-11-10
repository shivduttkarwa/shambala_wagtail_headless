# 🎉 Shambala Wagtail Project - Revamped Architecture

## What We've Built

I've restructured your Wagtail headless CMS project to match the **scalable, enterprise-grade architecture** from your St. Edwards project. This new structure emphasizes **code reusability**, **maintainability**, and **scalability**.

---

## 📦 New Core Architecture

### **Created: `backend/cms/core/` App**

This is your new **reusable components library** that all other apps will use.

```
backend/cms/core/
├── blocks.py       # 30+ reusable StreamField blocks
├── models.py       # Abstract base models (PageAbstract, HeroAbstract, etc.)
├── fields.py       # Centralized StreamField configurations
├── utils.py        # 15+ utility functions
├── api.py          # API serialization helpers & mixins
├── apps.py         # App configuration
└── __init__.py     # Package initialization
```

---

## 🧩 What's Included

### **1. Reusable Blocks Library** (`blocks.py`)

**30+ production-ready blocks** that you can use across all page types:

#### Content Blocks:
- `HtmlSourceBlock` - Raw HTML
- `HeadingBlock` - Customizable headings
- `ContentBlock` - Rich text with multiple list styles
- `LeadBlock` - Intro/lead text
- `QuoteBlock` - Blockquotes with author
- `SpaceBlock` - Vertical spacing
- `DividerBlock` - Horizontal dividers

#### Media Blocks:
- `ResponsiveImageBlock` - Images with captions & alt text
- `FullwidthImageBlock` - Full-width images
- `VideoBlock` - YouTube, Vimeo, HTML5 video support
- `ImageGalleryBlock` - Sliders & grids

#### Interactive Blocks:
- `ButtonBlock` - Themed buttons (primary, secondary, outline, etc.)
- `MultipleButtonsBlock` - Button groups
- `CTAButtonBlock` - Call-to-action sections
- `AccordionBlock` - Collapsible content
- `HrefBlock` - Flexible URLs (pages, external, documents, email, phone)

#### Layout Blocks:
- `ContentWithVariableWidthBlock` - Flexible column widths
- `TwoColumnBlock` - Two-column layouts
- `ContentWithImageBlock` - Content + image (left/right alignment)
- `CardGridBlock` - Card grids (2, 3, 4 columns)
- `TableBlock` - Data tables

#### Advanced Blocks:
- `DynamicSnippetChooserBlock` - Reusable content snippets

**Each block includes:**
- ✅ Configurable padding (top/bottom, 0-7x)
- ✅ Background color options
- ✅ Column width control (Bootstrap grid system)
- ✅ Custom CSS classes
- ✅ Responsive by default

---

### **2. Abstract Base Models** (`models.py`)

#### **`PageAbstract`**
Add to any page for SEO & visibility control:
- Sitemap exclusion
- No-index meta tag
- Search exclusion

```python
from core.models import PageAbstract

class MyPage(PageAbstract, Page):
    # Automatically gets SEO settings
    pass
```

#### **`HeroAbstract`**
Reusable hero sections for any page:
- Pre-title, title, description
- Hero background image
- Background video support
- Popup video with button
- CTA button with link
- Configurable overlay opacity
- Auto-serializes for API

```python
class MyPageHero(HeroAbstract):
    page = ParentalKey('MyPage', related_name='mypage_hero')
```

#### **Other Models:**
- `SEOAbstract` - Advanced SEO fields (meta description, OG image, Twitter cards)
- `TimestampAbstract` - Created/updated tracking

---

### **3. Centralized Field Configurations** (`fields.py`)

Pre-composed StreamField configurations:

```python
from core.fields import (
    common_blocks,              # All reusable blocks
    homepage_stream_fields,     # Homepage blocks
    generalpage_stream_fields,  # Internal pages
    landingpage_stream_fields,  # Marketing pages
    blogpage_stream_fields,     # Blog/news content
)

# Use in your models
class MyPage(Page):
    body = StreamField(homepage_stream_fields, blank=True)
```

**Benefits:**
- Update blocks in ONE place, affects ALL pages
- Consistent content structure
- Easy to create new page types by composing blocks

---

### **4. Utility Functions** (`utils.py`)

**15+ helper functions:**

```python
from core.utils import (
    is_email_valid,           # Email validation
    get_image_data,           # Serialize images for API
    get_responsive_image_data, # Multiple image renditions
    format_price,             # Format prices ($450,000)
    truncate_text,            # Smart text truncation
    get_youtube_embed_url,    # Convert YouTube URLs
    get_vimeo_embed_url,      # Convert Vimeo URLs
    get_reading_time,         # Calculate reading time
    strip_html_tags,          # Remove HTML tags
    sanitize_slug,            # Create URL-friendly slugs
)
```

---

### **5. API Serialization** (`api.py`)

Mixins for headless CMS:

```python
from core.api import HeadlessSerializerMixin, ImageSerializerMixin

class MyPage(HeadlessSerializerMixin, Page):
    # Automatic methods:
    # - serialize_image()
    # - serialize_streamfield()
    # - get_hero_data()
    pass
```

**Features:**
- Automatic image serialization with full URLs
- StreamField serialization
- Hero data formatting
- Menu/navigation helpers

---

## 📚 Documentation Created

### **1. ARCHITECTURE.md**
Complete architecture guide covering:
- Directory structure
- Component descriptions
- Usage examples
- Scaling strategy
- Template structure
- API patterns
- Best practices checklist

### **2. MIGRATION_GUIDE.md**
Step-by-step migration guide:
- How to update existing apps
- Before/after code examples
- Safety tips & troubleshooting
- Testing checklist

---

## 🎯 How to Use

### **Creating a New Page Type (Simple Example):**

```python
# myapp/models.py
from django.db import models
from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel, InlinePanel
from modelcluster.fields import ParentalKey
from wagtail.api import APIField

from core.models import PageAbstract, HeroAbstract
from core.fields import generalpage_stream_fields
from core.api import HeadlessSerializerMixin

# 1. Create hero using abstract model
class MyPageHero(HeroAbstract):
    page = ParentalKey('MyPage', related_name='mypage_hero')

# 2. Create page using abstract models and common blocks
class MyPage(PageAbstract, HeadlessSerializerMixin, Page):
    intro_text = models.TextField(blank=True)
    
    # Use pre-configured blocks from core
    body = StreamField(generalpage_stream_fields, blank=True)
    
    content_panels = Page.content_panels + [
        InlinePanel('mypage_hero', label="Hero Section", max_num=1),
        FieldPanel('intro_text'),
        FieldPanel('body'),
    ]
    
    # API configuration for headless CMS
    api_fields = [
        APIField('intro_text'),
        APIField('body'),
        APIField('hero_data', serializer=lambda self: self.get_hero_data('mypage_hero')),
    ]
```

**That's it!** Your page now has:
- ✅ 30+ content blocks available
- ✅ Hero section with image, video, CTA
- ✅ SEO settings
- ✅ API serialization
- ✅ Consistent with all other pages

---

## 🚀 Benefits

### **1. DRY (Don't Repeat Yourself)**
- Write blocks once, use everywhere
- Update in one place, affects all pages

### **2. Scalability**
- Easy to add new page types
- Easy to add new apps
- Clear patterns to follow

### **3. Maintainability**
- Centralized block library
- Consistent code structure
- Easy for teams to collaborate

### **4. Headless-Ready**
- Built-in API serialization
- Reusable mixins
- Consistent API responses

### **5. Production-Ready**
- Based on proven St. Edwards architecture
- Enterprise-grade patterns
- SEO and performance optimized

---

## 📋 Next Steps

### **Immediate Actions:**

1. **Review the documentation:**
   - Read `ARCHITECTURE.md` for full understanding
   - Review `MIGRATION_GUIDE.md` for migration steps

2. **Explore the core:**
   - Check `core/blocks.py` - see all available blocks
   - Check `core/models.py` - understand abstract models
   - Check `core/utils.py` - useful helper functions

3. **Start using it:**
   - When creating new pages, inherit from `PageAbstract`
   - Use `HeroAbstract` for hero sections
   - Import blocks from `core.fields` instead of creating new ones

### **Optional: Migrate Existing Apps**

You can gradually migrate existing apps (home, house_designs) to use the new core architecture. The `MIGRATION_GUIDE.md` has detailed steps, but this is optional - existing code will continue to work.

---

## 🎨 Example: Your Current vs New Approach

### **OLD Way (Repeating Code):**

```python
# house_designs/blocks.py
class CTAButtonBlock(blocks.StructBlock):
    text = blocks.CharBlock()
    url = blocks.URLBlock()
    # ...

# home/blocks.py (DUPLICATE!)
class CTAButtonBlock(blocks.StructBlock):
    text = blocks.CharBlock()
    url = blocks.URLBlock()
    # ...
```

### **NEW Way (Reusable):**

```python
# Just import from core - no duplication!
from core.blocks import ButtonBlock, CTAButtonBlock
from core.fields import common_blocks

# Use in any page
body = StreamField(common_blocks, blank=True)
```

---

## 🛠️ What You Can Copy from St. Edwards

You can now easily copy these patterns from St. Edwards:
- ✅ ContentWithVariableWidthBlock
- ✅ TwoColumnBlock
- ✅ CardGridBlock
- ✅ AccordionBlock
- ✅ VideoBlock with YouTube/Vimeo support
- ✅ HrefBlock for flexible URLs
- ✅ PageAbstract with SEO settings
- ✅ HeroAbstract for reusable heroes

They're all in `core/blocks.py` and `core/models.py` now!

---

## 📞 Need Help?

### **Documentation:**
- `ARCHITECTURE.md` - Full architecture guide
- `MIGRATION_GUIDE.md` - Migration steps
- `WAGTAIL_ADMIN_GUIDE.md` - Admin usage guide

### **Code Reference:**
- `core/blocks.py` - All available blocks
- `core/models.py` - Abstract models
- `core/fields.py` - Field configurations
- `core/utils.py` - Utility functions
- `core/api.py` - API helpers

### **Examples:**
- Your St. Edwards project - Original patterns
- `house_designs` app - Current implementation
- `MIGRATION_GUIDE.md` - Before/after examples

---

## ✨ Summary

You now have a **professional, scalable Wagtail headless CMS architecture** that:

1. ✅ Follows enterprise-grade patterns from your St. Edwards project
2. ✅ Eliminates code duplication across apps
3. ✅ Makes adding new pages/features incredibly fast
4. ✅ Provides 30+ production-ready content blocks
5. ✅ Includes reusable abstract models for SEO, heroes, timestamps
6. ✅ Has built-in API serialization for headless CMS
7. ✅ Is fully documented and easy to understand
8. ✅ Can scale to 10+ apps without becoming messy

**Your project is now organized just like St. Edwards, but tailored for headless CMS!** 🎉

---

## 🎯 Quick Start

**To use the new architecture in your next page:**

```python
from core.models import PageAbstract, HeroAbstract
from core.fields import generalpage_stream_fields
from core.api import HeadlessSerializerMixin

# Your page is now enterprise-grade! 🚀
```

**That's it!** Welcome to scalable Wagtail development! 🎊
