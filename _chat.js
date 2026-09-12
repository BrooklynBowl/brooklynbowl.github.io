/* Чат для гостей Brooklyn Bowl — точка подключения оператора.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ ЗДЕСЬ ПОДСТАВЛЯЕТСЯ ВЕБХУК ОТКРЫТОЙ ЛИНИИ БИТРИКС 24.                    │
 * │                                                                          │
 * │ 1. В Битриксе: Приложения → Вебхуки → «Входящий вебхук», права imopenlines│
 * │    и imconnector. Получится адрес вида                                   │
 * │    https://<портал>.bitrix24.ru/rest/<id>/<токен>/                       │
 * │ 2. Вписать его в BB_CHAT_CONFIG.webhook ниже (или задать до загрузки     │
 * │    этого файла: window.BB_CHAT_CONFIG = { webhook: '…', lineId: '1' }).  │
 * │ 3. Раскомментировать блок «боевая отправка» в sendToOperator.            │
 * │                                                                          │
 * │ Пока webhook пустой — чат работает в демо-режиме и отдаёт автоответ.     │
 * └──────────────────────────────────────────────────────────────────────────┘
 */
window.BB_CHAT_CONFIG = Object.assign({
  webhook: '',            // ← адрес входящего вебхука Битрикс 24
  lineId: '',             // ← id открытой линии (Контакт-центр → Открытые линии)
  method: 'imopenlines.session.start',
  autoReply: 'Спасибо! Оператор ответит в ближайшее время.',
  city: ''                // для оператора: из какого города пришло сообщение
}, window.BB_CHAT_CONFIG || {});

/**
 * Отправляет сообщение гостя оператору.
 * @param {string} text     текст гостя
 * @param {object} [meta]   { city, page, guestId } — контекст для оператора
 * @returns {Promise<string>} текст ответа, который показать в чате
 */
window.sendToOperator = function sendToOperator(text, meta) {
  var cfg = window.BB_CHAT_CONFIG;
  var payload = {
    message: String(text || '').trim(),
    city: (meta && meta.city) || cfg.city || '',
    page: (meta && meta.page) || (location ? location.pathname : ''),
    guestId: (meta && meta.guestId) || '',
    at: new Date().toISOString()
  };

  if (!payload.message) return Promise.resolve('');

  // ── Боевая отправка в Битрикс 24. Раскомментировать, когда появится вебхук. ──
  // if (cfg.webhook) {
  //   return fetch(cfg.webhook + cfg.method, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       USER_CODE: payload.guestId,
  //       CONFIG_ID: cfg.lineId,
  //       MESSAGE: payload.message,
  //       PARAMS: { CITY: payload.city, PAGE: payload.page }
  //     })
  //   })
  //     .then(function (r) { return r.json(); })
  //     .then(function (r) {
  //       if (r && r.error) throw new Error(r.error_description || r.error);
  //       return (r && r.result && r.result.reply) || cfg.autoReply;
  //     })
  //     .catch(function () {
  //       return 'Не получилось отправить сообщение. Позвоните нам — ответим сразу.';
  //     });
  // }

  // Демо-режим: вебхука нет, отдаём автоответ с небольшой задержкой.
  return new Promise(function (resolve) {
    setTimeout(function () { resolve(cfg.autoReply); }, 700);
  });
};
