# 4sov AI Tools (WordPress plugin)

Adds five shortcodes that call the 4sov backend (see `backend/` in the repo).

| Shortcode | Suggested page slug |
|---|---|
| `[ai_tools_grid]` | `/` (homepage) |
| `[ai_tool_image]` | `/image-resizer` |
| `[ai_tool_bg_remove]` | `/background-remover` |
| `[ai_tool_pdf mode="word-to-pdf"]` | `/word-to-pdf` |
| `[ai_tool_pdf mode="pdf-to-word"]` | `/pdf-to-word` |
| `[ai_tool_youtube]` | `/youtube-downloader` |

## Install
1. Zip the `4sov-ai-tools` folder (or use the provided zip) → WordPress admin → Plugins → Add New → Upload Plugin → Activate.
2. Settings → 4sov AI Tools → paste your Render URL (no trailing slash). Or add `define( 'FSOV_BACKEND_URL', 'https://…onrender.com' );` to `wp-config.php`.
3. Create one page per tool with the slugs above and put the shortcode in each. Add the menu links under Appearance → Menus.
4. Use a light theme (GeneratePress or Astra) and set the page layout to full width with no sidebar. The plugin styles the page background dark on tool pages only.

## Options
`show_title="no"` hides the built-in `<h1>` if your theme already prints the page title.

## Notes
- Scripts and styles load only on pages that contain one of the shortcodes. PDF pages also load mammoth.js and pdf.js from cdnjs for the previews.
- Title, meta description and JSON-LD are added automatically. If Rank Math or Yoast is active, they keep control of title and description and the plugin only adds the schema.
- Pre-warming: the backend `/health` endpoint is pinged when the visitor picks or drops a file, or focuses the YouTube box. The awake flag expires after 10 minutes because Render sleeps after 15.
