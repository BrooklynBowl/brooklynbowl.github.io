// Уведомление о cookie: показывается, пока посетитель не нажмёт «Согласен».
(function () {
  try { if (localStorage.getItem('bb-cookie-ok') === '1') return; } catch (e) {}
  var inCity = /\/(tyumen|izhevsk|msk|nv|samara|spb|surgut)\//.test(location.pathname);
  var policy = inCity ? 'privacy.html' : 'tyumen/privacy.html';
  function show() {
    var b = document.createElement('div');
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'Уведомление о cookie');
    var mobile = window.matchMedia('(max-width:768px)').matches;
    b.style.cssText = 'position:fixed; z-index:1500; left:16px; right:16px; bottom:' + (mobile ? '112px' : '20px') + '; max-width:760px; margin:0 auto; display:flex; flex-wrap:wrap; align-items:center; gap:12px 18px; padding:16px 20px; border-radius:18px; background:#191919; border:1px solid rgba(255,255,255,0.14); box-shadow:0 18px 50px rgba(0,0,0,0.55); font-family:"Proxima Nova","Montserrat",-apple-system,sans-serif; font-size:13.5px; line-height:1.5; color:rgba(232,229,222,0.86);';
    b.innerHTML = '<span style="flex:1 1 320px;">Мы используем файлы cookie и сервисы веб-аналитики, чтобы сайт работал корректно. Продолжая пользоваться сайтом, вы соглашаетесь с <a href="' + policy + '" style="color:#FF2026; text-decoration:underline;">Политикой обработки персональных данных</a>.</span>' +
      '<button type="button" style="flex:0 0 auto; min-height:44px; cursor:pointer; border:none; background:#FF2026; color:#fff; padding:12px 26px; border-radius:300px; font-family:inherit; font-size:14px; font-weight:800; letter-spacing:0.04em;">Согласен</button>';
    b.querySelector('button').addEventListener('click', function () {
      try { localStorage.setItem('bb-cookie-ok', '1'); } catch (e) {}
      b.remove();
    });
    document.body.appendChild(b);
  }
  if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
})();
