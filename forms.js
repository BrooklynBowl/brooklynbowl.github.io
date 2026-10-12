// Согласие в формах: без галочки [data-bb-consent] кнопка отправки не срабатывает.
// Галочка [data-bb-promo] — необязательное согласие на рассылку.
(function () {
  function findConsent(btn) {
    var p = btn.parentElement;
    for (var i = 0; i < 2 && p; i++, p = p.parentElement) {
      var c = p.querySelector('input[data-bb-consent]');
      if (c) return c;
    }
    return null;
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('button[data-m="cta"], button[type="submit"]');
    if (!btn) return;
    var c = findConsent(btn);
    if (!c || c.checked) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    var row = c.closest('label');
    row.style.color = '#FF2026';
    c.style.outline = '2px solid #FF2026';
    c.style.outlineOffset = '2px';
    var hint = row.parentElement.querySelector('[data-bb-consent-hint]');
    if (!hint) {
      hint = document.createElement('div');
      hint.setAttribute('data-bb-consent-hint', '');
      hint.setAttribute('role', 'alert');
      hint.style.cssText = 'font-size:13px; line-height:1.4; color:#FF2026; font-weight:600;';
      hint.textContent = 'Поставь галочку согласия — без неё не сможем принять заявку.';
      row.parentElement.insertBefore(hint, row.nextSibling);
    }
    c.focus();
  }, true);
  document.addEventListener('change', function (e) {
    var c = e.target;
    if (!c.matches || !c.matches('input[data-bb-consent]') || !c.checked) return;
    var row = c.closest('label');
    row.style.color = ''; c.style.outline = '';
    var hint = row.parentElement.querySelector('[data-bb-consent-hint]');
    if (hint) hint.remove();
  });
})();
