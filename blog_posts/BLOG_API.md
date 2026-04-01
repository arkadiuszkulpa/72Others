# Blog Post API — Agent Reference

This document contains everything needed to create and manage blog posts on arkadiuszkulpa.co.uk via the REST API. It is designed to be used by an AI agent (Claude) from any repository.

## Authentication

All write operations require a bearer token in the `Authorization` header:

```
Authorization: Bearer <API_BEARER_TOKEN>
```

Read operations are public (no auth required).

### Getting the Token

Credentials are stored in **AWS Secrets Manager** — never in code, env files, or conversation. The upload script fetches them automatically:

```bash
# The upload script handles auth for you (see "Upload Script" section below)
./scripts/upload-post.sh --env dev post.md
```

If you need the token manually (e.g. for curl):

```bash
aws secretsmanager get-secret-value \
  --secret-id personalsite/dev/blog-api \
  --region eu-west-2 \
  --query 'SecretString' --output text | python -c "import sys,json; print(json.load(sys.stdin)['API_BEARER_TOKEN'])"
```

Replace `dev` with `main` for production.

### How It Works Internally

The REST API is a thin layer over AppSync GraphQL. Credentials are stored in AWS Secrets Manager and fetched **at build time** by `amplify.yml`, which injects them into `.env.production`. The server reads them from `process.env`. **A redeployment is required after credential changes** (Amplify SSR compute cannot access Secrets Manager at runtime).

1. Caller sends `Authorization: Bearer <API_BEARER_TOKEN>`
2. Server validates the bearer token against `process.env.API_BEARER_TOKEN`
3. Server uses `process.env.CLAUDE_SERVICE_USERNAME` + `CLAUDE_SERVICE_PASSWORD` to obtain a Cognito JWT
4. Server calls AppSync with the Cognito JWT to perform the write operation

**Secret format** (`personalsite/{branch}/blog-api`):
```json
{
  "CLAUDE_SERVICE_USERNAME": "admin@myai4.co.uk",
  "CLAUDE_SERVICE_PASSWORD": "...",
  "API_BEARER_TOKEN": "..."
}
```

**Setup per branch:** Each Amplify branch has its own Cognito User Pool. The service account user must exist in each pool with `USER_PASSWORD_AUTH` enabled. The secret name is derived from `AWS_BRANCH` (set automatically by Amplify at build time) — e.g. branch `dev` reads `personalsite/dev/blog-api`, branch `main` reads `personalsite/main/blog-api`.

## Base URL

- **Production:** `https://www.arkadiuszkulpa.co.uk` (use `www` — the apex domain redirects and strips `Authorization` headers)
- **Development (Amplify):** `https://dev.dn2pj1jrgqhxh.amplifyapp.com`
- **Development (local):** `http://localhost:3000`

---

## Endpoints

### List Posts

```
GET /api/posts/
```

Returns all posts (published and drafts), sorted by date descending.

**Response:**
```json
{
  "posts": [
    {
      "id": "uuid",
      "slug": "my-post-slug",
      "title": "Post Title",
      "date": "2026-02-21",
      "status": "published",
      "tags": ["aws", "nextjs"],
      "excerpt": "Short summary...",
      "readingTime": "5 min read"
    }
  ]
}
```

### Get a Post

```
GET /api/posts/{slug}/
```

Returns a single post with its full markdown content.

**Response:**
```json
{
  "post": {
    "id": "uuid",
    "slug": "my-post-slug",
    "title": "Post Title",
    "date": "2026-02-21",
    "status": "draft",
    "tags": ["aws"],
    "excerpt": "Short summary...",
    "description": "SEO description",
    "readingTime": "5 min read",
    "content": "# Heading\n\nMarkdown content..."
  }
}
```

### Create a Post

```
POST /api/posts/
Authorization: Bearer <token>
Content-Type: application/json
```

