/* BB-OVERLAY-GUARD
   Пока открыт любой оверлей (мобильное меню, поп-ап события, видео-лайтбокс,
   модалка схемы зала, окно чата, панель брони Waitly) — плавающие красные
   виджеты не должны висеть поверх и перекрывать текст.

   Ставит на <html> атрибут data-bb-ovl:
     "menu"  — открыто мобильное меню            → скрыты чат (кнопка+окно) и бронь
     "modal" — открыт поп-ап/модалка/лайтбокс    → скрыты чат (кнопка+окно) и бронь
     "chat"  — открыто окно чата                 → скрыта бронь
     "book"  — открыта панель брони Waitly       → скрыт чат
   Правила видимости живут в CSS страницы (блок BB-CHAT). */
(function () {
  var HTML = document.documentElement;
  var MINE = '[data-m="fab-chat"],[data-m="chat-panel"],#waitly-widget-root,.waitly-fab';

  function vis(el) {
    if (!el || !el.getClientRects().length) return false;
    var cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) return false;
    return true;
  }

  function menuOpen() {
    var cb = document.getElementById('bbmenu');
    if (cb && cb.checked) return true;
    var m = document.querySelector('[data-m="mobile-menu"]');
    return !!(m && vis(m) && getComputedStyle(m).position === 'fixed');
  }

  function chatOpen() {
    var p = document.querySelector('[data-m="chat-panel"]');
    return !!(p && vis(p));
  }

  function bookOpen() {
    var root = document.getElementById('waitly-widget-root');
    var sr = root && (root.shadowRoot || root.__shadow);
    if (!sr) return false;
    var vh = window.innerHeight;
    var nodes = sr.querySelectorAll('div,section,iframe');
    for (var i = 0; i < nodes.length; i++) {
      var r = nodes[i].getBoundingClientRect();
      if (r.height > vh * 0.5 && r.width > 200) return true;
    }
    return false;
  }

  /* Любой прочий оверлей: фиксированный слой, который занимает бо́льшую часть
     экрана и лежит выше контента. Ловит поп-ап события, видео-лайтбокс,
     модалку схемы зала и всё, что появится позже. */
  function modalOpen() {
    if (document.querySelector('dialog[open]')) return true;
    var vw = window.innerWidth, vh = window.innerHeight;
    var all = document.body.querySelectorAll('div,section,aside,dialog');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.closest && el.closest(MINE)) continue;
      var cs = getComputedStyle(el);
      if (cs.position !== 'fixed') continue;
      var z = parseInt(cs.zIndex, 10);
      if (!(z >= 60)) continue; /* шапка 50, шторка меню 90, поп-апы 200+ */
      if (!vis(el)) continue;
      var r = el.getBoundingClientRect();
      if (r.width >= vw * 0.7 && r.height >= vh * 0.6) return true;
    }
    return false;
  }

  /* Чат не должен закрывать текст: если под кнопкой оказалась строка текста
     или картинка — прячем её, пока пользователь не прокрутит дальше. */
  function fabOverText() {
    var fab = document.querySelector('[data-m="fab-chat"]');
    if (!fab) return false;
    var r = fab.getBoundingClientRect();
    if (!r.width) return false;
    var pts = [[r.left + r.width / 2, r.top + r.height / 2], [r.right + 6, r.top + r.height / 2], [r.left + r.width / 2, r.top - 4]];
    for (var k = 0; k < pts.length; k++) {
      var stack = document.elementsFromPoint(pts[k][0], pts[k][1]) || [];
      for (var i = 0; i < stack.length; i++) {
        var el = stack[i];
        if (el === fab || (el.closest && el.closest(MINE))) continue;
        if (el === document.body || el === document.documentElement) break;
        if (el.tagName === 'IMG' || el.tagName === 'VIDEO' || el.tagName === 'SVG') return true;
        var own = '';
        for (var n = 0; n < el.childNodes.length; n++) {
          if (el.childNodes[n].nodeType === 3) own += el.childNodes[n].nodeValue;
        }
        if (own.trim().length > 1) return true;
        break;
      }
    }
    return false;
  }

  var last = '';
  var lastFab = '';
  function sync() {
    var v = '';
    if (menuOpen()) v = 'menu';
    else if (modalOpen()) v = 'modal';
    else if (bookOpen()) v = 'book';
    else if (chatOpen()) v = 'chat';
    if (v !== last) {
      last = v;
      if (v) HTML.setAttribute('data-bb-ovl', v);
      else HTML.removeAttribute('data-bb-ovl');
    }
    var f = (!v && !chatOpen() && fabOverText()) ? 'hidden' : '';
    if (f !== lastFab) {
      lastFab = f;
      if (f) HTML.setAttribute('data-bb-fab', f);
      else HTML.removeAttribute('data-bb-fab');
    }
  }

  window.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);

  ['click', 'change', 'keyup', 'touchend'].forEach(function (e) {
    document.addEventListener(e, function () { sync(); setTimeout(sync, 60); setTimeout(sync, 320); }, true);
  });
  new MutationObserver(sync).observe(document.documentElement, {
    subtree: true, childList: true, attributes: true,
    attributeFilter: ['style', 'class', 'open', 'checked', 'data-open']
  });
  setInterval(sync, 400);
  sync();
})();
