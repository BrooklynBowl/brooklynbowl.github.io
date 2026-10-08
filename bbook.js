// Просмотр BrooklynBook: любой элемент с data-bb-open="N" открывает книгу на странице N (1…40).
// Работает на любой странице сайта; разметку лайтбокса создаёт сам.
(function () {
  var TOTAL = 40;
  var base = (document.currentScript && document.currentScript.src || '').replace(/bbook\.js.*$/, '') + 'uploads/brooklynbook/';
  var src = function (n) { return base + 'p-' + (n < 10 ? '0' : '') + n + '.jpg'; };
  var box, img, counter, cur = 1, touchX = null;

  function build() {
    box = document.createElement('div');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'BrooklynBook');
    box.style.cssText = 'position:fixed; inset:0; z-index:2000; display:none; flex-direction:column; align-items:center; justify-content:center; background:rgba(0,0,0,0.94); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); font-family:"Proxima Nova","Montserrat",-apple-system,sans-serif;';
    var btn = 'position:absolute; display:flex; align-items:center; justify-content:center; width:52px; height:52px; border-radius:50%; border:1px solid rgba(255,255,255,0.18); background:#191919; color:#fff; font-size:22px; cursor:pointer; font-family:inherit;';
    box.innerHTML =
      '<button data-bb="close" aria-label="Закрыть" style="' + btn + ' top:18px; right:18px; z-index:3;">✕</button>' +
      '<div style="position:absolute; top:28px; left:24px; font-size:13px; font-weight:800; letter-spacing:0.08em; color:rgba(232,229,222,0.66);">BROOKLYNBOOK · <span data-bb="counter" style="color:#fff;"></span></div>' +
      '<img data-bb="img" alt="Страница BrooklynBook" style="max-width:min(92vw,1600px); max-height:78vh; width:auto; height:auto; border-radius:12px; box-shadow:0 30px 80px rgba(0,0,0,0.6); user-select:none;">' +
      '<button data-bb="prev" aria-label="Предыдущая страница" style="' + btn + ' left:18px; top:50%; transform:translateY(-50%);">←</button>' +
      '<button data-bb="next" aria-label="Следующая страница" style="' + btn + ' right:18px; top:50%; transform:translateY(-50%);">→</button>' +
      '<div style="position:absolute; bottom:22px; left:0; right:0; text-align:center; font-size:13px; color:rgba(232,229,222,0.55);">Листай стрелками или свайпом</div>';
    document.body.appendChild(box);
    img = box.querySelector('[data-bb="img"]');
    counter = box.querySelector('[data-bb="counter"]');
    box.addEventListener('click', function (e) {
      var a = e.target.closest('[data-bb]');
      var k = a && a.getAttribute('data-bb');
      if (k === 'close' || e.target === box) close();
      else if (k === 'prev') go(cur - 1);
      else if (k === 'next' || k === 'img') go(cur + 1);
    });
    box.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX; touchX = null;
      if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
    });
    if (window.matchMedia('(max-width:768px)').matches) {
      box.querySelectorAll('[data-bb="prev"],[data-bb="next"]').forEach(function (b) { b.style.top = 'auto'; b.style.bottom = '56px'; b.style.transform = 'none'; });
    }
  }
  function go(n) {
    cur = Math.max(1, Math.min(TOTAL, n));
    img.src = src(cur);
    counter.textContent = cur + ' / ' + TOTAL;
    [cur - 1, cur + 1].forEach(function (m) { if (m >= 1 && m <= TOTAL) { var p = new Image(); p.src = src(m); } });
  }
  function open(n) {
    if (!box) build();
    box.style.display = 'flex';
    document.documentElement.style.overflow = 'hidden';
    go(n || 1);
  }
  function close() {
    box.style.display = 'none';
    document.documentElement.style.overflow = '';
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-bb-open]');
    if (!t) return;
    e.preventDefault();
    open(parseInt(t.getAttribute('data-bb-open'), 10) || 1);
  });
  document.addEventListener('keydown', function (e) {
    if (!box || box.style.display === 'none') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') go(cur + 1);
    if (e.key === 'ArrowLeft') go(cur - 1);
  });
})();