**Request body:**
```json
{
  "title": "My New Post",
  "slug": "my-new-post",
  "date": "2026-02-21",
  "tags": ["aws", "lambda"],
  "status": "draft",
  "excerpt": "A short summary for the post listing.",
  "description": "SEO meta description for search engines and link previews.",
  "content": "# My New Post\n\nMarkdown content here..."
}
```

| Field | Required | Default | Notes |
|-------|----------|---------|-------|
| `title` | Yes | — | Post title |
| `slug` | Yes | — | URL-friendly identifier (lowercase, hyphens only) |
| `date` | No | Today (`YYYY-MM-DD`) | Publication date |
| `tags` | No | `[]` | Array of lowercase tag strings |
| `status` | No | `"draft"` | `"draft"` or `"published"` |
| `excerpt` | No | — | Short summary for post listings (~200 chars) |
| `description` | No | — | SEO meta description |
| `content` | No | — | Full markdown body |

`readingTime` is auto-calculated from content (200 words/minute).

**Tip:** For posts with content, avoid inline JSON in curl — newlines, quotes, and special characters cause escaping issues. Use a JSON file instead:

```bash
# Write body to a file
cat <<'PAYLOAD' > /tmp/post.json
{
  "title": "My Post",
  "slug": "my-post",
  "content": "# Heading\n\nParagraph with \"quotes\" and <blogimage> tags..."
}
PAYLOAD

# Send from file
curl -sL -X POST "$BASE/api/posts/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/post.json
```

**Response:**
```json
{
  "success": true,
  "post": {
    "id": "generated-uuid",
    "slug": "my-new-post",
    "title": "My New Post",
    "date": "2026-02-21",
    "status": "draft",
    "tags": ["aws", "lambda"],
    "excerpt": "A short summary...",
    "readingTime": "3 min read"
  }
}
```

### Update a Post

```
PUT /api/posts/{slug}/
Authorization: Bearer <token>
Content-Type: application/json
```

Partial update — only include fields you want to change.

**Request body (example — publish a draft):**
```json
{
  "status": "published"
}
```

**Request body (example — update content and excerpt):**
```json
{
  "content": "# Updated Content\n\nNew markdown...",
  "excerpt": "Updated summary"
}
```

**Response:**
```json
{
  "success": true,
  "post": { "id": "...", "slug": "...", "title": "...", "status": "published", ... }
}
```

### Delete a Post

```
DELETE /api/posts/{slug}/
Authorization: Bearer <token>
```

Deletes the post from the database and removes its content and media from S3.

**Response:**
```json
{
  "success": true
}
```

### Upload Media (Get Presigned URL)

```
POST /api/media/
Authorization: Bearer <token>
Content-Type: application/json
```

Returns a presigned S3 upload URL. Upload the file directly to S3 using the returned URL.

**Request body:**
```json
{
  "slug": "my-post-slug",
  "filename": "diagram.png",
  "contentType": "image/png",
  "mediaType": "image"
}
```

| Field | Required | Default | Notes |
|-------|----------|---------|-------|
| `slug` | Yes | — | Post slug the media belongs to |
| `filename` | Yes | — | Original filename |
| `contentType` | Yes | — | MIME type (`image/png`, `image/jpeg`, `image/svg+xml`, `application/pdf`) |
| `mediaType` | No | auto-detected | `"image"` or `"pdf"` — auto-detected from contentType if omitted |

**Response:**
```json
{
  "uploadUrl": "https://s3.eu-west-2.amazonaws.com/...",
  "s3Key": "media/images/my-post-slug/diagram.png"
}
```

**Step 2 — Upload the file to S3:**
```bash
curl -X PUT "<uploadUrl>" \
  -H "Content-Type: image/png" \
  --data-binary @diagram.png
```

**Step 3 — Reference it in post content:**
```html
<blogimage src="media/images/my-post-slug/diagram.png" alt="Diagram" caption="Optional caption" width="700" height="400" />
```

The presigned URL expires after 1 hour. Upload promptly after receiving it.

**Full media upload example:**

