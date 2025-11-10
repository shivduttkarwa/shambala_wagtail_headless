# Core Components Quick Reference

## 🚀 Quick Imports

```python
# Abstract Models
from core.models import PageAbstract, HeroAbstract, SEOAbstract, TimestampAbstract

# Block Collections
from core.fields import (
    common_blocks,
    homepage_stream_fields,
    generalpage_stream_fields,
    landingpage_stream_fields,
    blogpage_stream_fields,
)

# Individual Blocks
from core.blocks import (
    HtmlSourceBlock,
    SpaceBlock,
    HeadingBlock,
    ContentBlock,
    ButtonBlock,
    ResponsiveImageBlock,
    VideoBlock,
    ImageGalleryBlock,
    TwoColumnBlock,
    CardGridBlock,
    AccordionBlock,
)

# Utilities
from core.utils import (
    get_image_data,
    format_price,
    truncate_text,
    is_email_valid,
)

# API Helpers
from core.api import HeadlessSerializerMixin, ImageSerializerMixin
```

---

## 📝 Common Patterns

### Create a New Page with Hero

```python
from modelcluster.fields import ParentalKey
from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel, InlinePanel
from wagtail.api import APIField

from core.models import PageAbstract, HeroAbstract
from core.fields import generalpage_stream_fields
from core.api import HeadlessSerializerMixin

class MyPageHero(HeroAbstract):
    page = ParentalKey('MyPage', related_name='mypage_hero')

class MyPage(PageAbstract, HeadlessSerializerMixin, Page):
    body = StreamField(generalpage_stream_fields, blank=True)
    
    content_panels = Page.content_panels + [
        InlinePanel('mypage_hero', label="Hero Section", max_num=1),
        FieldPanel('body'),
    ]
    
    api_fields = [
        APIField('body'),
        APIField('hero_data', serializer=lambda self: self.get_hero_data('mypage_hero')),
    ]
```

### Create App-Specific Blocks

```python
# myapp/blocks.py
from wagtail import blocks
from core.blocks import ContentStreamBlock, ButtonBlock

class MyCustomBlock(blocks.StructBlock):
    title = blocks.CharBlock()
    content = ContentStreamBlock()  # Reuse core blocks
    button = ButtonBlock()          # Reuse core blocks
    
    class Meta:
        label = "My Custom Block"
        template = "myapp/blocks/my_custom_block.html"
```

### Add to Field Configuration

```python
# myapp/fields.py
from core.fields import common_blocks
from .blocks import MyCustomBlock

myapp_stream_fields = common_blocks + [
    ('my_custom_block', MyCustomBlock()),
]
```

---

## 🎨 Available Blocks at a Glance

### Content
- `HtmlSourceBlock` - Raw HTML
- `HeadingBlock` - H1-H6 headings
- `ContentBlock` - Rich text
- `LeadBlock` - Lead text
- `QuoteBlock` - Quotes
- `SpaceBlock` - Vertical spacing
- `DividerBlock` - Horizontal divider

### Media
- `ResponsiveImageBlock` - Images
- `FullwidthImageBlock` - Full-width images
- `VideoBlock` - YouTube/Vimeo/HTML5
- `ImageGalleryBlock` - Galleries

### Interactive
- `ButtonBlock` - Buttons
- `MultipleButtonsBlock` - Button groups
- `CTAButtonBlock` - CTA sections
- `AccordionBlock` - Accordions
- `HrefBlock` - Flexible URLs

### Layout
- `ContentWithVariableWidthBlock` - Flexible width
- `TwoColumnBlock` - 2 columns
- `ContentWithImageBlock` - Content + image
- `CardGridBlock` - Card grids
- `TableBlock` - Tables

---

## 🔧 Utility Functions

```python
from core.utils import *

# Images
image_data = get_image_data(image, base_url)
responsive = get_responsive_image_data(image)

# Text
formatted = format_price(450000)  # "$450,000"
short = truncate_text(long_text, max_length=150)
plain = strip_html_tags(html_content)
slug = sanitize_slug("My Page Title")  # "my-page-title"

# Video
youtube_embed = get_youtube_embed_url(youtube_url)
vimeo_embed = get_vimeo_embed_url(vimeo_url)

# Other
valid = is_email_valid("test@example.com")
time = get_reading_time(article_text)  # minutes
```

---

## 🌐 API Serialization

### Using Mixin

```python
class MyPage(HeadlessSerializerMixin, Page):
    featured_image = models.ForeignKey('wagtailimages.Image', ...)
    
    api_fields = [
        APIField('custom_data', serializer=lambda self: {
            'image': self.serialize_image(self.featured_image),
            'hero': self.get_hero_data('mypage_hero'),
        }),
    ]
```

