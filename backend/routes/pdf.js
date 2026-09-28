const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const { execFile } = require('child_process');
const libre = require('libreoffice-convert');
const { makeUpload } = require('../middleware/upload');

libre.convertAsync = require('util').promisify(libre.convert);
const router = express.Router();
const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const upload = makeUpload([DOCX, 'application/pdf'], 25);
const rm = (...f) => Promise.all(f.map((x) => fs.unlink(x).catch(() => {})));

// POST /api/pdf/convert  (field: document, body: targetFormat ".pdf" | ".docx")
router.post('/convert', upload.single('document'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Document required' });
  const target = req.body.targetFormat === '.docx' ? '.docx' : '.pdf';
  const output = path.join(os.tmpdir(), `${req.file.filename}-out.docx`);
  try {
    if (target === '.pdf') {
      // LibreOffice handles Word -> PDF well
      const out = await libre.convertAsync(await fs.readFile(req.file.path), '.pdf', undefined);
      return res.set('Content-Type', 'application/pdf').send(out);
    }
    // PDF -> Word: LibreOffice can't do this reliably, so use pdf2docx
    await new Promise((ok, fail) =>
      execFile('python3', [path.join(__dirname, '../scripts/pdf_to_docx.py'), req.file.path, output],
        { timeout: 120000 }, (e) => (e ? fail(e) : ok())));
    res.set('Content-Type', DOCX).send(await fs.readFile(output));
  } catch (err) {
    res.status(500).json({ error: 'Conversion failed' });
  } finally {
    rm(req.file.path, output);
  }
});

module.exports = router;
