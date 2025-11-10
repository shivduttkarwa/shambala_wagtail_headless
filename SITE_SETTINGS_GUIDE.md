# Site Settings Guide - Header & Footer Management

## Overview
You can now manage your site's header navigation and footer content directly from the Wagtail admin panel. This allows you to update menus, links, contact information, and social media links without touching any code.

## Accessing Site Settings

1. Log into Wagtail Admin: `http://localhost:8000/admin/`
2. Look in the left sidebar for **Settings**
3. Click on **Site Settings**

## What You Can Configure

### 1. Header Settings
- **Logo Text**: Change "SHAMBALA HOMES" to anything you want
- **Menu Items**: Add/edit navigation menu items
  - Each item can have:
    - Label (displayed text)
    - Link (external URL or choose a page)
    - Sub-items (dropdown menu)

### 2. Footer Settings
- **Footer Sections**: Create multiple footer columns
  - **Link Columns**: Groups of links (e.g., "Quick Links", "Services")
  - **Text Content**: Rich text blocks
  - **Contact Info**: Display email, phone, address
- **Copyright Text**: Footer bottom copyright message

### 3. Contact Information
- Email address
- Phone number  
- Physical address

### 4. Social Media Links
- Facebook
- Twitter
- Instagram
- LinkedIn
- YouTube

## API Endpoint

The settings are available via API at:
```
GET http://localhost:8000/api/v2/site-settings/
```

### Response Format:
```json
{
  "header": {
    "logo_text": "SHAMBALA HOMES",
    "menu_items": [
      {
        "label": "Home",
        "aria_label": "Go to homepage",
        "link": "/",
        "subItems": []
      },
      {
        "label": "Services",
        "aria_label": "Our services",
        "link": "#",
        "subItems": [
          {"label": "Landscaping", "link": "/services/landscaping"},
          {"label": "Garden Design", "link": "/services/design"}
        ]
      }
    ]
  },
  "footer": {
    "sections": [
      {
        "type": "columns",
        "columns": [
          {
            "heading": "Quick Links",
            "links": [
              {"text": "About Us", "link": "/about"},
              {"text": "Contact", "link": "/contact"}
            ]
          }
        ]
      }
    ],
    "copyright": "<p>&copy; 2025 Shambala Homes. All rights reserved.</p>"
  },
  "contact": {
    "email": "info@shambalahomes.com",
    "phone": "+1 234 567 8900",
    "address": "123 Main St, City, State 12345"
  },
  "social": {
    "facebook": "https://facebook.com/shambalahomes",
    "instagram": "https://instagram.com/shambalahomes"
  }
}
```

## Frontend Integration

### Step 1: Create API Service Function

Add to `frontend/src/services/api.ts`:

```typescript
export interface SiteSettings {
  header: {
    logo_text: string;
    menu_items: Array<{
      label: string;
      aria_label: string;
      link: string;
      subItems?: Array<{
        label: string;
        link: string;
      }>;
    }>;
  };
  footer: {
    sections: Array<{
      type: 'columns' | 'text' | 'contact';
      columns?: Array<{
        heading: string;
        links: Array<{
          text: string;
          link: string;
        }>;
      }>;
      content?: string;
      contact?: {
        show_email: boolean;
        show_phone: boolean;
        show_address: boolean;
        email: string;
        phone: string;
        address: string;
      };
    }>;
    copyright: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    [key: string]: string;
  };
}

export const fetchSiteSettings = async (): Promise<SiteSettings> => {
  const response = await fetch(`${API_BASE}/site-settings/`);
  if (!response.ok) {
    throw new Error('Failed to fetch site settings');
  }
  return response.json();
};
```

### Step 2: Create a Hook

Create `frontend/src/hooks/useSiteSettings.ts`:

```typescript
import { useState, useEffect } from 'react';
import { fetchSiteSettings, SiteSettings } from '../services/api';

export const useSiteSettings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await fetchSiteSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load site settings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  return { loading, error, settings };
};
```

### Step 3: Update Header Component

Update `frontend/src/components/Layout/Header.tsx` to use the settings:

```typescript
import { useSiteSettings } from '../../hooks/useSiteSettings';

const Header = () => {
  const { loading, settings } = useSiteSettings();

  if (loading || !settings) {
    return <header>Loading...</header>;
  }

  return (
    <StaggeredMenu
      items={settings.header.menu_items}
      // ... other props
    />
  );
};
```

### Step 4: Update Footer Component

Update `frontend/src/components/Layout/Footer.tsx` to use the settings:

```typescript
import { useSiteSettings } from '../../hooks/useSiteSettings';

const Footer = () => {
  const { loading, settings } = useSiteSettings();

  if (loading || !settings) {
    return <footer>Loading...</footer>;
  }

  return (
    <footer className="footer">
      {settings.footer.sections.map((section, idx) => {
        if (section.type === 'columns') {
          return (
            <div key={idx} className="footer-columns">
              {section.columns?.map((column, colIdx) => (
                <div key={colIdx} className="footer-column">
                  <h3>{column.heading}</h3>
                  <ul>
                    {column.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <a href={link.link}>{link.text}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );
        }
        // Handle other section types...
        return null;
      })}
      
      <div className="footer-copyright" 
           dangerouslySetInnerHTML={{ __html: settings.footer.copyright }} />
      
      <div className="footer-social">
        {Object.entries(settings.social).map(([platform, url]) => (
          <a key={platform} href={url} target="_blank" rel="noopener noreferrer">
            {platform}
          </a>
        ))}
      </div>
    </footer>
  );
};
```

## Benefits

✅ **No Code Changes Needed**: Update header/footer from admin panel
✅ **Dynamic Content**: Changes reflect immediately via API
✅ **Centralized Management**: All site-wide content in one place
✅ **Loading Control**: Footer loads with header/body data, preventing flicker
✅ **Flexible Structure**: Add/remove menu items and footer sections easily

## Testing

1. Start Django server: `cd backend/cms && python manage.py runserver`
2. Access admin: `http://localhost:8000/admin/`
3. Go to Settings → Site Settings
4. Add some menu items and footer content
5. Visit `http://localhost:8000/api/v2/site-settings/` to see the JSON
6. Integrate into your React frontend as shown above

## Next Steps

1. Implement the frontend hooks and update Header/Footer components
2. Add loading states and error handling
3. Style the dynamic content to match your design
4. Test thoroughly before deploying

