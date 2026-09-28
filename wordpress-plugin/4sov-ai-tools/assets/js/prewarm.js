/**
 * 4sov AI Tools: shared helpers and intent-based backend pre-warming.
 * The backend sleeps on Render's free tier. We wake it when the visitor shows intent
 * (picks a file, drags one in, focuses the URL box), not on page load and not on a timer.
 */
(function () {
	'use strict';

	var API = (window.FSOV && window.FSOV.api) || '';
	var KEY = 'fsov_awake_at';
	var TTL = 10 * 60 * 1000; // Render sleeps after 15 idle minutes; re-check after 10
	var pending = null;

	function isAwake() {
		try { var t = parseInt(sessionStorage.getItem(KEY), 10); return !!t && Date.now() - t < TTL; } catch (e) { return false; }
	}
	function markAwake() {
		try { sessionStorage.setItem(KEY, String(Date.now())); } catch (e) { /* storage blocked */ }
	}
	function ping(n) {
		return fetch(API + '/health', { cache: 'no-store' })
			.then(function (r) { if (!r.ok) { throw new Error('not ready'); } })
			.catch(function (err) {
				if (n >= 8) { throw err; }
				return new Promise(function (ok) { setTimeout(ok, 5000); }).then(function () { return ping(n + 1); });
			});
	}
	function wake() {
		if (isAwake()) { return Promise.resolve(); }
		if (!pending) {
			pending = ping(0).then(markAwake).then(function () { pending = null; }, function (e) { pending = null; throw e; });
		}
		return pending;
	}
	function ensureAwake(btn) {
		if (isAwake()) { return Promise.resolve(); }
		var old = btn.textContent;
		btn.textContent = 'Initializing processing engine… (~15s on first use)';
		return wake().then(function () { btn.textContent = old; }, function (e) {
			btn.textContent = old;
			throw new Error('The processing engine could not start. Please try again in a minute.');
		});
	}

	/* ---- small DOM helpers ---- */
	function el(tag, cls, text) {
		var e = document.createElement(tag);
		if (cls) { e.className = cls; }
		if (text != null) { e.textContent = text; }
		return e;
	}
	function fmt(b) { return b > 1048576 ? (b / 1048576).toFixed(2) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
	function imgBox(src, alt) {
		var w = el('div', 'fsov-chk'), i = new Image();
		i.src = src; i.alt = alt; w.appendChild(i);
		return w;
	}
	function beforeAfter(b, a) {
		var g = el('div', 'fsov-ba'), c1 = el('div'), c2 = el('div');
		c1.appendChild(el('p', 'fsov-note', 'Before')); c1.appendChild(b);
		c2.appendChild(el('p', 'fsov-note', 'After')); c2.appendChild(a);
		g.appendChild(c1); g.appendChild(c2);
		return g;
	}
	/** A preview card. Returns { wrap, body } so callers can fill body later. */
	function card(title, badge) {
		var wrap = el('div', 'fsov-glass fsov-pv'), head = el('div', 'fsov-pvh'), body = el('div');
		head.appendChild(el('span', '', title));
		head.appendChild(el('span', 'fsov-badge', badge));
		wrap.appendChild(head); wrap.appendChild(body);
		return { wrap: wrap, body: body };
	}
	function download(url, name, label) {
		var a = el('a', 'fsov-btn fsov-sec', label);
		a.href = url; a.download = name;
		return a;
	}
	function bindDropzone(root, onFile) {
		var dz = root.querySelector('[data-role="dz"]'), input = root.querySelector('[data-role="input"]');
		dz.addEventListener('dragover', function (e) { e.preventDefault(); });
		dz.addEventListener('dragenter', function () { dz.classList.add('fsov-over'); });
		dz.addEventListener('dragleave', function () { dz.classList.remove('fsov-over'); });
		dz.addEventListener('drop', function (e) {
			e.preventDefault(); dz.classList.remove('fsov-over');
			if (e.dataTransfer.files[0]) { onFile(e.dataTransfer.files[0]); dz.classList.add('fsov-has'); }
		});
		input.addEventListener('change', function () {
			if (input.files[0]) { onFile(input.files[0]); dz.classList.add('fsov-has'); }
		});
	}

	/* ---- network ---- */
	function errorFrom(blobOrText) {
		var p = typeof blobOrText === 'string' ? Promise.resolve(blobOrText) : blobOrText.text();
		return p.then(function (t) {
			try { return new Error(JSON.parse(t).error || 'Something went wrong'); } catch (e) { return new Error('Something went wrong. Please try again.'); }
		});
	}
	/** POST and get a Blob back. Reports upload progress (0-100) when onProgress is given. */
	function postBlob(path, body, opts) {
		opts = opts || {};
		return new Promise(function (resolve, reject) {
			var x = new XMLHttpRequest();
			x.open('POST', API + path);
			x.responseType = 'blob';
			if (opts.json) { x.setRequestHeader('Content-Type', 'application/json'); body = JSON.stringify(body); }
			if (opts.onProgress && x.upload) {
				x.upload.onprogress = function (e) { if (e.lengthComputable) { opts.onProgress(Math.round(e.loaded / e.total * 100)); } };
			}
			x.onload = function () {
				if (x.status >= 200 && x.status < 300) { resolve(x.response); } else { errorFrom(x.response).then(reject); }
			};
			x.onerror = function () { reject(new Error('Network error. Check your connection and try again.')); };
			x.send(body);
		});
	}
	function postJSON(path, obj) {
		return fetch(API + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) })
			.then(function (r) {
				if (!r.ok) { return r.text().then(errorFrom).then(function (e) { throw e; }); }
				return r.json();
			});
	}
	function progress(bar) {
		return function (p) { bar.hidden = false; bar.firstElementChild.style.width = p + '%'; };
	}
	function role(root, name) { return root.querySelector('[data-role="' + name + '"]'); }

	window.FSOV = window.FSOV || {};
	window.FSOV.h = {
		wake: wake, ensureAwake: ensureAwake, el: el, fmt: fmt, imgBox: imgBox, beforeAfter: beforeAfter,
		card: card, download: download, bindDropzone: bindDropzone, postBlob: postBlob, postJSON: postJSON,
		progress: progress, role: role
	};

	/* ---- declarative triggers: data-fsov-wake="click,change" ---- */
	document.addEventListener('DOMContentLoaded', function () {
		document.querySelectorAll('[data-fsov-wake]').forEach(function (node) {
			node.getAttribute('data-fsov-wake').split(',').forEach(function (evt) {
				node.addEventListener(evt.trim(), function () { wake().catch(function () { /* retried on action */ }); }, { passive: true });
			});
		});
	});
})();
