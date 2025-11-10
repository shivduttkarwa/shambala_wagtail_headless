# Migration Guide - Updating Existing Apps to Use Core Architecture

This guide explains how to update your existing apps to use the new core architecture.

---

## 🎯 Migration Strategy

We'll migrate apps gradually to avoid breaking changes. Each app can be updated independently.

---

## 📋 Migration Checklist

### ✅ Phase 1: Add Core App (COMPLETED)
- [x] Created `core` app with blocks, models, utils, api
- [x] Added `core` to INSTALLED_APPS
- [x] Created architecture documentation

### 🔄 Phase 2: Update Home App
- [ ] Update HomePage to use PageAbstract
- [ ] Update HomePage hero to use HeroAbstract
- [ ] Update HomePage StreamField to use common_blocks
- [ ] Test home page functionality

### 🔄 Phase 3: Update House Designs App
- [ ] Move reusable blocks to core
- [ ] Keep house-specific blocks in house_designs/blocks.py
- [ ] Update HouseDesignsIndexPage to use PageAbstract and HeroAbstract
- [ ] Update StreamFields to use core blocks
- [ ] Test house designs functionality

### 🔄 Phase 4: Create Migrations & Test
- [ ] Run makemigrations
- [ ] Run migrate
- [ ] Test admin interface
- [ ] Test API responses
- [ ] Test frontend

---

## 🏠 Example: Updating Home App

### Before (Old Structure):

```python
# home/models.py - OLD
from django.db import models
from wagtail.models import Page

class HomePage(Page):
    intro_title = models.CharField(max_length=255)
    intro_text = models.TextField()
    # ... more fields
```

### After (New Structure):

```python
# home/models.py - NEW
from django.db import models
from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel, InlinePanel
from modelcluster.fields import ParentalKey

from core.models import PageAbstract, HeroAbstract
from core.fields import homepage_stream_fields
from core.api import HeadlessSerializerMixin

class HomepageHero(HeroAbstract):
    """Hero section for homepage"""
    page = ParentalKey('HomePage', related_name='homepage_hero')

class HomePage(PageAbstract, HeadlessSerializerMixin, Page):
    """Main homepage"""
    body = StreamField(homepage_stream_fields, blank=True)
    
    content_panels = Page.content_panels + [
        InlinePanel('homepage_hero', label="Hero Section", max_num=1),
        FieldPanel('body'),
    ]
    
    # For headless API
    api_fields = [
        APIField('body'),
        APIField('hero_data', serializer=lambda self: self.get_hero_data('homepage_hero')),
    ]
    
    def get_hero(self):
        """Get hero section"""
        if self.homepage_hero.exists():
            return self.homepage_hero.first()
        return None
```

---

## 🏘️ Example: Updating House Designs App

### Step 1: Separate Reusable vs App-Specific Blocks

**Move to Core** (reusable across apps):
- CTAButtonBlock
- ResponsiveImageBlock
- QuoteBlock
- etc.

**Keep in house_designs/blocks.py** (house-specific):
- HouseSpecsBlock
- PricingBlock
- HouseImageGalleryBlock

### Step 2: Update house_designs/blocks.py

```python
# house_designs/blocks.py - NEW
from wagtail import blocks
from wagtail.images.blocks import ImageChooserBlock

# Import core blocks instead of recreating them
from core.blocks import (
    BUTTON_THEME_CHOICES,
    HrefBlock,
    ContentStreamBlock,
)

# Keep only house-specific blocks here
class HouseSpecsBlock(blocks.StructBlock):
    """House specifications block"""
    storeys = blocks.ChoiceBlock([
        ('single', 'Single Storey'),
        ('double', 'Double Storey'),
        ('three', 'Three Storey'),
    ])
    bedrooms = blocks.IntegerBlock(default=3)
    bathrooms = blocks.DecimalBlock(max_digits=3, decimal_places=1, default=2.0)
    garage_spaces = blocks.IntegerBlock(default=2)
    min_block_width = blocks.DecimalBlock(required=False)
    max_block_width = blocks.DecimalBlock(required=False)
    
    class Meta:
        label = "House Specifications"
        icon = "home"
        template = "house_designs/blocks/house_specs.html"


class PricingBlock(blocks.StructBlock):
    """Pricing information block"""
    base_price = blocks.DecimalBlock(
        required=False,
        max_digits=10,
        decimal_places=2,
        help_text="Base price (leave empty for 'Contact for pricing')"
    )
    price_note = blocks.CharBlock(
        required=False,
        help_text="e.g., 'Plus site costs'"
    )
    
    class Meta:
        label = "Pricing"
        icon = "doc-full"
        template = "house_designs/blocks/pricing.html"


class HouseImageGalleryBlock(blocks.StructBlock):
    """Gallery of house images"""
    images = blocks.ListBlock(
        blocks.StructBlock([
            ('image', ImageChooserBlock()),
            ('caption', blocks.CharBlock(required=False)),
        ])
    )
    
    class Meta:
        label = "House Image Gallery"
        icon = "image"
        template = "house_designs/blocks/house_image_gallery.html"
```

