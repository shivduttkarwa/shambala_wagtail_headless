# Wagtail Admin Guide - Adding House Designs

## 🚀 Quick Start Guide

### 1. Access Wagtail Admin
- Go to: `http://127.0.0.1:8000/admin/`
- Login with your superuser credentials

---

## 📝 Adding House Categories

**Categories** are like tags for your house designs (e.g., "Freedom", "Designer", "HomeSolution")

### Steps:
1. In the admin sidebar, click **Snippets** → **House Categories**
2. Click **Add House Category**
3. Fill in:
   - **Name**: e.g., "Freedom" or "Designer Collection"
   - **Slug**: Auto-generated (e.g., "freedom")
   - **Description**: Optional description
   - **Order**: Number for sorting (0 = first)
4. Click **Save**

### Suggested Categories:
- Freedom
- HomeSolution  
- Designer
- Signature
- DualOcc
- TownLiving

---

## 🏠 Adding House Designs

### Steps:
1. In the admin sidebar, click **Snippets** → **House Designs**
2. Click **Add House Design**
3. Fill in the **Basic Information**:
   - **Name**: e.g., "Ainstie" or "Aira"
   - **Slug**: Auto-generated from name
   - **Description**: Brief description with rich text
   - **Featured Image**: Click "Choose an image" → Upload or select existing

4. Fill in **Specifications**:
   - **Storeys**: Single/Double/Three Storey
   - **Bedrooms**: Number (1-10)
   - **Bathrooms**: e.g., 2.5
   - **Garage spaces**: Number of car spaces
   - **Min block width**: e.g., 12.5 (meters)
   - **Max block width**: Optional

5. Fill in **Pricing**:
   - **Base price**: e.g., 450000.00 (leave empty for "Contact for pricing")
   - **Price note**: e.g., "Plus site costs"

6. Fill in **Classification**:
   - **Category**: Select from dropdown (Freedom, Designer, etc.)
   - **Build location**: Select location (Melbourne, Sydney, etc.)
   - **Tags**: Add custom tags like "Modern", "Coastal", etc.

7. **Display Features**:
   - ✅ **Is on display**: Check if currently on display
   - ✅ **Has virtual tour**: Check if virtual tour available
   - **Virtual tour URL**: Add URL if available

8. **Publication**:
   - ✅ **Is published**: Check to make it visible on website

9. Click **Save**

---

## 📍 Adding Build Locations

### Steps:
1. Click **Snippets** → **Build Locations**
2. Click **Add Build Location**
3. Fill in:
   - **Name**: e.g., "Melbourne"
   - **Slug**: Auto-generated
   - ✅ **Is active**: Check to show in filters
4. Click **Save**

### Suggested Locations:
- Melbourne
- Sydney
- Brisbane
- Perth
- Adelaide

---

## 📄 Managing the House Designs Page

### Steps:
1. In sidebar, click **Pages**
2. You'll see your page tree:
   ```
   Home (root)
   └── House Design
   ```
3. Click on **House Design** → **Edit**

### Hero Section Customization

The hero section can be fully customized:

**Hero Section Content:**
- **Hero Title**: Main headline (e.g., "Discover Your Dream Home")
- **Hero Subtitle**: Supporting text or description (plain text or HTML)

**Hero Section Design:**
- **Hero Background Image**: Upload a high-quality image
  - Recommended size: 1920x800px or larger
  - Use landscape-oriented images
  - Choose images with good visual interest
- **Hero Overlay Opacity**: Adjust the dark overlay (slider 0.0 - 1.0)
  - 0.0 = transparent (no overlay)
  - 0.7-0.8 = recommended for readability
  - 1.0 = fully dark
  - Higher values make text more readable on busy images

**Design Tips:**
- If no background image is uploaded, the hero uses your brand's cream background
- Background images create a more dramatic, engaging hero section
- The overlay ensures text remains readable over any image
- Test different opacity values to find the perfect balance

### Page Settings

4. You can also modify:
   - **Intro title**: Fallback heading if hero title not set
   - **Intro text**: Fallback subtitle if hero subtitle not set
   - **Designs per page**: How many to show (default: 12)
5. Click **Save draft** or **Publish**

---

## 🎨 Tips for Best Results

### Images:
- **Recommended size**: 1200x800px or larger
- **Format**: JPG or PNG
- **Quality**: High quality, well-lit photos
- **Alt text**: Wagtail uses image title as alt text

### Descriptions:
- Keep them concise (1-2 paragraphs)
- Highlight key features
- Use formatting (bold for highlights)

### Pricing:
- Enter as numbers only (no commas): `450000.00`
- System will format as: "$450,000"
- Leave empty for "Contact for pricing"

### Categories:
- Create 3-5 main categories
- Keep names short and clear
- Use Order field to control display sequence

---

## 🔄 Quick Actions

### Bulk Operations:
- In House Designs list, use checkboxes to select multiple
- Use "Actions" dropdown for bulk delete/publish

### Searching:
- Use search box in admin to find designs by name
- Use filters (category, storeys, etc.) to narrow down

### Duplicating:
- Edit a house design → Click "Copy" to duplicate
- Useful for similar designs

---

## ✅ Checklist for a New House Design

- [ ] Upload high-quality featured image
- [ ] Fill in all specifications (beds, baths, storeys)
- [ ] Set category
- [ ] Add pricing or leave empty
- [ ] Add at least 2-3 tags
- [ ] Set "On Display" if applicable
- [ ] Check "Is published"
- [ ] Save

---

## 🆘 Need Help?

If something's not working:
1. Check if "Is published" is checked
2. Check if Django server is running
3. Check browser console for errors
4. Clear browser cache and refresh

---

## 📱 Preview on Frontend

After adding designs:
1. Frontend: `http://localhost:5173/shambala_homes/house-designs`
2. Click menu → "HOUSE DESIGNS"
3. Should see your designs with filters working!
