/* BB-TICKETSCLOUD — токены виджета продажи билетов.
   В разметке ссылка кнопки «Купить билеты» имеет вид:
     href="#ticketscloud:event=<ID события>&token=<токен>&lang=ru"
   (в HTML амперсанд экранирован: &amp;)
   ОБЯЗАТЕЛЬНО: на каждой странице с такой ссылкой подключён скрипт виджета —
     <script src="https://ticketscloud.com/static/scripts/widget/tcwidget.js" async></script>
   (блок <!-- BB-TICKETSCLOUD --> в helmet). Без него ссылка не работает. */

const TC_TOKEN_1 = 'eyJhbGciOiJIUzI1NiIsImlzcyI6InRpY2tldHNjbG91ZC5ydSIsInR5cCI6IkpXVCJ9.eyJwIjoiNjhiNzIxYzc0ODI2NGNkMmUyZDQxYTg0In0.nr97Rk8NvVfGVPthTeMBFps54C8ZGGWRXQgFEgsxJ_g';
const TC_TOKEN_2 = 'eyJhbGciOiJIUzI1NiIsImlzcyI6InRpY2tldHNjbG91ZC5ydSIsInR5cCI6IkpXVCJ9.eyJwIjoiNjdjMDIxMWRlYTYzNmJjNzczZTA3YTYzIn0.yUJ_XkWnEUFlKLHx1AnaMsyQTczj5xztaKKognCKakE';
const TC_TOKEN_3 = 'eyJhbGciOiJIUzI1NiIsImlzcyI6InRpY2tldHNjbG91ZC5ydSIsInR5cCI6IkpXVCJ9.eyJwIjoiNjdkY2QyZmNmMDQwZDcwNWY3OGYwMTE4In0.reJoBEmDrBuFkpCmpL0GdN825wLXVpgdlcUjmfj9Tks';

/* Карта событий: город → площадка → артист, дата, id события, токен, страница */
const TC_EVENTS = [
  { city: 'Тюмень',         venue: 'СитиМолл',   artist: 'Заур Туганов',          date: '06.08', id: '6a206014a0d22b9db4491bfa', token: TC_TOKEN_1, page: null /* события нет в афише — ждём добавления */ },
  { city: 'Нижневартовск',  venue: 'ЮГРАМолл',   artist: 'Концерт комиков ХМАО',  date: '24.09', id: '6a5892e114b9c91dea0368cc', token: TC_TOKEN_1, page: 'nv/bigstandup.dc.html' },
  { city: 'Ижевск',         venue: 'Петровский', artist: 'Валера Киракосьян',     date: '17.09', id: '6a589b6bca5b2e89e2a315d2', token: TC_TOKEN_1, lang: 'ru', page: 'izhevsk/kirakosyan.dc.html' },
  { city: 'Нижневартовск',  venue: 'ЮГРАМолл',   artist: 'Валера Киракосьян',     date: '08.10', id: '6a589ea6b0f350d99244dce4', token: TC_TOKEN_1, lang: 'ru', page: 'nv/kirakosyan.dc.html' },
  { city: 'Сургут',         venue: 'Аура',       artist: 'Самвел Гиновян',        date: '24.09', id: '69e7edabd82a671f18ca633b', token: TC_TOKEN_3, lang: 'ru', page: 'surgut/ginovyan.dc.html' },
  { city: 'Самара',         venue: 'Гудок',      artist: 'Заур Туганов',          date: '08.10', id: '6a3974c737755bcbc2e26793', token: TC_TOKEN_1, page: 'samara/tuganov.dc.html' },
  { city: 'Ижевск',         venue: 'Петровский', artist: 'Заур Туганов',          date: '22.10', id: '6a54d8588c248518de7c7bfb', token: TC_TOKEN_1, page: 'izhevsk/tuganov.dc.html' },
  { city: 'Нижневартовск',  venue: 'ЮГРАМолл',   artist: 'Виктор Комаров',        date: '21.10', id: '69ef5d9defbbf6b1d3222875', token: TC_TOKEN_2, page: 'nv/komarov.dc.html' },
  { city: 'Сургут',         venue: 'Аура',       artist: 'Виктор Комаров',        date: '22.10', id: '6889e803fcc9681177b426be', token: TC_TOKEN_2, page: 'surgut/komarov.dc.html' },
  { city: 'Сургут',         venue: 'Аура',       artist: 'Наташа Краснова',       date: '12.11', id: '6a6b52786409eacb67f5d52b', token: TC_TOKEN_3, page: 'surgut/krasnova.dc.html' }
];

/* Яндекс.Афиша: база + обязательный clientKey */
const YA_BASE = 'https://widget.afisha.yandex.ru/w/sessions/';
const YA_CLIENT_KEY = '97f017e2-6485-4c9e-a646-b78099db6e51';
const ya = id => YA_BASE + id + '?clientKey=' + YA_CLIENT_KEY;

