/* Brooklyn Bowl — блок «Все города на одной карте»: панель городов + 3D-глобус.
   Без внешних запросов и ключей: d3 (_d3.js) и контуры стран (_world.js) лежат в проекте.
   Базовые стили — инлайновые; отдельным блоком вынесены только :hover и мобильные правила. */
(function () {
  var RED = '#FF2026', W = '#FFFFFF', INK = '#000000', CARD = '#191919';
  var L1 = 'rgba(232,229,222,0.86)', L2 = 'rgba(232,229,222,0.6)', L3 = 'rgba(232,229,222,0.45)';
  var BRD = 'rgba(232,229,222,0.2)', BRD2 = 'rgba(232,229,222,0.12)';
  var FONT = '"Proxima Nova","Montserrat",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';

  var CITIES = [
    { name: 'Тюмень', xy: [65.5343, 57.1530], site: 'tyumen/index.html', venues: [
      { name: 'ТРЦ «Тюмень Сити Молл»', addr: 'улица Тимофея Чаркова, 60', floor: '3 этаж', page: 'filial-sitimoll.dc.html' },
      { name: 'ТРЦ «Колумб»', addr: 'Московский тракт, 118', floor: '4 этаж', page: 'filial-kolumb.dc.html' },
      { name: 'ТРЦ «Остров»', addr: 'улица Федюнинского, 67', floor: '3 этаж', page: 'filial-ostrov.dc.html' }
    ] },
    { name: 'Ижевск', xy: [53.2045, 56.8527], site: 'izhevsk/index.html', venues: [
      { name: 'ТРЦ «МОЛЛ Матрица»', addr: 'улица Баранова, 87', floor: '3 этаж', page: 'izhevsk/filial-matrix.dc.html' },
      { name: 'ТРК «Петровский»', addr: 'улица Петрова, 31', floor: '0 этаж', page: 'izhevsk/filial-petrovsky.dc.html' }
    ] },
    { name: 'Нижневартовск', xy: [76.5696, 60.9397], site: 'nv/index.html', venues: [
      { name: 'ТРЦ «ЮГРАМолл»', addr: 'улица Ленина, 15П', floor: '4 этаж', page: 'nv/filial-yugra.dc.html' }
    ] },
    { name: 'Сургут', xy: [73.3962, 61.2540], site: 'surgut/index.html', venues: [
      { name: 'ТРЦ «Аура»', addr: 'Нефтеюганское шоссе, 1', floor: '1 этаж', page: 'surgut/filial-aura.dc.html' }
    ] },
    { name: 'Самара', xy: [50.1500, 53.2000], site: 'samara/index.html', venues: [
      { name: 'ТРЦ «Гудок»', addr: 'Красноармейская улица, 131', floor: '2 этаж', page: 'samara/filial-gudok.dc.html' },
      { name: 'Аутлет МОЛЛ ЛЕТАУТ', addr: 'Московское шоссе, 18-й км, 23', floor: '2 этаж', page: 'samara/filial-letout.dc.html' }
    ] },
    { name: 'Москва', xy: [37.6173, 55.7558], site: 'msk/index.html', venues: [
      { name: 'ТРЦ «Северное сияние»', addr: 'бульвар Дмитрия Донского, 1', floor: '3 этаж', page: 'msk/filial-siyanie.dc.html' },
      { name: 'ТРК «Красный Кит»', addr: 'Шараповский проезд, 2', floor: '3 этаж · Мытищи', page: 'msk/filial-kit.dc.html' }
    ] },
    { name: 'Санкт-Петербург', xy: [30.3159, 59.9391], site: 'spb/index.html', venues: [
      { name: 'ТРЦ «Июнь»', addr: 'Индустриальный проспект, 24', floor: '4 этаж', page: 'spb/filial-iyun.dc.html' }
    ] }
  ];
  var TOTAL = CITIES.reduce(function (n, c) { return n + c.venues.length; }, 0);

  var HOVER = [
    'bb-network [data-bbn="tile"]:hover, bb-network [data-bbn="pin"]:hover, bb-network [data-bbn="tool"]:hover{ border-color:' + RED + ' !important; color:' + W + ' !important; }',
    'bb-network [data-bbn="tile"][data-on="1"]:hover, bb-network [data-bbn="pin"][data-on="1"]:hover{ border-color:' + W + ' !important; }',
    'bb-network [data-bbn="link"]:hover{ color:' + RED + ' !important; border-color:' + RED + ' !important; }',
    'bb-network [data-bbn="aside"]::-webkit-scrollbar{ width:6px; }',
    'bb-network [data-bbn="aside"]::-webkit-scrollbar-thumb{ background:rgba(232,229,222,0.16); border-radius:3px; }',
    '@media (max-width:900px){',
    '  bb-network [data-bbn="wrap"]{ grid-template-columns:1fr !important; }',
    '  bb-network [data-bbn="aside"]{ border-right:none !important; border-bottom:1px solid ' + BRD2 + ' !important; max-height:none !important; padding:22px 18px !important; }',
    '  bb-network [data-bbn="title"]{ font-size:26px !important; }',
    '  bb-network [data-bbn="map"]{ min-height:420px !important; }',
    '  bb-network [data-bbn="maphead"]{ left:16px !important; top:14px !important; }',
    '  bb-network [data-bbn="maphead"] p{ font-size:17px !important; }',
    '  bb-network [data-bbn="maphead"] p:first-child{ display:none !important; }',
    '  bb-network [data-bbn="tools"]{ right:12px !important; top:12px !important; gap:6px !important; }',
    '  bb-network [data-bbn="tool"]{ min-width:34px !important; height:34px !important; padding:0 12px !important; font-size:12px !important; }',
    '  bb-network [data-bbn="pin"]{ font-size:11px !important; padding:5px 9px !important; gap:6px !important; }',
    '  bb-network [data-bbn="bottom"]{ left:16px !important; right:16px !important; bottom:12px !important; font-size:11px !important; }',
    '  bb-network [data-bbn="hint"]{ display:none !important; }',
    '}'
  ].join('\n');

  function ready(cb) {
    if (window.d3 && window.d3.geoOrthographic && window.BB_WORLD) return cb();
    setTimeout(function () { ready(cb); }, 60);
  }
  function el(tag, style, html) {
    var n = document.createElement(tag);
    if (style) n.setAttribute('style', style);
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  var S = {
    wrap: 'display:grid; grid-template-columns:minmax(0,380px) minmax(0,1fr); width:100%; min-height:580px; height:100%; font-family:' + FONT + '; font-style:normal;',
    aside: 'background:' + CARD + '; border-right:1px solid ' + BRD2 + '; padding:28px 25px; overflow-y:auto; max-height:580px;',
    eyebrow: 'margin:0 0 16px; font-size:12px; letter-spacing:0.16em; font-weight:700; color:' + RED + ';',
    title: 'margin:0 0 14px; font-size:34px; line-height:1.05; letter-spacing:-0.02em; font-weight:800; color:' + W + ';',
    muted: 'margin:0 0 22px; font-size:14px; line-height:1.5; color:' + L2 + ';',
    nav: 'display:grid; grid-template-columns:1fr 1fr; gap:7px; margin-bottom:24px;',
    tile: 'font-family:inherit; background:transparent; border:1px solid ' + BRD + '; color:' + L1 + '; border-radius:12px; text-align:left; padding:11px 12px; font-size:14px; font-weight:600; line-height:1.2; cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:6px; transition:border-color .18s ease, color .18s ease;',
    tileOn: 'font-family:inherit; background:' + RED + '; border:1px solid ' + W + '; color:' + W + '; border-radius:12px; text-align:left; padding:11px 12px; font-size:14px; font-weight:600; line-height:1.2; cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:6px;',
    cityname: 'margin:0 0 14px; font-size:20px; font-weight:800; color:' + W + ';',
    map: 'position:relative; overflow:hidden; background:' + INK + '; min-height:580px;',
    canvas: 'position:absolute; inset:0; display:block; width:100%; height:100%; touch-action:none; cursor:grab;',
    labels: 'position:absolute; inset:0; pointer-events:none;',
    pin: 'position:absolute; pointer-events:auto; transform:translateY(-50%); display:flex; align-items:center; gap:8px; background:rgba(25,25,25,0.92); border:1px solid ' + BRD + '; color:' + L1 + '; border-radius:300px; padding:7px 13px; font-family:inherit; font-size:13px; font-weight:600; line-height:1; white-space:nowrap; cursor:pointer; transition:border-color .18s ease, color .18s ease;',
    pinOn: 'position:absolute; pointer-events:auto; transform:translateY(-50%); display:flex; align-items:center; gap:8px; background:' + RED + '; border:1px solid ' + W + '; color:' + W + '; border-radius:300px; padding:7px 13px; font-family:inherit; font-size:13px; font-weight:600; line-height:1; white-space:nowrap; cursor:pointer;',
    maphead: 'position:absolute; left:24px; top:20px; pointer-events:none;',
    tools: 'position:absolute; right:18px; top:18px; display:flex; gap:7px;',
    tool: 'font-family:inherit; font-size:13px; font-weight:700; color:' + L1 + '; background:rgba(25,25,25,0.92); border:1px solid ' + BRD + '; border-radius:300px; cursor:pointer; min-width:38px; height:38px; padding:0 15px; transition:border-color .18s ease, color .18s ease;',
    bottom: 'position:absolute; left:24px; right:24px; bottom:18px; display:flex; justify-content:space-between; gap:16px; font-size:12px; color:' + L3 + '; pointer-events:none;',
    venue: 'display:block; padding:16px 18px; border-radius:16px; background:' + INK + '; border:1px solid ' + BRD2 + '; margin-bottom:10px;'
  };

  class BBNetwork extends HTMLElement {
    connectedCallback() {
      if (this._built && this.canvas && this.contains(this.canvas)) return;
      if (this._built) { this.innerHTML = ''; this._narrow = undefined; }
      this._built = true;
      var self = this;
      if (!document.getElementById('bb-network-css')) {
        var st = el('style', null, HOVER);
        st.id = 'bb-network-css';
        document.head.append(st);
      }
      this.setAttribute('style', (this.getAttribute('style') || '') + ';display:block; position:relative; width:100%; min-width:0; background:' + INK + '; color:' + W + ';');

      this.home = this.getAttribute('city') || 'Тюмень';
      this.base = this.getAttribute('base') || '';
      this.selected = this.home;

      var wrap = el('div', S.wrap);
      wrap.setAttribute('data-bbn', 'wrap');
      var aside = el('aside', S.aside);
      aside.setAttribute('data-bbn', 'aside');
      var title = el('h3', S.title, 'Все города.<br>На одной карте.');
      title.setAttribute('data-bbn', 'title');
      aside.append(
        el('p', S.eyebrow, 'ВЫБЕРИ СВОЙ БРУКЛИН'),
        title,
        el('p', S.muted, 'Нажми на город или отметку на глобусе.')
      );
      this.nav = el('nav', S.nav);
      this.details = el('section', null);
      aside.append(this.nav, this.details);

      var map = el('div', S.map);
      map.setAttribute('data-bbn', 'map');
      this.canvas = el('canvas', S.canvas);
      this.labels = el('div', S.labels);
      var head = el('div', S.maphead);
      head.setAttribute('data-bbn', 'maphead');
      head.append(
        el('p', S.eyebrow + 'margin:0 0 8px;', 'BROOKLYN BOWL / RUSSIA'),
        el('p', 'margin:0; font-size:24px; font-weight:800; line-height:1.1; letter-spacing:-0.01em; color:' + W + ';', 'Кегли. Кухня.<br>Вся страна.')
      );
      var tools = el('div', S.tools);
      tools.setAttribute('data-bbn', 'tools');
      var bottom = el('div', S.bottom,
        '<span style="display:flex; align-items:center; gap:8px;"><i style="width:9px; height:9px; border-radius:50%; background:' + RED + '; display:inline-block;"></i> Города присутствия</span>'
        + '<span data-bbn="hint">Тяни — вращай · + − — масштаб</span>');
      bottom.setAttribute('data-bbn', 'bottom');
      map.append(this.canvas, this.labels, head, tools, bottom);
      wrap.append(aside, map);
      this.append(wrap);

      function tool(label, title, fn) {
        var b = el('button', S.tool);
        b.setAttribute('data-bbn', 'tool');
        b.textContent = label; b.title = title; b.setAttribute('aria-label', title); b.onclick = fn;
        tools.append(b);
      }
      tool('Вся страна', 'Показать все города', function () { self.select(null); });
      tool('−', 'Отдалить', function () { self.fly(self.rotation, Math.max(1.05, self.zoom / 1.25)); });
      tool('+', 'Приблизить', function () { self.fly(self.rotation, Math.min(5, self.zoom * 1.25)); });

      this.tiles = [];
      var all = el('button', S.tile, 'Все заведения <b style="font-size:13px; font-weight:700;">' + TOTAL + '</b>');
      all.setAttribute('data-bbn', 'tile');
      all.style.gridColumn = '1 / -1';
      all.onclick = function () { self.select(null); };
      this.nav.append(all);
      this.tiles.push(all);
      CITIES.forEach(function (c) {
        var b = el('button', S.tile, esc(c.name) + ' <b style="font-size:13px; font-weight:700;">' + c.venues.length + '</b>');
        b.setAttribute('data-bbn', 'tile');
        b.onclick = function () { self.pick(c); };
        self.nav.append(b);
        self.tiles.push(b);
      });

      this.pins = CITIES.map(function (c) {
        var b = el('button', S.pin, '<span>' + esc(c.name) + '</span><b style="font-size:12px; font-weight:700;">' + c.venues.length + '</b>');
        b.setAttribute('data-bbn', 'pin');
        b.setAttribute('aria-label', c.name + ', заведений: ' + c.venues.length);
        b.onclick = function () { self.pick(c); };
        self.labels.append(b);
        return b;
      });

      var home = this.city(this.home);
      this.zoom = 2.35;
      this.rotation = [-home.xy[0], -home.xy[1], 0];
      this.render();
      ready(function () { self.init(); });
    }

    city(name) {
      return CITIES.filter(function (c) { return c.name === name; })[0] || CITIES[0];
    }

    pick(c) {
      if (c.name !== this.home) {
        window.location.href = this.base + c.site.split('/').map(encodeURIComponent).join('/');
        return;
      }
      this.select(c.name);
    }

    select(name) {
      this.selected = name;
      this.render();
      if (name) {
        var c = this.city(name);
        this.fly([-c.xy[0], -c.xy[1], 0], 2.35);
      } else {
        this.fly([-55, -57, 0], 1.45);
      }
    }

    render() {
      var sel = this.selected, base = this.base;
      this.tiles.forEach(function (b, i) {
        var on = i === 0 ? sel === null : CITIES[i - 1].name === sel;
        b.setAttribute('style', on ? S.tileOn : S.tile);
        if (i === 0) b.style.gridColumn = '1 / -1';
        b.setAttribute('data-on', on ? '1' : '0');
      });
      var activeName = sel || this.home;
      this.pins.forEach(function (p, i) {
        var on = CITIES[i].name === activeName;
        var keep = p.style.display, l = p.style.left, t = p.style.top;
        p.setAttribute('style', on ? S.pinOn : S.pin);
        p.style.display = keep; p.style.left = l; p.style.top = t;
        p.setAttribute('data-on', on ? '1' : '0');
      });

      var list = sel ? [this.city(sel)] : CITIES;
      var html = '<h4 style="' + S.cityname + '">'
        + (sel ? esc(sel) : TOTAL + ' заведений в ' + CITIES.length + ' городах') + '</h4>';
      list.forEach(function (c) {
        c.venues.forEach(function (v) {
          var ya = 'https://yandex.ru/maps/?text=' + encodeURIComponent('Brooklyn Bowl ' + c.name + ' ' + v.addr);
          var page = base + v.page.split('/').map(encodeURIComponent).join('/');
          var link = 'font-size:13px; font-weight:600; color:' + W + '; text-decoration:none; border-bottom:1px solid rgba(232,229,222,0.28); padding-bottom:2px;';
          html += '<article style="' + S.venue + '">'
            + '<span style="display:block; font-size:11px; font-weight:700; letter-spacing:0.12em; color:' + RED + '; margin-bottom:7px;">' + esc(c.name).toUpperCase() + '</span>'
            + '<h5 style="margin:0 0 6px; font-size:17px; font-weight:700; line-height:1.25; color:' + W + ';">' + esc(v.name) + '</h5>'
            + '<p style="margin:0 0 12px; font-size:14px; line-height:1.45; color:' + L2 + ';">' + esc(v.addr) + '<br>' + esc(v.floor) + '</p>'
            + '<div style="display:flex; flex-wrap:wrap; gap:14px;">'
            + '<a data-bbn="link" href="' + ya + '" target="_blank" rel="noopener" style="' + link + '">На Яндекс Картах ↗</a>'
            + '<a data-bbn="link" href="' + page + '" style="' + link + '">Подробнее ↗</a>'
            + '</div></article>';
        });
      });
      this.details.innerHTML = html;
    }

    init() {
      var self = this, d3 = window.d3;
      this.ctx = this.canvas.getContext('2d');
      this.projection = d3.geoOrthographic().clipAngle(90);
      this.path = d3.geoPath(this.projection, this.ctx);
      this.grid = d3.geoGraticule10();

      this.canvas.onpointerdown = function (e) {
        cancelAnimationFrame(self.anim);
        self.drag = { x: e.clientX, y: e.clientY, r: self.rotation.slice() };
        self.canvas.setPointerCapture(e.pointerId);
      };
      this.canvas.onpointermove = function (e) {
        if (!self.drag) return;
        self.rotation = [
          self.drag.r[0] + (e.clientX - self.drag.x) * 0.18 / self.zoom,
          Math.max(-89, Math.min(89, self.drag.r[1] - (e.clientY - self.drag.y) * 0.18 / self.zoom)),
          0
        ];
        self.draw();
      };
      this.canvas.onpointerup = this.canvas.onpointercancel = function () { self.drag = null; };
      this.canvas.addEventListener('wheel', function (e) {
        e.preventDefault();
        cancelAnimationFrame(self.anim);
        self.zoom = Math.max(1.05, Math.min(5, self.zoom * Math.exp(-e.deltaY * 0.001)));
        self.draw();
      }, { passive: false });

      this.ro = new ResizeObserver(function () { self.layout(); self.resize(); });
      this.ro.observe(this);
      this.ro.observe(this.canvas.parentElement);
      this.layout();
      this.resize();
    }

    layout() {
      var wrap = this.querySelector('[data-bbn="wrap"]');
      var aside = this.querySelector('[data-bbn="aside"]');
      var map = this.querySelector('[data-bbn="map"]');
      if (!wrap) return;
      var narrow = this.getBoundingClientRect().width < 700;
      if (narrow === this._narrow && this._laidOut === wrap) return;
      this._laidOut = wrap;
      this._narrow = narrow;
      wrap.style.gridTemplateColumns = narrow ? 'minmax(0,1fr)' : 'minmax(0,380px) minmax(0,1fr)';
      aside.style.maxHeight = narrow ? 'none' : '580px';
      aside.style.borderRight = narrow ? 'none' : '1px solid ' + BRD2;
      aside.style.borderBottom = narrow ? '1px solid ' + BRD2 : 'none';
      map.style.minHeight = narrow ? '420px' : '580px';
      var eyebrow = map.querySelector('[data-bbn="maphead"] p');
      if (eyebrow) eyebrow.style.display = narrow ? 'none' : 'block';
      var hint = map.querySelector('[data-bbn="hint"]');
      if (hint) hint.style.display = narrow ? 'none' : 'block';
      var mh = map.querySelector('[data-bbn="maphead"] p:last-child');
      if (mh) mh.style.fontSize = narrow ? '17px' : '24px';
      this.querySelectorAll('[data-bbn="tool"]').forEach(function (b) {
        b.style.minWidth = narrow ? '34px' : '38px';
        b.style.height = narrow ? '34px' : '38px';
        b.style.padding = narrow ? '0 12px' : '0 15px';
        b.style.fontSize = narrow ? '12px' : '13px';
      });
      this.querySelectorAll('[data-bbn="pin"]').forEach(function (b) {
        b.style.fontSize = narrow ? '11px' : '13px';
        b.style.padding = narrow ? '5px 9px' : '7px 13px';
      });
    }

    resize() {
      var r = this.canvas.parentElement.getBoundingClientRect();
      if (!r.width || !r.height) return;
      this.w = r.width; this.h = r.height;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = this.w * dpr;
      this.canvas.height = this.h * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.baseR = Math.min(this.w, this.h) * 0.43;
      this.draw();
    }

    fly(rot, zoom) {
      var self = this;
      cancelAnimationFrame(this.anim);
      var start = performance.now(), from = this.rotation.slice(), fz = this.zoom;
      function step(t) {
        var k = Math.min(1, (t - start) / 650), e = 1 - Math.pow(1 - k, 3);
        self.rotation = from.map(function (x, i) { return x + (rot[i] - x) * e; });
        self.zoom = fz + (zoom - fz) * e;
        self.draw();
        if (k < 1) self.anim = requestAnimationFrame(step);
      }
      this.anim = requestAnimationFrame(step);
    }

    draw() {
      if (!this.w || !this.ctx) return;
      var d3 = window.d3, ctx = this.ctx, w = this.w, h = this.h;
      var cx = w * 0.47, cy = h * 0.53;
      ctx.clearRect(0, 0, w, h);
      this.projection.translate([cx, cy]).scale(this.baseR * this.zoom).rotate(this.rotation);

      ctx.beginPath(); this.path({ type: 'Sphere' });
      ctx.fillStyle = INK; ctx.fill();
      ctx.strokeStyle = 'rgba(232,229,222,0.22)'; ctx.lineWidth = 1; ctx.stroke();

      ctx.save(); ctx.clip();
      ctx.beginPath(); this.path(this.grid);
      ctx.strokeStyle = 'rgba(232,229,222,0.07)'; ctx.lineWidth = 0.5; ctx.stroke();
      window.BB_WORLD.features.forEach(function (f) {
        var rus = f.id === 'RUS';
        ctx.beginPath(); this.path(f);
        ctx.fillStyle = rus ? 'rgba(232,229,222,0.14)' : CARD;
        ctx.fill();
        ctx.strokeStyle = rus ? 'rgba(232,229,222,0.45)' : 'rgba(232,229,222,0.1)';
        ctx.lineWidth = rus ? 1 : 0.6;
        ctx.stroke();
      }, this);
      var shade = ctx.createRadialGradient(w * 0.36, h * 0.33, 10, cx, cy, this.baseR * this.zoom);
      shade.addColorStop(0, 'rgba(0,0,0,0)');
      shade.addColorStop(0.62, 'rgba(0,0,0,0.08)');
      shade.addColorStop(1, 'rgba(0,0,0,0.72)');
      ctx.fillStyle = shade; ctx.fillRect(0, 0, w, h);
      ctx.restore();

      var activeName = this.selected || this.home;
      var visible = [];
      CITIES.forEach(function (c, i) {
        var p = this.projection(c.xy);
        var front = d3.geoDistance(c.xy, [-this.rotation[0], -this.rotation[1]]) < Math.PI / 2;
        var isActive = c.name === activeName;
        var show = front && p[0] > 8 && p[0] < w - 12 && p[1] > 12 && p[1] < h - 20;
        this.pins[i].style.display = show ? 'flex' : 'none';
        if (!show) return;
        var rad = isActive ? 7 : 4.5;
        ctx.beginPath(); ctx.arc(p[0], p[1], rad + (isActive ? 9 : 6), 0, Math.PI * 2);
        ctx.fillStyle = isActive ? 'rgba(255,32,38,0.3)' : 'rgba(232,229,222,0.12)';
        ctx.fill();
        ctx.beginPath(); ctx.arc(p[0], p[1], rad, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? RED : L2;
        ctx.fill();
        if (isActive) { ctx.lineWidth = 2; ctx.strokeStyle = W; ctx.stroke(); }
        visible.push({ i: i, p: p, x: p[0] + 14, y: p[1], active: isActive });
      }, this);

      visible.sort(function (a, b) { return a.y - b.y; });
      for (var n = 0; n < visible.length; n++) {
        var a = visible[n], aw = this.pins[a.i].offsetWidth || 140;
        a.x = Math.max(8, Math.min(w - aw - 8, a.x));
        for (var m = 0; m < n; m++) {
          var b = visible[m], bw = this.pins[b.i].offsetWidth || 140;
          if (a.x < b.x + bw + 6 && a.x + aw + 6 > b.x && a.y - b.y < 32) a.y = b.y + 32;
        }
        a.y = Math.min(h - 46, a.y);
        this.pins[a.i].style.left = a.x + 'px';
        this.pins[a.i].style.top = a.y + 'px';
        ctx.beginPath();
        ctx.moveTo(a.p[0], a.p[1]); ctx.lineTo(a.x, a.y);
        ctx.strokeStyle = a.active ? 'rgba(255,32,38,0.75)' : 'rgba(232,229,222,0.22)';
        ctx.lineWidth = 0.8; ctx.stroke();
      }
      var self = this;
      requestAnimationFrame(function () {
        visible.forEach(function (a) {
          var p = self.pins[a.i], aw = p.offsetWidth;
          if (!aw) return;
          var x = Math.max(8, Math.min(self.w - aw - 8, parseFloat(p.style.left) || 0));
          p.style.left = x + 'px';
        });
      });
    }

    disconnectedCallback() {
      if (this.ro) this.ro.disconnect();
      cancelAnimationFrame(this.anim);
    }
  }

  if (!customElements.get('bb-network')) customElements.define('bb-network', BBNetwork);
})();
