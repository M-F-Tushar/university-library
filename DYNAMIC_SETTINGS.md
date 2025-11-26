# Dynamic Website Settings

This document lists all the dynamic settings that can be controlled through the Admin Settings panel.

## How to Edit Settings

1. Log in as admin at `/admin/login`
2. Navigate to **Dashboard** → **Site Settings** (`/admin/settings`)
3. Edit any setting and click **Save Changes**
4. Refresh the website to see your changes

---

## Available Settings

### 🌐 General Settings

| Setting Key | Description | Default Value | Where It Appears |
|------------|-------------|---------------|------------------|
| `site_name` | Site name | CSE Library | Navbar, Footer |
| `site_description` | Site description | Your dedicated digital library... | Footer, Meta tags |
| `site_title` | Browser tab title | CSE Student Library | Browser tab |
| `site_meta_description` | SEO meta description | Resources, code snippets... | Search engines |

### 📧 Contact Settings

| Setting Key | Description | Default Value | Where It Appears |
|------------|-------------|---------------|------------------|
| `contact_address` | Physical address | University Campus | Footer |
| `contact_email` | Contact email | library@university.edu | Footer |

### 🦶 Footer Settings

| Setting Key | Description | Default Value | Where It Appears |
|------------|-------------|---------------|------------------|
| `footer_copyright` | Copyright text | University Library | Footer (year auto-added) |

### 🎯 Hero Section

| Setting Key | Description | Default Value | Where It Appears |
|------------|-------------|---------------|------------------|
| `hero_title_line1` | Hero title first line | CS Student | Homepage hero |
| `hero_title_line2` | Hero title second line | Digital Library | Homepage hero |
| `hero_subtitle` | Hero subtitle | Master algorithms... | Homepage hero |
| `hero_badge_text` | Hero badge text | For CS Students By CS Students | Homepage hero |
| `hero_cta1_text` | Primary button text | Browse Resources | Homepage hero |
| `hero_cta1_link` | Primary button link | /resources | Homepage hero |
| `hero_cta2_text` | Secondary button text | Get Started | Homepage hero |
| `hero_cta2_link` | Secondary button link | /register | Homepage hero |

### 📊 Statistics Section

| Setting Key | Description | Default Value | Where It Appears |
|------------|-------------|---------------|------------------|
| `stat_resources_label` | Resources label | Resources | Homepage stats |
| `stat_students_label` | Students label | Developers | Homepage stats |
| `stat_access_number` | Access hours | 24/7 | Homepage stats |
| `stat_access_label` | Access label | Access | Homepage stats |

**Note:** Resource count and user count are **automatically calculated** from the database.

### ✨ Features Section

| Setting Key | Description | Default Value | Where It Appears |
|------------|-------------|---------------|------------------|
| `features_title` | Features section title | Level Up Your Coding Skills | Homepage features |
| `features_subtitle` | Features section subtitle | Resources tailored for... | Homepage features |

---

## Dynamic vs Static Content

### ✅ Fully Dynamic (Editable via Admin)
- Site name, description, and metadata
- Contact information
- Hero section content
- Statistics labels
- Features section titles
- Footer copyright text

### 🔢 Auto-Calculated
- Resource count (from database)
- User count (from database)

### 🎨 Managed Separately
- **Features cards**: Managed via `/admin/features`
- **Announcements**: Managed via `/admin/announcements`
- **Resources**: Managed via resource upload

---

## No Hardcoded Values!

All text content on the website is now controlled through the database. You can customize:
- ✅ Site branding
- ✅ Contact information
- ✅ Hero section messaging
- ✅ Statistics labels
- ✅ SEO metadata
- ✅ Footer content

Everything is editable through the admin panel - no code changes required!
