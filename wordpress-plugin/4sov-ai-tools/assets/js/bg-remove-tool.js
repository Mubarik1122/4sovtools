(function () {
	'use strict';
	var h = FSOV.h, root = document.querySelector('[data-fsov-tool="bg"]');
	if (!root) { return; }
	var r = function (n) { return h.role(root, n); };
	var file = null, go = r('go'), result = r('result'), MAX = 20 * 1024 * 1024;

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
		var label = go.textContent, fd = new FormData();
		fd.append('image', file);
		go.disabled = true;
		h.ensureAwake(go).then(function () {
			go.textContent = 'Removing background…';
			return h.postBlob('/api/image/remove-bg', fd, { onProgress: h.progress(r('bar')) });
		}).then(function (blob) {
			var url = URL.createObjectURL(blob);
			result.appendChild(h.beforeAfter(h.imgBox(URL.createObjectURL(file), 'Original image'), h.imgBox(url, 'Image with background removed')));
			result.appendChild(h.download(url, 'no-background.png', 'Download PNG'));
		}).catch(function (e) {
			result.appendChild(h.el('p', 'fsov-error', e.message));
		}).then(function () {
			go.disabled = false; go.textContent = label; r('bar').hidden = true;
		});
	});
})();
