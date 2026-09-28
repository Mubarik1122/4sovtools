(function () {
	'use strict';
	var h = FSOV.h, root = document.querySelector('[data-fsov-tool="image"]');
	if (!root) { return; }
	var r = function (n) { return h.role(root, n); };
	var file = null, go = r('go'), result = r('result'), MAX = 20 * 1024 * 1024;
	var EXT = { webp: 'webp', jpeg: 'jpg', png: 'png' };

	r('quality').addEventListener('input', function (e) { r('qv').textContent = e.target.value; });

	h.bindDropzone(root, function (f) {
		result.textContent = '';
		if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { result.appendChild(h.el('p', 'fsov-error', 'Choose a JPG, PNG or WebP image.')); return; }
		if (f.size > MAX) { result.appendChild(h.el('p', 'fsov-error', 'That file is over 20 MB. Choose a smaller image.')); return; }
		file = f;
		var c = h.card(f.name + ' · ' + h.fmt(f.size), 'Uploaded');
		c.body.appendChild(h.imgBox(URL.createObjectURL(f), 'Uploaded image preview'));
		r('preview').textContent = ''; r('preview').appendChild(c.wrap);
	});

	go.addEventListener('click', function () {
		result.textContent = '';
		if (!file) { result.appendChild(h.el('p', 'fsov-note', 'Choose an image first.')); return; }
		var label = go.textContent, fmtKey = r('format').value;
		var fd = new FormData();
		fd.append('image', file);
		fd.append('quality', r('quality').value);
		fd.append('format', fmtKey);
		if (r('width').value) { fd.append('width', r('width').value); }
		if (r('height').value) { fd.append('height', r('height').value); }

		go.disabled = true;
		h.ensureAwake(go).then(function () {
			go.textContent = 'Processing…';
			return h.postBlob('/api/image/compress', fd, { onProgress: h.progress(r('bar')) });
		}).then(function (blob) {
			var url = URL.createObjectURL(blob), saved = Math.round((1 - blob.size / file.size) * 100);
			result.appendChild(h.beforeAfter(h.imgBox(URL.createObjectURL(file), 'Original image'), h.imgBox(url, 'Compressed image')));
			result.appendChild(h.el('p', 'fsov-stat', saved > 0 ? 'Saved ' + saved + '% — new size ' + h.fmt(blob.size) : 'New size ' + h.fmt(blob.size) + ' (larger than the original)'));
			result.appendChild(h.el('p', 'fsov-note', 'Before: ' + h.fmt(file.size) + ' · After: ' + h.fmt(blob.size) + (saved <= 0 ? '. Try a lower quality or a smaller width.' : '')));
			result.appendChild(h.download(url, 'compressed.' + EXT[fmtKey], 'Download image'));
		}).catch(function (e) {
			result.appendChild(h.el('p', 'fsov-error', e.message));
		}).then(function () {
			go.disabled = false; go.textContent = label; r('bar').hidden = true;
		});
	});
})();
