"""
Django settings for cms project (env-driven, PostgreSQL-ready).

- Uses python-dotenv to load .env next to manage.py
- Uses dj-database-url to parse DATABASE_URL (PostgreSQL in WSL)
- Keeps Wagtail defaults; minimal hard-coding
"""

from pathlib import Path
import os

# --- third-party helpers for clean env/db config ---
from dotenv import load_dotenv
import dj_database_url

# -------------------------------------------------------------------
# Paths
# -------------------------------------------------------------------
PROJECT_DIR = Path(__file__).resolve().parent.parent  # .../cms
BASE_DIR = PROJECT_DIR.parent                         # project root

# load .env from project root (same folder as manage.py)
load_dotenv(BASE_DIR / ".env")

# -------------------------------------------------------------------
# Core Django settings (env-driven)
# -------------------------------------------------------------------
SECRET_KEY = os.getenv("SECRET_KEY", "insecure-default-key")
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
ALLOWED_HOSTS = [h.strip() for h in os.getenv("ALLOWED_HOSTS", "127.0.0.1,localhost").split(",") if h.strip()]

# For dev behind proxies / docker / wsl port-forwarding (optional)
CSRF_TRUSTED_ORIGINS = [o.strip() for o in os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",") if o.strip()]

# -------------------------------------------------------------------
# Applications
# -------------------------------------------------------------------
INSTALLED_APPS = [
    # CORS (must be at the top)
    "corsheaders",
    
    # Project apps
    "core",  # Core reusable components (blocks, models, utils)
    "home",
    "pages",  # General pages (internal pages & landing pages)
    "search",
    "house_designs",
    

    # Wagtail
    "wagtail.api.v2",   
    "wagtail.contrib.forms",
    "wagtail.contrib.redirects",
    "wagtail.contrib.settings",  # For site-wide settings
    "wagtail.embeds",
    "wagtail.sites",
    "wagtail.users",
    "wagtail.snippets",
    "wagtail.documents",
    "wagtail.images",
    "wagtail.search",
    "wagtail.admin",
    "wagtail",

    # Deps
    "modelcluster",
    "taggit",
    "django_filters",

    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "wagtail.contrib.redirects.middleware.RedirectMiddleware",
]

# CORS settings for development
CORS_ALLOW_ALL_ORIGINS = True  # Only for development
CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5173",  # Desktop Vite dev server
    "http://localhost:5173",  # Desktop alternative
    "http://127.0.0.1:5174",  # Desktop Vite dev server (alt port)
    "http://localhost:5174",  # Desktop alternative (alt port)
    "http://192.168.1.8:5173",  # Mobile access to Vite
    "http://192.168.1.8:5174",  # Mobile access to Vite (alt port)
    "http://127.0.0.1:3000",  # Alternative ports
    "http://localhost:3000",
    "http://192.168.1.8:3000",
]

# Allow credentials for CORS
CORS_ALLOW_CREDENTIALS = True

ROOT_URLCONF = "cms.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [PROJECT_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "cms.wsgi.application"

# -------------------------------------------------------------------
# Database (PostgreSQL via DATABASE_URL; fallback to SQLite)
#   Example .env:
#   DATABASE_URL=postgres://shamba:YourPassword@127.0.0.1:5432/shambala_cms
# -------------------------------------------------------------------
DATABASES = {
    "default": dj_database_url.config(
        env="DATABASE_URL",
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,  # persistent connections (good for prod)
    )
}

# -------------------------------------------------------------------
# Password validation
# -------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# -------------------------------------------------------------------
# I18N / TZ
# -------------------------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = os.getenv("TIME_ZONE", "UTC")
USE_I18N = True
USE_TZ = True

# -------------------------------------------------------------------
# Static & Media
# -------------------------------------------------------------------
STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]

STATICFILES_DIRS = [PROJECT_DIR / "static"]
STATIC_ROOT = BASE_DIR / "static"
STATIC_URL = "/static/"

MEDIA_ROOT = BASE_DIR / "media"
MEDIA_URL = "/media/"

STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
}

# -------------------------------------------------------------------
# Django form field limit (Wagtail editor on complex pages)
# -------------------------------------------------------------------
DATA_UPLOAD_MAX_NUMBER_FIELDS = 10_000

# -------------------------------------------------------------------
# Wagtail
# -------------------------------------------------------------------
WAGTAIL_SITE_NAME = "cms"

WAGTAILSEARCH_BACKENDS = {
    "default": {"BACKEND": "wagtail.search.backends.database"},
}

# Base URL for notifications / full URLs in admin (env-driven)
WAGTAILADMIN_BASE_URL = os.getenv("WAGTAILADMIN_BASE_URL", "http://127.0.0.1:8000")

# Allowed file extensions for Wagtail documents (keep/adjust as needed)
WAGTAILDOCS_EXTENSIONS = [
    "csv", "docx", "key", "odt", "pdf", "pptx", "rtf", "txt", "xlsx", "zip"
]

# -------------------------------------------------------------------
# Default auto field (explicit to avoid warnings in some setups)
# -------------------------------------------------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
