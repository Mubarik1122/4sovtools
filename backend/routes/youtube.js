const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execFile } = require('child_process');
const { youtube } = require('../middleware/rateLimiter');

const router = express.Router();
router.use(youtube);

const YT = /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)[\w-]{6,}/;
const PRESETS = {
  'mp4-1080': ['-f', 'bestvideo[height<=1080]+bestaudio/best[height<=1080]', '--merge-output-format', 'mp4'],
  'mp4-720': ['-f', 'bestvideo[height<=720]+bestaudio/best[height<=720]', '--merge-output-format', 'mp4'],
  mp3: ['-x', '--audio-format', 'mp3', '--audio-quality', '320K'],
};
const ok = (u) => typeof u === 'string' && YT.test(u);

// POST /api/yt/info  { url }
router.post('/info', (req, res) => {
  if (!ok(req.body.url)) return res.status(400).json({ error: 'Enter a valid YouTube link' });
  // "--" stops a URL from being read as an option
  execFile('yt-dlp', ['-j', '--no-playlist', '--', req.body.url], { timeout: 60000, maxBuffer: 20 * 1024 * 1024 },
    (error, stdout) => {
      if (error) return res.status(500).json({ error: 'Failed to fetch video info' });
      const i = JSON.parse(stdout);
      res.json({ title: i.title, thumbnail: i.thumbnail, duration: i.duration, presets: Object.keys(PRESETS) });
    });
});

// POST /api/yt/download  { url, preset: "mp4-1080" | "mp4-720" | "mp3" }
router.post('/download', (req, res) => {
  const { url, preset } = req.body;
  if (!ok(url) || !PRESETS[preset]) return res.status(400).json({ error: 'Invalid request' });
  const id = crypto.randomUUID();
  const ext = preset === 'mp3' ? 'mp3' : 'mp4';
  const dir = path.join(os.tmpdir(), 'yt');
  const out = path.join(dir, `${id}.${ext}`);

  execFile('yt-dlp', ['--no-playlist', ...PRESETS[preset], '-o', path.join(dir, `${id}.%(ext)s`), '--', url],
    { timeout: 300000 }, (error) => {
      if (error) return res.status(500).json({ error: 'Download failed. YouTube may be blocking this server.' });
      res.download(out, `video.${ext}`, () => fs.unlink(out).catch(() => {}));
    });
});

module.exports = router;
