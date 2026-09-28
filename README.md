# 4sov AI Tools Hub

Free online tools at tools.4sov.com: image resizer, background remover, Word ⇄ PDF, YouTube downloader.

- `backend/`: Node.js/Express API for Render (Docker). See `.env.example`.
- `frontend/preview.html`: clickable design preview (open in a browser). The WordPress plugin (`4sov-ai-tools`) comes next.

## Backend status
| Endpoint | Status |
|---|---|
| `GET /health` | tested |
| `POST /api/image/compress` | tested |
| `POST /api/image/remove-bg` | tested (rembg) |
| `POST /api/pdf/convert` | written, not yet tested |
| `POST /api/yt/info`, `/download` | written, not yet tested (cloud IPs are often blocked by YouTube) |

## Run locally
```bash
cd backend && npm install && npm start
```
Background removal and PDF → Word need Python packages: `pip install rembg onnxruntime pillow pdf2docx`.
Word → PDF needs LibreOffice; YouTube needs `yt-dlp` and `ffmpeg`. The Dockerfile installs all of these.

## Deploy
Render → New Web Service → Docker, root directory `backend`. Set `ALLOWED_ORIGINS`. Use `REMBG_MODEL=u2netp` on the free tier if memory runs out.