```bash
TOKEN="<bearer-token>"
BASE="https://www.arkadiuszkulpa.co.uk"
SLUG="my-post-slug"

# Step 1: Get presigned upload URL
RESPONSE=$(curl -sL -X POST "$BASE/api/media/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"slug\": \"$SLUG\", \"filename\": \"diagram.png\", \"contentType\": \"image/png\"}")

UPLOAD_URL=$(echo "$RESPONSE" | jq -r '.uploadUrl')
S3_KEY=$(echo "$RESPONSE" | jq -r '.s3Key')

# Step 2: Upload the file directly to S3
curl -sL -X PUT "$UPLOAD_URL" \
  -H "Content-Type: image/png" \
  --data-binary @diagram.png

# Step 3: Use the s3Key in post content
# <blogimage src="$S3_KEY" alt="Diagram" caption="" width="700" height="400" />
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message here"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad request (missing required fields, GraphQL error) |
| 401 | Unauthorized (missing or invalid bearer token) |
| 404 | Post not found |
| 500 | Server error |

---

## Markdown Content Format

Posts use standard Markdown with GitHub Flavored Markdown extensions (tables, strikethrough, task lists). Raw HTML is also supported.

### Structure

A well-structured post follows this pattern:

```markdown
# Post Title

Introduction paragraph that hooks the reader and explains what the post covers.

## Section Heading

Body content with explanations, code examples, and insights.

### Sub-section

More detailed content.

## Conclusion

Wrap-up and key takeaways.
```

### Supported Features

- **Headings:** `#` through `######`
- **Emphasis:** `**bold**`, `*italic*`, `~~strikethrough~~`
- **Lists:** Ordered, unordered, and task lists (`- [ ]`)
- **Code:** Inline \`code\` and fenced code blocks with syntax highlighting
- **Tables:** GFM pipe tables
- **Blockquotes:** `>`
- **Links:** `[text](url)`
- **Raw HTML:** Supported via `rehype-raw`

### Code Blocks

Use fenced code blocks with language identifiers for syntax highlighting:

````markdown
```python
def hello():
    print("Hello, world!")
```

```typescript
const greet = (name: string): string => `Hello, ${name}!`;
```

```bash
aws s3 ls s3://my-bucket/
```
````

### Custom Components

The blog supports two custom HTML components that can be used inline in markdown:

#### Images — `<blogimage>`

```html
<blogimage
  src="media/images/{slug}/filename.png"
  alt="Descriptive alt text"
  caption="Optional caption displayed below the image"
  width="900"
  height="500"
/>
```

- `src`: S3 key from the media upload endpoint (e.g. `media/images/{slug}/file.png`). Legacy paths (`/images/posts/...`) are also supported.
- `alt`: Required accessibility text
- `width` / `height`: Required pixel dimensions for optimization
- `caption`: Optional caption text
- Renders as a responsive, clickable image with modal zoom

#### PDFs — `<BlogPDF>`

```html
<BlogPDF
  src="media/pdfs/{slug}/document.pdf"
  title="Document Title"
  caption="Optional description"
  width="900"
  height="700"
  downloadText="Download Report (PDF)"
/>
```

- Renders as an embedded PDF viewer with "Open in New Window" button
- `downloadText`: Optional — if provided, shows a download button

Media files are uploaded via the `POST /api/media/` endpoint (see above). The presigned URL allows direct S3 upload from any client.

---

## Conventions

### Slugs
- Lowercase, hyphen-separated: `my-great-post`
- No underscores, spaces, or uppercase
- Descriptive and SEO-friendly
- Must be unique across all posts

### Dates
- Format: `YYYY-MM-DD` (e.g., `2026-02-21`)

### Tags
- Lowercase strings: `["aws", "nextjs", "architecture"]`
- Use hyphens for multi-word tags: `"machine-learning"`
- Keep them relevant and consistent with existing tags

### Excerpts
- ~200 characters or fewer
- One or two sentences summarizing the post
- Used on the homepage post listing

### Descriptions
- SEO meta description for search engines and social link previews
- Slightly longer than excerpt if needed
- Should contain relevant keywords naturally

---

## Writing Style Guidelines

This is a technical blog for a software/data engineer. Posts should:

- Be written in first person where appropriate ("I built...", "We implemented...")
- Focus on practical implementation details, architecture decisions, and lessons learned
- Include code examples where relevant
- Explain the "why" behind technical choices, not just the "what"
- Use section headings to break up long content
- Start with a compelling introduction that states what was built and why
- End with a conclusion or key takeaways section

---

## Upload Script

The easiest way to upload posts is with `scripts/upload-post.sh`. It fetches the bearer token from Secrets Manager automatically — no credentials in your shell, no manual curl.

```bash
# Upload a single post to dev
./scripts/upload-post.sh --env dev blog_posts/01-building-the-foundation.md

