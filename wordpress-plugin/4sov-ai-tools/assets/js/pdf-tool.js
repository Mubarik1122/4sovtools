(function () {
	'use strict';
	var h = FSOV.h, root = document.querySelector('[data-fsov-tool="pdf"]');
	if (!root) { return; }
	var r = function (n) { return h.role(root, n); };
	var toPdf = root.getAttribute('data-mode') !== 'pdf-to-word';
	var file = null, go = r('go'), result = r('result'), status = r('status'), MAX = 25 * 1024 * 1024;
	var DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

	/** Render a PDF or DOCX blob into `body`. Falls back to a short message. */
	function renderDoc(blob, isPdf, body) {
		body.textContent = 'Loading preview…';
		var job;
		if (isPdf && window.pdfjsLib) {
			job = blob.arrayBuffer().then(function (buf) { return pdfjsLib.getDocument({ data: buf }).promise; })
				.then(function (d) { return d.getPage(1); })
				.then(function (pg) {
					var vp = pg.getViewport({ scale: 1.2 }), c = document.createElement('canvas');
					c.width = vp.width; c.height = vp.height;
					return pg.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise.then(function () { body.textContent = ''; c.className = 'fsov-page-canvas'; body.appendChild(c); });
				});
		} else if (!isPdf && window.mammoth) {
			job = blob.arrayBuffer().then(function (buf) { return mammoth.convertToHtml({ arrayBuffer: buf }); })
				.then(function (res) { body.textContent = ''; var p = h.el('div', 'fsov-paper'); p.innerHTML = res.value; body.appendChild(p); }); // mammoth output is sanitized HTML
		} else { job = Promise.reject(new Error('no viewer')); }
		job.catch(function () { body.textContent = 'Preview isn’t available for this file, but you can still download it.'; });
	}

	h.bindDropzone(root, function (f) {
		result.textContent = ''; status.textContent = '';
		var okType = toPdf ? /\.docx$/i.test(f.name) : /\.pdf$/i.test(f.name);
		if (!okType) { result.appendChild(h.el('p', 'fsov-error', toPdf ? 'Choose a Word (.docx) file.' : 'Choose a PDF file.')); return; }
		if (f.size > MAX) { result.appendChild(h.el('p', 'fsov-error', 'That file is over 25 MB.')); return; }
		file = f;
		var c = h.card(f.name + ' · ' + h.fmt(f.size), 'Uploaded');
		r('preview').textContent = ''; r('preview').appendChild(c.wrap);
		renderDoc(f, !toPdf, c.body);
	});

	go.addEventListener('click', function () {
		result.textContent = ''; status.textContent = '';
		if (!file) { result.appendChild(h.el('p', 'fsov-note', 'Choose a file first.')); return; }
		var label = go.textContent, fd = new FormData();
		fd.append('document', file);
		fd.append('targetFormat', toPdf ? '.pdf' : '.docx');
		go.disabled = true;
		h.ensureAwake(go).then(function () {
			go.textContent = 'Converting…';
			return h.postBlob('/api/pdf/convert', fd, {
				onProgress: function (p) {
					h.progress(r('bar'))(p);
					status.textContent = p < 100 ? 'Uploading… ' + p + '%' : 'Converting… this can take a few seconds';
				}
			});
		}).then(function (blob) {
			var name = file.name.replace(/\.[^.]+$/, '') + (toPdf ? '.pdf' : '.docx');
			var url = URL.createObjectURL(new Blob([blob], { type: toPdf ? 'application/pdf' : DOCX }));
			var c = h.card(name + ' · ' + h.fmt(blob.size), 'Converted');
			result.appendChild(c.wrap);
			renderDoc(blob, toPdf, c.body);
			result.appendChild(h.download(url, name, 'Download converted file'));
			status.textContent = '';
		}).catch(function (e) {
			status.textContent = ''; result.appendChild(h.el('p', 'fsov-error', e.message));
		}).then(function () {
			go.disabled = false; go.textContent = label; r('bar').hidden = true;
		});
	});
})();
