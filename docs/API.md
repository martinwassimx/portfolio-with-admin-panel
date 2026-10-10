# API Reference & Route Documentation

This document describes all verified API route handlers implemented in the application under `app/api/`.

---

## 1. Contact Form API

### `POST /api/contact`
Handles visitor contact messages with automated honeypot spam detection, in-memory IP rate limiting, and database persistence.

- **Authentication**: None (Public endpoint).
- **Rate Limit**: Maximum 5 requests per 10-minute window per client IP.
- **Request Headers**: `Content-Type: application/json`

#### Request Body
```json
{
  "name": "Alex Mercer",
  "email": "alex.mercer@example.com",
  "subject": "Inquiry regarding Senior Full-Stack role",
  "message": "Hi, I reviewed your portfolio and would like to discuss an opportunity.",
  "_hp": ""
}
```

| Field | Type | Validation | Description |
| :--- | :--- | :--- | :--- |
| `name` | string | Required, 2–100 chars | Sender's full name. |
| `email` | string | Required, valid email format | Sender's email address. |
| `subject` | string | Required, 2–150 chars | Message subject line. |
| `message` | string | Required, 5–5000 chars | Body of the message. |
| `_hp` | string | Optional | Honeypot field. Must remain empty. If filled, the request is silently ignored. |

#### Response (Success: 200 OK)
```json
{
  "success": true,
  "message": "Thank you for reaching out! Your message has been sent successfully."
}
```

#### Response (Validation Error: 400 Bad Request)
```json
{
  "error": "Please enter a valid email address"
}
```

#### Response (Rate Limited: 429 Too Many Requests)
```json
{
  "error": "Too many messages sent. Please wait a few minutes before trying again."
}
```

---

## 2. CV Ingestion & Parsing Engine

### `POST /api/cv/parse`
Parses a resume file (PDF) or raw resume text into structured portfolio entities (personal details, biography, technical skills, employment history, degrees, projects, and certifications).

- **Authentication**: Administrator session recommended.
- **Query Parameters**:
  - `ai=true` *(Optional)*: Automatically runs generative AI enhancement after parsing.
- **Request Headers**: `multipart/form-data` or `application/json`

#### Request Form-Data (File Upload)
| Key | Type | Description |
| :--- | :--- | :--- |
| `file` | File (Binary) | PDF document (parsed via `unpdf`) or plain text file. |
| `text` | string | *(Optional)* Override text string to parse directly. |

#### Request JSON (Direct Text)
```json
{
  "text": "JOHN DOE\nSenior Software Engineer\njohn@example.com | San Francisco, CA\n..."
}
```

#### Response (Success: 200 OK)
```json
{
  "success": true,
  "data": {
    "personal": {
      "fullName": "Ahmed Hossam Elhossary",
      "headline": "Software Engineering | Mobile & AI Developer",
      "email": "ahmedelhossery22@gmail.com",
      "phone": "01014060621",
      "location": "Cairo, Egypt",
      "githubUrl": "https://github.com/ahmedelhossary22",
      "linkedinUrl": "https://linkedin.com/in/ahmed-elhossary"
    },
    "summary": {
      "bioParagraphs": [
        "Software Engineering specialist with proven delivery in mobile and AI architectures..."
      ],
      "tags": ["#SoftwareEngineering", "#MobileDev", "#AI", "#ComputerVision"]
    },
    "skills": [
      {
        "name": "Python",
        "category": "Languages",
        "proficiency": 90,
        "badgeColor": "cyan"
      }
    ],
    "experience": [],
    "education": [],
    "projects": [],
    "certifications": [],
    "aiThemeRecommendation": {
      "themeId": "cyber_matrix",
      "name": "Cyber Matrix (Emerald Glow)",
      "fitScore": 95,
      "reason": "Dominant software engineering and mobile development stack aligns with high-contrast tech aesthetics."
    }
  },
  "cvFileUrl": "/uploads/1791590200000-Ahmed_CV.pdf"
}
```

---

