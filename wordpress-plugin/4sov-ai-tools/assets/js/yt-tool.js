(function () {
	'use strict';
	var h = FSOV.h, root = document.querySelector('[data-fsov-tool="youtube"]');
	if (!root) { return; }
	var r = function (n) { return h.role(root, n); };
	var YT = /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)[\w-]{6,}/;
	var fetchBtn = r('fetch'), go = r('go'), result = r('result'), status = r('status'), err = r('error');
	var current = null; // the URL that was fetched

	function mmss(s) { s = Math.round(s || 0); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }

	fetchBtn.addEventListener('click', function () {
		var url = r('url').value.trim();
		err.textContent = ''; result.textContent = ''; current = null;
		if (!YT.test(url)) { err.textContent = 'Enter a valid YouTube link, like https://www.youtube.com/watch?v=…'; return; }
		var label = fetchBtn.textContent;
		fetchBtn.disabled = true;
		h.ensureAwake(fetchBtn).then(function () {
			fetchBtn.textContent = 'Fetching…';
			return h.postJSON('/api/yt/info', { url: url });
		}).then(function (info) {
			current = url;
			var c = h.card('Video found', 'Ready'), t = new Image();
			if (info.thumbnail) {
				t.src = info.thumbnail; t.alt = 'Video thumbnail'; t.referrerPolicy = 'no-referrer'; t.className = 'fsov-thumb';
				c.body.appendChild(t);
			}
			c.body.appendChild(h.el('p', 'fsov-title', info.title || 'Untitled video'));
			c.body.appendChild(h.el('p', 'fsov-note', 'Duration ' + mmss(info.duration)));
			r('preview').textContent = ''; r('preview').appendChild(c.wrap);
		}).catch(function (e) {
			err.textContent = e.message;
		}).then(function () {
			fetchBtn.disabled = false; fetchBtn.textContent = label;
		});
	});

	go.addEventListener('click', function () {
		result.textContent = ''; status.textContent = '';
		if (!current) { err.textContent = 'Fetch the media first.'; return; }
		var label = go.textContent, preset = r('preset').value, audio = preset === 'mp3';
		go.disabled = true; go.textContent = 'Downloading…';
		status.textContent = 'Preparing your file. This can take a minute for long videos.';
		h.postBlob('/api/yt/download', { url: current, preset: preset }, { json: true }).then(function (blob) {
			var url = URL.createObjectURL(blob), name = (audio ? 'audio.mp3' : 'video.mp4');
			var c = h.card(name + ' · ' + h.fmt(blob.size), 'Ready'), m = document.createElement(audio ? 'audio' : 'video');
			m.controls = true; m.src = url; m.className = 'fsov-media';
			c.body.appendChild(m);
			result.appendChild(c.wrap);
			result.appendChild(h.download(url, name, 'Download ' + (audio ? 'MP3' : 'MP4')));
			status.textContent = '';
		}).catch(function (e) {
			status.textContent = ''; result.appendChild(h.el('p', 'fsov-error', e.message));
		}).then(function () {
			go.disabled = false; go.textContent = label;
		});
	});
})();