### Step 3: Update house_designs/models.py

```python
# house_designs/models.py - UPDATED
from django.db import models
from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel, InlinePanel
from wagtail.snippets.models import register_snippet
from modelcluster.fields import ParentalKey

from core.models import PageAbstract, HeroAbstract
from core.fields import common_blocks
from core.api import HeadlessSerializerMixin
from core.utils import get_image_data, format_price

# Import house-specific blocks
from .blocks import HouseSpecsBlock, PricingBlock, HouseImageGalleryBlock

# Add house-specific blocks to common blocks
house_designs_stream_fields = common_blocks + [
    ('house_specs', HouseSpecsBlock()),
    ('pricing', PricingBlock()),
    ('house_gallery', HouseImageGalleryBlock()),
]


class HouseDesignsIndexPageHero(HeroAbstract):
    """Hero section for House Designs page"""
    page = ParentalKey('HouseDesignsIndexPage', related_name='housedesigns_hero')


@register_snippet
class HouseDesign(models.Model):
    """House design snippet"""
    name = models.CharField(max_length=255)
    # ... rest of the model
    
    # No changes needed here - snippets work as-is


class HouseDesignsIndexPage(PageAbstract, HeadlessSerializerMixin, Page):
    """Main house designs listing page"""
    
    intro_title = models.CharField(max_length=255, blank=True)
    intro_text = models.TextField(blank=True)
    designs_per_page = models.IntegerField(default=12)
    body = StreamField(house_designs_stream_fields, blank=True)
    
    content_panels = Page.content_panels + [
        InlinePanel('housedesigns_hero', label="Hero Section", max_num=1),
        MultiFieldPanel([
            FieldPanel('intro_title'),
            FieldPanel('intro_text'),
        ], heading="Introduction"),
        FieldPanel('designs_per_page'),
        FieldPanel('body'),
    ]
    
    # API fields
    api_fields = [
        APIField('intro_title'),
        APIField('intro_text'),
        APIField('hero_data', serializer=lambda self: self.get_hero_data('housedesigns_hero')),
        APIField('house_designs_data', serializer=lambda self: self.get_house_designs()),
        APIField('filter_options', serializer=lambda self: self.get_filter_options()),
    ]
    
    def get_hero(self):
        """Get hero section"""
        if self.housedesigns_hero.exists():
            return self.housedesigns_hero.first()
        return None
```

---

## 🔄 Step-by-Step Migration Process

### 1. Backup Your Database
```bash
python manage.py dumpdata > backup.json
```

### 2. Update Models (No Database Changes Yet)
- Add imports from `core`
- Update class inheritance to include abstract models
- Don't change field names - just add new functionality

### 3. Create Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Test Admin Interface
- Check if pages load correctly
- Test creating new content with blocks
- Verify hero sections work

### 5. Test API
- Check API responses include all fields
- Verify image URLs are correct
- Test StreamField serialization

### 6. Update Frontend (If Needed)
- Update TypeScript interfaces if data structure changed
- Test React components

---

## 🛡️ Safety Tips

1. **Work on a branch:**
   ```bash
   git checkout -b feature/core-architecture
   ```

2. **Test incrementally:**
   - Update one app at a time
   - Test thoroughly before moving to next app

3. **Keep backups:**
   - Database backup before migrations
   - Git commit after each successful step

4. **Preserve existing functionality:**
   - Don't remove fields that are in use
   - Keep old code temporarily during transition

---

## 🎯 Benefits After Migration

✅ **Reduced Code Duplication**
- Blocks defined once, used everywhere
- Consistent behavior across pages

✅ **Easier to Add New Features**
- New page types can reuse existing blocks
- Clear patterns to follow

✅ **Better Maintainability**
- Update blocks in one place
- Easier for team collaboration

✅ **Improved API Responses**
- Consistent serialization
- Better structured data

---

## 🆘 Troubleshooting

### Issue: Migration conflicts
**Solution:** Reset migrations and start fresh (in development only)
```bash
python manage.py migrate house_designs zero
python manage.py showmigrations
rm house_designs/migrations/0002_*.py
python manage.py makemigrations
python manage.py migrate
```

### Issue: Blocks not appearing in admin
**Solution:** Check:
1. Block is imported correctly
2. Block is added to StreamField configuration
3. Migrations are applied

### Issue: API not returning new fields
**Solution:** Verify:
1. Field is added to `api_fields`
2. Serializer is correct
3. Page is published (not draft)

---

## 📞 Need Help?

Refer to:
- `ARCHITECTURE.md` - Overall architecture guide
- `core/blocks.py` - Available blocks
- `core/models.py` - Abstract models
- St. Edwards project - Reference implementation

---

**Ready to migrate?** Start with the home app - it's the simplest! 🚀