### `POST /api/cv/ai-enhance`
Executes deep generative AI enrichment on parsed CV data, synthesizes narrative career stories, expands project architecture bullets, and computes aesthetic theme recommendations.

- **Authentication**: Administrator session recommended.
- **Request Headers**: `Content-Type: application/json`

#### Request Body
```json
{
  "baseData": { "...": "ParsedCVData object" },
  "rawText": "Raw resume text string",
  "options": {
    "tone": "senior_engineer",
    "provider": "builtin"
  }
}
```

#### Response (Success: 200 OK)
```json
{
  "success": true,
  "data": {
    "personal": { "...": "..." },
    "summary": { "...": "..." },
    "skills": [ "..." ],
    "projects": [ "..." ],
    "aiReadinessScore": 96,
    "aiHeadlineSuggestions": [
      "Senior Software Engineer • Mobile & AI Systems Architect",
      "Lead Mobile & Machine Learning Specialist"
    ]
  }
}
```

---

## 3. Data Store Synchronization API

### `GET /api/store?key=<key>`
Retrieves a specific data entity from the server store.

- **Query Parameters**: `key` (Required). E.g., `skills`, `projects`, `site_settings`, `theme_settings`.
- **Response**: `{ "success": true, "data": ... }`

---

### `POST /api/store`
Synchronizes single or batch data updates across both the local server store (`data/portfolio-store.json`) and remote Supabase tables using the administrative client (`adminSupabase`).

- **Request Headers**: `Content-Type: application/json`

#### Request Body (Batch Mode)
```json
{
  "mode": "replace",
  "batch": {
    "site_settings": {
      "site_title": "Ahmed Hossam Elhossary | Portfolio",
      "logo_text": "AH"
    },
    "page_sections": [
      {
        "section_key": "hero",
        "title": "Ahmed Hossam Elhossary",
        "subtitle": "Software Engineering | Mobile & AI Developer",
        "config": {
          "first_name": "Ahmed",
          "highlighted_name": "Hossam Elhossary"
        }
      }
    ],
    "skills": [
      {
        "id": "00000000-0000-4000-8000-000000000001",
        "category_id": "00000000-0000-0000-0000-000000000001",
        "name": "Python",
        "proficiency": 90,
        "badge_color": "cyan"
      }
    ]
  }
}
```

#### Response (Success: 200 OK)
```json
{
  "success": true
}
```

---

### `POST /api/store/reset`
Wipes dynamic user data across Supabase and local storage, resetting the portfolio to empty default placeholders.

- **Authentication**: Administrator session recommended.
- **Cleared Tables**: `skills`, `education`, `experience`, `certifications`, `projects`, `social_links`, `contact_messages`, `activity_logs`.
- **Reset Configs**: `site_settings` and `page_sections` are returned to clean default states.
- **Cache Invalidation**: Triggers `revalidatePath` on `/` and `/admin/*`.

#### Response (Success: 200 OK)
```json
{
  "success": true,
  "message": "Portfolio data cleared successfully."
}
```

---

## 4. Media & Asset Upload API

### `POST /api/upload`
Uploads an image, document, or CV file to local disk (`public/uploads/`) and Supabase Storage (if configured).

- **Request Headers**: `multipart/form-data`
- **File Size Limit**: 15 MB.

#### Form Data Parameters
| Key | Type | Description |
| :--- | :--- | :--- |
| `file` | File (Binary) | The asset to upload (PNG, JPEG, SVG, WebP, PDF). |
| `bucket` | string | Target Supabase storage bucket (`portfolio-media` or `portfolio-documents`). |

#### Response (Success: 200 OK)
```json
{
  "success": true,
  "asset": {
    "id": "3b2e7a10-8f92-41d3-982e-1289196c3802",
    "filename": "screenshot.png",
    "file_path": "1791590200000-screenshot.png",
    "public_url": "/uploads/1791590200000-screenshot.png",
    "mime_type": "image/png",
    "size_bytes": 245120,
    "bucket": "portfolio-media",
    "created_at": "2026-10-10T03:00:00.000Z"
  }
}
```