### Manual Serialization

```python
from core.api import ImageSerializerMixin, serialize_page_for_menu

# Serialize image
image_data = ImageSerializerMixin.image_serializer(image)

# Serialize for menu
menu_data = serialize_page_for_menu(page)

# Serialize children
children = serialize_child_pages(parent_page, limit=5)
```

---

## 🎯 Block Configuration Options

### Padding
```python
top_padding = blocks.ChoiceBlock(choices=TOP_PADDING_CHOICES)
bottom_padding = blocks.ChoiceBlock(choices=BOTTOM_PADDING_CHOICES)
# Options: pt-0 through pt-7, pb-0 through pb-7
```

### Column Width
```python
column_width = blocks.ChoiceBlock(choices=COLUMN_WIDTH_CHOICES)
# Options: col-lg-1 through col-lg-12
```

### Background
```python
background = blocks.ChoiceBlock(choices=BACKGROUND_CHOICES)
# Options: bg-white, bg-cream, bg-light, bg-dark, bg-accent
```

### Button Themes
```python
theme = blocks.ChoiceBlock(choices=BUTTON_THEME_CHOICES)
# Options: btn-primary, btn-secondary, btn-outline-primary, etc.
```

---

## 📋 Admin Panels

### Basic Page Panels

```python
content_panels = Page.content_panels + [
    FieldPanel('field_name'),
    FieldPanel('body'),
]
```

### With Hero Section

```python
content_panels = Page.content_panels + [
    InlinePanel('mypage_hero', label="Hero Section", max_num=1),
    FieldPanel('body'),
]
```

### Grouped Fields

```python
from wagtail.admin.panels import MultiFieldPanel

content_panels = Page.content_panels + [
    MultiFieldPanel([
        FieldPanel('intro_title'),
        FieldPanel('intro_text'),
    ], heading="Introduction"),
    FieldPanel('body'),
]
```

---

## 🔍 Common Tasks

### Add SEO to Page

```python
from core.models import PageAbstract

class MyPage(PageAbstract, Page):
    # Automatically gets:
    # - exclude_from_sitemap
    # - no_index
    # - exclude_from_search
    pass
```

### Add Hero to Page

```python
from core.models import HeroAbstract
from modelcluster.fields import ParentalKey

class MyPageHero(HeroAbstract):
    page = ParentalKey('MyPage', related_name='mypage_hero')

class MyPage(Page):
    content_panels = Page.content_panels + [
        InlinePanel('mypage_hero', label="Hero", max_num=1),
    ]
    
    def get_hero(self):
        return self.mypage_hero.first() if self.mypage_hero.exists() else None
```

### Add StreamField with Common Blocks

```python
from wagtail.fields import StreamField
from core.fields import common_blocks

class MyPage(Page):
    body = StreamField(common_blocks, blank=True)
    
    content_panels = Page.content_panels + [
        FieldPanel('body'),
    ]
```

### Expose to API

```python
from wagtail.api import APIField
from core.api import HeadlessSerializerMixin

class MyPage(HeadlessSerializerMixin, Page):
    api_fields = [
        APIField('title'),
        APIField('body'),
        APIField('hero_data', serializer=lambda self: self.get_hero_data('mypage_hero')),
    ]
```

---

## 📖 Documentation Files

- `ARCHITECTURE.md` - Full architecture guide
- `MIGRATION_GUIDE.md` - How to migrate existing apps
- `REVAMP_SUMMARY.md` - What we built & why
- `QUICK_REFERENCE.md` - This file
- `WAGTAIL_ADMIN_GUIDE.md` - Admin usage guide

---

## 💡 Pro Tips

1. **Before creating a block**, check if it exists in `core/blocks.py`
2. **For page-specific functionality**, use abstract models
3. **For reusable content**, use DynamicSnippetChooserBlock
4. **For API responses**, use HeadlessSerializerMixin
5. **For images in API**, use ImageSerializerMixin
6. **Keep app-specific blocks** in `myapp/blocks.py`
7. **Compose blocks** using ContentStreamBlock
8. **Test in admin** before exposing to API

---

## 🆘 Troubleshooting

**Block not showing in admin?**
- Check it's imported in fields.py
- Check it's in the StreamField list
- Run makemigrations & migrate

**API not returning data?**
- Check field is in `api_fields`
- Check page is published
- Check serializer is correct

**Import errors?**
- Check `core` is in INSTALLED_APPS
- Check file paths are correct
- Restart dev server

---

**Remember: The best code is code you don't have to write! Use core blocks! 🚀**