# Upload a single post to production
./scripts/upload-post.sh --env main blog_posts/01-building-the-foundation.md

# Upload all numbered .md files in a directory
./scripts/upload-post.sh --env dev --all blog_posts/
```

**Requirements:** `aws` CLI (authenticated via SSO or credentials), `python`, `curl`

The script parses YAML frontmatter from the markdown file, builds the JSON payload, and POSTs to the API. Posts are created as `draft` by default. Review and publish from the admin UI at `/admin`.

---

## Workflow for Creating a Draft Post

When the user asks you to write a blog post based on conversation history or a topic:

1. **Draft the content** in markdown with YAML frontmatter (title, slug, date, tags, status, excerpt, description)
2. **Follow conventions** — lowercase hyphenated slugs, ~200 char excerpts, existing tags where possible
3. **Upload any media** (if applicable) using `POST /api/media/` to get presigned URLs, then PUT files to S3
4. **Upload the post** using the upload script: `./scripts/upload-post.sh --env dev post.md`
5. The user reviews in the admin UI at `/admin` and publishes when ready

---

## One-Time Setup

### Creating Secrets Manager Entries

Each Amplify branch needs a secret at `personalsite/{branch}/blog-api`:

```bash
aws secretsmanager create-secret \
  --name personalsite/dev/blog-api \
  --description "Blog API credentials for PersonalSite dev branch" \
  --secret-string '{"CLAUDE_SERVICE_USERNAME":"admin@myai4.co.uk","CLAUDE_SERVICE_PASSWORD":"...","API_BEARER_TOKEN":"..."}' \
  --region eu-west-2
```

To update an existing secret:

```bash
aws secretsmanager put-secret-value \
  --secret-id personalsite/dev/blog-api \
  --secret-string '{"CLAUDE_SERVICE_USERNAME":"admin@myai4.co.uk","CLAUDE_SERVICE_PASSWORD":"...","API_BEARER_TOKEN":"..."}' \
  --region eu-west-2
```

### Cognito Service Account

Each branch has its own Cognito User Pool. The service account must exist in each:

```bash
aws cognito-idp admin-create-user \
  --user-pool-id <POOL_ID> \
  --username admin@myai4.co.uk \
  --user-attributes Name=email,Value=admin@myai4.co.uk Name=email_verified,Value=true \
  --message-action SUPPRESS --region eu-west-2

aws cognito-idp admin-set-user-password \
  --user-pool-id <POOL_ID> \
  --username admin@myai4.co.uk \
  --password "<password>" \
  --permanent --region eu-west-2
```

The User Pool Client must have `USER_PASSWORD_AUTH` enabled:

```bash
aws cognito-idp update-user-pool-client \
  --user-pool-id <POOL_ID> \
  --client-id <CLIENT_ID> \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_USER_SRP_AUTH ALLOW_REFRESH_TOKEN_AUTH ALLOW_CUSTOM_AUTH \
  --region eu-west-2
```

### Local Development

No Secrets Manager setup needed locally. Set credentials directly in `.env.local`:

```
CLAUDE_SERVICE_USERNAME=admin@myai4.co.uk
CLAUDE_SERVICE_PASSWORD=...
API_BEARER_TOKEN=...
```

The server always reads from `process.env`. Locally these come from `.env.local`; in Amplify they come from Secrets Manager via `amplify.yml` build injection.
