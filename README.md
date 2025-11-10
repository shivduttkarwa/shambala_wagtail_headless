# 🏡 Shambala Homes - Wagtail Headless CMS

> **Enterprise-grade Wagtail headless CMS with React frontend**  
> Built with scalability, reusability, and maintainability in mind.

---

## 🌟 Features

- ✅ **Headless Wagtail CMS** - Flexible content management with REST API
- ✅ **React Frontend** - Modern, responsive UI with TypeScript
- ✅ **30+ Reusable Blocks** - Content blocks library for rapid development
- ✅ **Abstract Models** - SEO, Heroes, Timestamps ready to use
- ✅ **Enterprise Architecture** - Based on proven patterns from St. Edwards project
- ✅ **Fully Documented** - Comprehensive guides and examples
- ✅ **API-First** - Built for headless consumption
- ✅ **Scalable** - Add new pages and features quickly

---

## 📁 Project Structure

```
Shambala-wagtail/
│
├── backend/cms/                    # Django/Wagtail Backend
│   ├── core/                       # ⭐ Reusable components library
│   │   ├── blocks.py              # 30+ StreamField blocks
│   │   ├── models.py              # Abstract base models
│   │   ├── fields.py              # Field configurations
│   │   ├── utils.py               # Utility functions
│   │   └── api.py                 # API serialization helpers
│   │
│   ├── home/                       # Home page app
│   ├── house_designs/              # House designs app
│   ├── search/                     # Search functionality
│   │
│   └── cms/                        # Django project
│       └── settings/
│           ├── base.py            # Base settings
│           ├── dev.py             # Development
│           └── production.py      # Production
│
├── frontend/                       # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/
│   └── public/
│
├── ARCHITECTURE.md                 # 📖 Architecture guide
├── MIGRATION_GUIDE.md             # 📖 Migration steps
├── REVAMP_SUMMARY.md              # 📖 What we built
├── QUICK_REFERENCE.md             # 📖 Quick reference
└── WAGTAIL_ADMIN_GUIDE.md         # 📖 Admin guide
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL (optional, SQLite for dev)

### Backend Setup

```bash
# Navigate to backend
cd backend/cms

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

**Backend will be available at:** `http://127.0.0.1:8000`  
**Admin panel:** `http://127.0.0.1:8000/admin`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will be available at:** `http://localhost:5173/shambala_homes/`

---

## 📚 Documentation

### For Developers

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete architecture overview
   - Directory structure
   - Core components explained
   - How to create new pages
   - Scaling strategy

2. **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Migrating existing apps
   - Step-by-step migration process
   - Before/after examples
   - Troubleshooting

3. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference guide
   - Common imports
   - Code snippets
   - Utility functions
   - API patterns

4. **[REVAMP_SUMMARY.md](./REVAMP_SUMMARY.md)** - What we built
   - Summary of new architecture
   - Benefits and features
   - Quick start guide

### For Content Editors

5. **[WAGTAIL_ADMIN_GUIDE.md](./WAGTAIL_ADMIN_GUIDE.md)** - Wagtail admin guide
   - How to add content
   - Using blocks
   - Managing images
   - Publishing pages

---

## 🧩 Core Architecture Highlights

### 1. Reusable Blocks Library

Instead of creating blocks in each app, we have a central library:

```python
from core.blocks import (
    HeadingBlock,
    ContentBlock,
    VideoBlock,
    ImageGalleryBlock,
    TwoColumnBlock,
    CardGridBlock,
)
```

**30+ production-ready blocks** including:
- Content blocks (headings, rich text, quotes)
- Media blocks (images, videos, galleries)
- Layout blocks (columns, grids, accordions)
- Interactive blocks (buttons, CTAs, forms)

### 2. Abstract Models

Reusable functionality through inheritance:

```python
from core.models import PageAbstract, HeroAbstract

class MyPageHero(HeroAbstract):
    page = ParentalKey('MyPage', related_name='mypage_hero')

class MyPage(PageAbstract, Page):
    # Automatically includes SEO settings
    # and sitemap controls
    pass
```

### 3. Centralized Configurations

Pre-composed block collections:

```python
from core.fields import (
    homepage_stream_fields,
    generalpage_stream_fields,
    blogpage_stream_fields,
)

class MyPage(Page):
    body = StreamField(homepage_stream_fields, blank=True)
```

### 4. API-First Design

Built-in serialization helpers:

```python
from core.api import HeadlessSerializerMixin

class MyPage(HeadlessSerializerMixin, Page):
    api_fields = [
        APIField('body'),
        APIField('hero_data', serializer=lambda self: self.get_hero_data('mypage_hero')),
    ]
```