const YA_EVENTS = [
  { city: 'Тюмень',        venue: 'Остров',    artist: 'Маргарита Родина',  date: '16.09', url: ya('MTAyMzU4fDc2NzU3N3wxMzE5Njk3OHwxNzg5NTcwODAwMDAw'),   page: 'rodina.dc.html' },
  { city: 'Самара',        venue: 'Летаут',    artist: 'Маргарита Родина',  date: '17.09', url: ya('ODY0NDl8ODM4MDQzfDk1Mzg1NDF8MTc4OTY2MDgwMDAwMA=='), page: 'samara/rodina.dc.html' },
  { city: 'Ижевск',        venue: 'Петровский', artist: 'Маргарита Родина', date: '07.10', url: ya('ODgzMzR8Njk2MjYwfDEzNDgwNTQyfDE3OTEzODg4MDAwMDA='),  page: 'izhevsk/rodina.dc.html' },
  { city: 'Сургут',        venue: 'Аура',      artist: 'Надежда Ангарская', date: '08.10', url: ya('ODYyNzZ8ODM4MDgyfDk1MTM4OTl8MTc5MTQ3MTYwMDAwMA=='), page: 'surgut/angarskaya.dc.html' },
  { city: 'Тюмень',        venue: 'СитиМолл',  artist: 'Маргарита Родина',  date: '21.10', url: ya('ODYxNjd8Njk2MjMzfDk0ODI4MTd8MTc5MjU5NDgwMDAwMA=='), page: 'rodinaa.dc.html' },
  { city: 'Санкт-Петербург', venue: 'Июнь',    artist: 'Маргарита Родина',  date: '22.10', url: ya('OTI5NTd8ODM4MDc1fDExMDM5NTAwfDE3OTI2ODg0MDAwMDA='),  page: null /* события нет в афише СПб — ждём добавления */ },
  { city: 'Самара',        venue: 'Летаут',    artist: 'Камиль Зулфугаров', date: '11.11', url: ya('OTQ1MDZ8ODM3OTk3fDExMzY0NTI1fDE3OTQ0MTI4MDAwMDA='),  page: 'samara/zulfugarov.dc.html' },
  { city: 'Тюмень',        venue: 'Остров',    artist: 'Камиль Зулфугаров', date: '12.11', url: ya('MTAyMzU4fDgzODAwMnwxMzE5Njk3OHwxNzk0NDk1NjAwMDAw'),   page: 'zulfugarov.dc.html' },
  { city: 'Сургут',        venue: 'Аура',      artist: 'Егор Свирский',     date: '18.11', url: ya('ticketsteam-10084@66600257'),                      page: 'surgut/svirsky.dc.html' },
  { city: 'Нижневартовск', venue: 'ЮГРАМолл',  artist: 'Егор Свирский',     date: '19.11', url: ya('ticketsteam-10084@66630220'),                      page: 'nv/svirsky.dc.html' },
  { city: 'Тюмень',        venue: 'СитиМолл',  artist: 'Антон Борисов',     date: '25.11', url: ya('ODYxNjd8ODM4MDExfDk0ODI4MTd8MTc5NTYxODgwMDAwMA=='), page: 'borisov.dc.html' },
  { city: 'Нижневартовск', venue: 'ЮГРАМолл',  artist: 'Антон Борисов',     date: '26.11', url: ya('ODYxNjB8ODM4MDE4fDEwNDM3ODI3fDE3OTU3MDUyMDAwMDA='), page: 'nv/borisov.dc.html' }
];

/* gostandup.ru — своя площадка продажи */
const GOSTANDUP_EVENTS = [
  { city: 'Москва', artist: 'Валерия Яковлева', date: '01.10', url: 'https://gostandup.ru/moscow/events/valeriya_yakovleva_stendap_koncert/id112744', page: 'msk/yakovleva.dc.html' },
  { city: 'Ижевск', artist: 'Валерия Яковлева', date: '26.11', url: 'https://gostandup.ru/ijevsk/events/valeriya_yakovleva_stendap_koncert',          page: 'izhevsk/yakovleva.dc.html' }
];

/* Филипп Воронин (Ижевск, 15.10) — Яндекс.Афиша со СВОИМ clientKey и параметрами,
   не общим: clientKey=bb40c7f4-11ee-4f00-9804-18ee56565c87&embed=true&widgetName=w2&lang=ru */
const VORONIN_URL = 'https://widget.afisha.yandex.ru/w/sessions/ODUwODV8ODY2NjE5fDEzNDgwNTM5fDE3OTIwODAwMDAwMDA=?clientKey=bb40c7f4-11ee-4f00-9804-18ee56565c87&embed=true&widgetName=w2&lang=ru';

/* Все кнопки билетов закрыты — пустых заготовок не осталось. */

if (typeof window !== 'undefined') {
  window.TC_TOKEN_1 = TC_TOKEN_1;
  window.TC_TOKEN_2 = TC_TOKEN_2;
  window.TC_TOKEN_3 = TC_TOKEN_3;
  window.TC_EVENTS = TC_EVENTS;
  window.YA_EVENTS = YA_EVENTS;
  window.GOSTANDUP_EVENTS = GOSTANDUP_EVENTS;
}
