/* Схемы залов пока лежат ссылками на Google Drive, который не отдаёт картинку по хотлинку.
   Пока файлов схем нет в проекте, секция целиком скрывается — чтобы страница не обещала того,
   чего не показывает. Когда схемы положат локально и они загрузятся, скрипт ничего не делает. */
(function () {
  function hide(img) {
    var zoom = img.closest('[data-m="hall-zoom"]');
    if (zoom) zoom.style.display = 'none';
    var card = img.closest('[data-m="hall-card"]');
    if (card) card.style.display = 'none';
    var sec = img.closest('section');
    if (sec) {
      var live = sec.querySelectorAll('img');
      var ok = 0;
      for (var i = 0; i < live.length; i++) if (live[i].naturalWidth > 0) ok++;
      if (!ok) { sec.style.display = 'none'; return; }
    }
    if (!zoom && !card) img.style.display = 'none';
  }
  function check() {
    var imgs = document.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      var im = imgs[i];
      if (im.complete && im.naturalWidth === 0) hide(im);
      else if (!im.dataset.bbImgWatch) {
        im.dataset.bbImgWatch = '1';
        im.addEventListener('error', function () { hide(this); });
      }
    }
  }
  document.addEventListener('DOMContentLoaded', check);
  window.addEventListener('load', check);
  setInterval(check, 1500);
})();