---

## 🎯 Creating a New Page (Example)

```python
# myapp/models.py
from django.db import models
from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel, InlinePanel
from wagtail.api import APIField
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
    
    api_fields = [
        APIField('intro_text'),
        APIField('body'),
        APIField('hero_data', serializer=lambda self: self.get_hero_data('mypage_hero')),
    ]
```

**That's it!** Your page now has:
- ✅ 30+ content blocks
- ✅ Hero section with image/video
- ✅ SEO settings
- ✅ API serialization
- ✅ Admin interface

---

## 🛠️ Tech Stack

### Backend
- **Django 5.1+** - Web framework
- **Wagtail 6.3+** - CMS
- **Django REST Framework** - API
- **PostgreSQL/SQLite** - Database
- **Python 3.10+** - Language

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **CSS3** - Styling

---

## 📖 API Documentation

### Base URL
```
http://127.0.0.1:8000/api/v2/
```

### Endpoints

```
GET /api/v2/pages/                    # List all pages
GET /api/v2/pages/{id}/               # Get single page
GET /api/v2/pages/?type=house_designs.HouseDesignsIndexPage  # Filter by type
GET /api/v2/images/                   # List images
GET /api/v2/documents/                # List documents
```

### Example Response

```json
{
  "id": 4,
  "meta": {
    "type": "house_designs.HouseDesignsIndexPage",
    "detail_url": "http://127.0.0.1:8000/api/v2/pages/4/",
    "html_url": "http://127.0.0.1:8000/house-design/"
  },
  "title": "House Designs",
  "hero_data": {
    "title": "Discover Your Dream Home",
    "subtitle": "Explore our collection of homes...",
    "background_image": {
      "url": "http://127.0.0.1:8000/media/...",
      "alt": "Hero image",
      "width": 1920,
      "height": 1080
    },
    "overlay_opacity": 0.7
  },
  "house_designs_data": [...]
}
```

---

## 🔧 Development

### Running Tests

```bash
# Backend tests
cd backend/cms
python manage.py test

# Frontend tests
cd frontend
npm test
```

### Code Quality

```bash
# Python linting
flake8 backend/cms

# TypeScript checking
cd frontend
npm run type-check
```

### Database Migrations

```bash
cd backend/cms
python manage.py makemigrations
python manage.py migrate
```

---

## 🌍 Deployment

### Backend Deployment

1. Set environment variables in `.env`
2. Update `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS`
3. Set `DEBUG=False`
4. Configure PostgreSQL database
5. Run migrations
6. Collect static files: `python manage.py collectstatic`
7. Use Gunicorn/uWSGI for production server

### Frontend Deployment

1. Update API URL in `.env`
2. Build: `npm run build`
3. Deploy `dist` folder to hosting (Netlify, Vercel, etc.)

---

## 🤝 Contributing

This is a private project, but if you're a team member:

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Follow the architecture patterns in `ARCHITECTURE.md`
3. Write tests for new features
4. Create a pull request
5. Wait for code review

---

## 📝 License

Private project - All rights reserved.

---

## 👥 Team

**Project Lead:** Shambala Homes  
**Architecture:** Based on St. Edwards project patterns  
**Framework:** Wagtail CMS + React

---

## 🆘 Support

### For Developers
- Read documentation in `ARCHITECTURE.md`
- Check `QUICK_REFERENCE.md` for snippets
- Review `MIGRATION_GUIDE.md` for updating apps

### For Content Editors
- Read `WAGTAIL_ADMIN_GUIDE.md`
- Contact tech team for issues

### Common Issues

**Problem:** Blocks not showing in admin  
**Solution:** Check migrations are applied, block is in field configuration

**Problem:** API not returning data  
**Solution:** Check `api_fields` in model, ensure page is published

**Problem:** Images not loading  
**Solution:** Check image URLs include base URL, CORS is configured

---

## 🎉 What's New (Latest Update)

### v2.0 - Architecture Revamp (Current)
- ✅ Created `core` app with reusable components
- ✅ Added 30+ production-ready blocks
- ✅ Implemented abstract models (PageAbstract, HeroAbstract)
- ✅ Centralized field configurations
- ✅ Added utility functions and API helpers
- ✅ Comprehensive documentation created
- ✅ Scalable architecture based on enterprise patterns

### v1.0 - Initial Release
- ✅ Wagtail headless CMS setup
- ✅ React frontend with TypeScript
- ✅ House Designs functionality
- ✅ Home page with hero section
- ✅ API integration

---

**Built with ❤️ using Wagtail and React**

For questions or support, refer to the documentation or contact the development team.
