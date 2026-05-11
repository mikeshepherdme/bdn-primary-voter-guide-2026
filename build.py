#!/usr/bin/env python3
"""
Build script: bundles the voter guide into a single self-contained embed.html.

Usage:
    python3 build.py

Output:
    embed.html  — drop this on any web server and iframe it into articles.
    Photo assets in candidate-photos/ must be in the same directory as embed.html.
"""

import json, pathlib, sys

BASE = pathlib.Path(__file__).parent

def read(name):
    return (BASE / name).read_text(encoding='utf-8')

css        = read('style.css')
js         = read('app.js')
data_raw   = read('data.json')
diffs_raw  = read('policy_differences.json')
rels_raw   = read('candidate_relationships.json')

# Validate JSON
try:
    json.loads(data_raw)
    json.loads(diffs_raw)
    json.loads(rels_raw)
except json.JSONDecodeError as e:
    sys.exit(f'JSON parse error: {e}')

# Inline data intercept — override fetch() before app.js runs so no source
# changes are needed. The override resolves the three known URLs from globals.
data_intercept = f"""
<script>
window.__VG_CANDIDATES__  = {data_raw};
window.__VG_DIFFS__       = {diffs_raw};
window.__VG_RELATIONS__   = {rels_raw};

(function () {{
  const _fetch = window.fetch.bind(window);
  window.fetch = function (url, opts) {{
    const u = String(url);
    if (/^data\\.json/.test(u))
      return Promise.resolve({{ ok: true, json: () => Promise.resolve(window.__VG_CANDIDATES__) }});
    if (/^policy_differences\\.json/.test(u))
      return Promise.resolve({{ ok: true, json: () => Promise.resolve(window.__VG_DIFFS__) }});
    if (/^candidate_relationships\\.json/.test(u))
      return Promise.resolve({{ ok: true, json: () => Promise.resolve(window.__VG_RELATIONS__) }});
    return _fetch(url, opts);
  }};
}})();
</script>
"""

# Auto-resize postMessage sender (runs inside the iframe)
# Sends { type: 'vg-resize', height: N } to the parent whenever content height changes.
resize_sender = """
<script>
(function () {
  function sendHeight() {
    var h = document.documentElement.scrollHeight;
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'vg-resize', height: h }, '*');
    }
  }
  // Fire on load and on any DOM/layout change
  window.addEventListener('load', sendHeight);
  if (window.ResizeObserver) {
    new ResizeObserver(sendHeight).observe(document.documentElement);
  } else {
    setInterval(sendHeight, 500);
  }
  // Also fire on hash navigation (SPA route changes)
  window.addEventListener('hashchange', function () {
    setTimeout(sendHeight, 150);
  });
})();
</script>
"""

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Maine 2026 Primary Voter Guide — Bangor Daily News</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
{css}
  </style>
</head>
<body>
  <div id="app">
    <header id="guide-header">
      <div class="header-inner">
        <a class="header-brand" href="#/">
          <span class="bdn-mark">BDN</span>
          <div class="header-titles">
            <span class="header-eyebrow">Maine 2026</span>
            <span class="header-name">Primary Voter Guide</span>
          </div>
        </a>
        <div class="header-actions">
          <button class="btn-ghost" id="btn-copy">Copy link</button>
          <button class="btn-expand" id="btn-fullscreen">Open full page &#x2197;</button>
        </div>
      </div>
      <nav id="breadcrumb" class="breadcrumb"></nav>
    </header>

    <main id="main"></main>

    <div id="compare-tray" class="compare-tray hidden">
      <div class="compare-tray-inner">
        <span class="compare-tray-label">Comparing:</span>
        <div id="compare-tray-chips"></div>
        <div class="compare-tray-actions">
          <button class="btn-primary" id="btn-compare-go">Compare &rarr;</button>
          <button class="btn-ghost" id="btn-compare-clear">Clear</button>
        </div>
      </div>
    </div>

    <div id="toast" class="toast"></div>
  </div>

  <!-- Side panel -->
  <div id="sp-overlay" class="sp-overlay" onclick="closeSidePanel()"></div>
  <div id="side-panel" class="side-panel">
    <div class="sp-header">
      <span id="sp-title" class="sp-title"></span>
      <button class="sp-close" onclick="closeSidePanel()">&#x2715;</button>
    </div>
    <div id="sp-body" class="sp-body"></div>
  </div>

  {data_intercept}
  <script>
{js}
  </script>
  {resize_sender}
</body>
</html>
"""

out = BASE / 'embed.html'
out.write_text(html, encoding='utf-8')
print(f'Built {out}  ({out.stat().st_size:,} bytes)')
print()
print('── Embed snippet (paste into CMS article body) ─────────────────────────')
print("""
<div id="vg-embed-wrap" style="position:relative;width:100%">
  <iframe
    id="vg-embed"
    src="URL_TO_EMBED_HTML"
    width="100%"
    height="800"
    frameborder="0"
    scrolling="no"
    allowfullscreen
    style="display:block;border:none"
  ></iframe>
</div>
<script>
window.addEventListener('message', function (e) {
  if (e.data && e.data.type === 'vg-resize') {
    var f = document.getElementById('vg-embed');
    if (f) f.style.height = (e.data.height + 20) + 'px';
  }
});
</script>
""")
