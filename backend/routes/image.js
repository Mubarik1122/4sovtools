const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const { execFile } = require('child_process');
const sharp = require('sharp');
const { imageUpload } = require('../middleware/upload');

const router = express.Router();
const FORMATS = { webp: 'image/webp', jpeg: 'image/jpeg', png: 'image/png' };
const rm = (...files) => Promise.all(files.map((f) => f && fs.unlink(f).catch(() => {})));

// POST /api/image/compress  (field: image, body: quality, format, width, height)
router.post('/compress', imageUpload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Image required' });
  try {
    const quality = Math.min(100, Math.max(10, parseInt(req.body.quality, 10) || 80));
    const format = FORMATS[req.body.format] ? req.body.format : 'webp';
    const width = parseInt(req.body.width, 10) || undefined;
    const height = parseInt(req.body.height, 10) || undefined;

    const out = await sharp(req.file.path)
      .rotate()
      .resize({ width, height, fit: 'inside', withoutEnlargement: true })
      .toFormat(format, { quality })
      .toBuffer();

    res.set('Content-Type', FORMATS[format]).send(out);
  } catch (err) {
    res.status(500).json({ error: 'Compression failed' });
  } finally {
    rm(req.file.path);
  }
});

// POST /api/image/remove-bg  (field: image) -> transparent PNG
router.post('/remove-bg', imageUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Image required' });
  const input = req.file.path;
  const output = path.join(os.tmpdir(), `${req.file.filename}-nobg.png`);

  execFile('python3', [path.join(__dirname, '../scripts/remove_bg.py'), input, output],
    { timeout: 120000 },
    async (error) => {
      try {
        if (error) return res.status(500).json({ error: 'Background removal failed' });
        res.set('Content-Type', 'image/png').send(await fs.readFile(output));
      } catch (e) {
        res.status(500).json({ error: 'Background removal failed' });
      } finally {
        rm(input, output);
      }
    });
});

module.exports = router;
