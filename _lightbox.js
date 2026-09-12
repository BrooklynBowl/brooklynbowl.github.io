/* BB-VIDEO-LIGHTBOX v1 — клик по превью открывает ролик целиком в модалке */
(function () {
  if (window.__bbLb) { return; }
  window.__bbLb = 1;

  var ov, box, vid, closeBtn, opener;

  function build() {
    ov = document.createElement('div');
    ov.setAttribute('data-bb-lightbox', '');
    ov.style.cssText = 'position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.88);padding:clamp(12px,4vw,48px);box-sizing:border-box;';

    box = document.createElement('div');
    box.style.cssText = 'position:relative;width:100%;max-width:1400px;display:flex;align-items:center;justify-content:center;';

    vid = document.createElement('video');
    vid.setAttribute('controls', '');
    vid.setAttribute('playsinline', '');
    vid.style.cssText = 'width:100%;max-height:82vh;object-fit:contain;background:#000;border-radius:14px;display:block;';

    closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Закрыть');
    closeBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>';
    closeBtn.style.cssText = 'position:absolute;top:clamp(10px,2vw,18px);right:clamp(10px,2vw,18px);width:48px;height:48px;border-radius:50%;border:1px solid rgba(255,255,255,0.24);background:rgba(0,0,0,0.72);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;z-index:2;';

    box.appendChild(vid);
    ov.appendChild(box);
    ov.appendChild(closeBtn);
    ov.appendChild(box);
    document.body.appendChild(ov);

    closeBtn.addEventListener('click', close);
    ov.addEventListener('click', function (e) { if (e.target === ov || e.target === box) { close(); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.style.display === 'flex') { close(); } });
    fit();
    window.addEventListener('resize', fit);
  }

  /* на узких экранах кнопка крупнее, видео оставляет ей место сверху */
  function fit() {
    if (!closeBtn) { return; }
    if (window.innerWidth < 720) {
      closeBtn.style.width = '54px';
      closeBtn.style.height = '54px';
      vid.style.maxHeight = 'min(70vh, calc(100vh - 150px))';
      vid.style.borderRadius = '10px';
    } else {
      closeBtn.style.width = '48px';
      closeBtn.style.height = '48px';
      vid.style.maxHeight = 'min(82vh, calc(100vh - 150px))';
      vid.style.borderRadius = '14px';
    }
  }

  function open(src, poster, label) {
    if (!ov) { build(); }
    vid.src = src;
    if (poster) { vid.poster = poster; }
    if (label) { vid.setAttribute('aria-label', label); }
    vid.muted = false;
    vid.volume = 1;
    vid.currentTime = 0;
    ov.style.display = 'flex';
    document.documentElement.style.overflow = 'hidden';
    var p = vid.play();
    if (p && p.catch) { p.catch(function () {}); }
  }

  function close() {
    if (!ov) { return; }
    vid.pause();
    vid.removeAttribute('src');
    vid.load();
    ov.style.display = 'none';
    document.documentElement.style.overflow = '';
    if (opener) { var q = opener.play(); if (q && q.catch) { q.catch(function () {}); } opener = null; }
  }

  function srcOf(v) {
    if (v.currentSrc) { return v.currentSrc; }
    if (v.getAttribute('src')) { return v.getAttribute('src'); }
    var s = v.querySelector('source');
    return s ? s.getAttribute('src') : '';
  }

  /* Перехватываем клик до слушателей звука на самом видео */
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) { return; }
    if (t.closest('[data-bb-lightbox]')) { return; }
    if (t.closest('[data-sound-toggle]')) { return; }

    /* карточка-заглушка: картинка + кнопка play, видео только в модалке */
    var still = t.closest('[data-lb-video]');
    if (still) {
      var url = still.getAttribute('data-lb-video');
      if (url) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var im = still.querySelector('img');
        open(url, im ? im.getAttribute('src') : '', im ? im.getAttribute('alt') : '');
      }
      return;
    }

    /* клик по обычному видео поп-ап не открывает — им занимается звуковой скрипт */
  }, true);

  /* Кнопка воспроизведения поверх превью */
  function playButton() {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('data-lb-open', '');
    b.setAttribute('aria-label', 'Смотреть видео целиком');
    b.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 5.5v13l11-6.5L8 5.5Z" fill="#fff"/></svg>';
    b.style.cssText = 'position:absolute;z-index:6;left:50%;top:50%;transform:translate(-50%,-50%);width:68px;height:68px;border-radius:50%;border:1px solid rgba(255,255,255,0.28);background:rgba(0,0,0,0.55);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;';
    return b;
  }

  function mountButtons() {
    var stills = document.querySelectorAll('[data-lb-video]');
    for (var k = 0; k < stills.length; k++) {
      var st = stills[k];
      if (st.querySelector('[data-lb-open]')) { continue; }
      if (window.getComputedStyle(st).position === 'static') { st.style.position = 'relative'; }
      st.appendChild(playButton());
    }
    /* остальные видео на сайте играют сами: без кнопки play и без поп-апа */
  }

  mountButtons();
  var n = 0;
  var t = setInterval(function () { mountButtons(); if (++n > 40) { clearInterval(t); } }, 500);
  document.addEventListener('DOMContentLoaded', mountButtons);
})();
