/* Brooklyn Bowl — прошедшие события уходят сами.
   1) У каждого события в данных есть машиночитаемое поле dt:'YYYY-MM-DD HH:MM'.
   2) bbEvents(список) убирает событие, когда наступило время его начала,
      сортирует по возрастанию даты и пересчитывает регулярные события (weekly:0..6 — день недели)
      на ближайшую будущую дату этого дня недели, обновляя и подпись date.
   Подключается в <helmet> каждой страницы, где выводятся события. */
(function () {
  var MON = ['01','02','03','04','05','06','07','08','09','10','11','12'];

  function parseDt(s) {
    // 'YYYY-MM-DD HH:MM'
    var m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/.exec(String(s || '').trim());
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], 0, 0);
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function fmtDt(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
      ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  // подпись как на сайте: «08.09 · 18:00», с годом — если год не текущий
  function fmtLabel(d, withYear, allDay) {
    var base = pad(d.getDate()) + '.' + MON[d.getMonth()];
    if (withYear) base += '.' + d.getFullYear();
    if (allDay) return base; // акция на весь день — время не показываем
    return base + ' \u00b7 ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function nextWeekday(from, wd, h, mi) {
    var d = new Date(from.getFullYear(), from.getMonth(), from.getDate(), h, mi, 0, 0);
    var shift = (wd - d.getDay() + 7) % 7;
    d.setDate(d.getDate() + shift);
    return d;
  }

  window.bbEvents = function (list) {
    if (!list || !list.length) return [];
    var now = new Date();
    var startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      var d = parseDt(e.dt);
      if (!d) { out.push(e); continue; } // без машиночитаемой даты не трогаем
      var withYear = /\d{2}\.\d{2}\.\d{4}/.test(String(e.date || ''));
      if (e.weekly != null) {
        var wds = [].concat(e.weekly).map(Number);
        var nd = null;
        for (var wi = 0; wi < wds.length; wi++) {
          var cand = nextWeekday(startToday, wds[wi], d.getHours(), d.getMinutes());
          if (e.allDay) { // весь день: сегодняшний день ещё считается будущим
            var eod = new Date(cand.getFullYear(), cand.getMonth(), cand.getDate(), 23, 59, 59);
            if (eod.getTime() <= now.getTime()) cand.setDate(cand.getDate() + 7);
          } else if (cand.getTime() <= now.getTime()) cand.setDate(cand.getDate() + 7);
          if (!nd || cand < nd) nd = cand;
        }
        e = Object.assign({}, e, { dt: fmtDt(nd), date: fmtLabel(nd, withYear, !!e.allDay) });
        d = nd;
      }
      if (e.allDay) {
        // событие на весь день — уходит после конца своего дня
        var endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
        if (endOfDay.getTime() <= now.getTime()) continue;
      } else if (d.getTime() <= now.getTime()) continue; // время начала наступило — событие ушло
      e._ts = d.getTime();
      out.push(e);
    }
    out.sort(function (a, b) { return (a._ts || 0) - (b._ts || 0); });
    // регулярная карточка не дублирует конкретное вхождение той же серии
    var key = function (e) { return (e.cat || '') + '|' + e.dt + '|' + (e.venue || '') + '|' + (e.price || ''); };
    var concrete = {};
    for (var j = 0; j < out.length; j++) if (out[j].weekly == null) concrete[key(out[j])] = true;
    var seen = {}, res = [];
    for (var k2 = 0; k2 < out.length; k2++) {
      var e2 = out[k2], kk = key(e2);
      if (e2.weekly != null && concrete[kk]) continue;   // серия уже представлена конкретной датой
      if (seen[kk + '|' + (e2.title || '')]) continue;    // полные дубли
      seen[kk + '|' + (e2.title || '')] = true;
      res.push(e2);
    }
    return res;
  };
})();
