// Единый компонент кнопки: помечает CTA атрибутом data-m="cta" и внедряет канон-CSS.
const API = (() => {
const CTA=/^(?:БРОНЬ|ЗАБРОНИРОВАТЬ|БРОНИРОВАТЬ|ПОДРОБНЕЕ|КУПИТЬ|СКАЧАТЬ|ОСТАВИТЬ|ОТПРАВИТЬ|СМОТРЕТЬ|НА ГЛАВНУЮ|ХОЧУ|ЗАПРОСИТЬ|ПОЗВОНИТЬ|ЗАКАЗАТЬ|УЗНАТЬ|ОТКРЫТЬ|ВЫБРАТЬ|ВСЕ АКЦИИ|ВСЕ СОБЫТИЯ|ПОСТРОИТЬ|ОФОРМИТЬ|ОРГАНИЗОВАТЬ|ОБСУДИТЬ|ЧИТАТЬ|БЕГУ|УЧАСТВУЮ|ВСЁ МЕНЮ|В КОРЗИНУ)/i;
const MARK='/* BB-BUTTON-COMPONENT v2 */';
const CSS = MARK + `
[data-m="cta"]{
  display:inline-flex !important; align-items:center !important; justify-content:center !important;
  box-sizing:border-box !important; height:52px !important; min-height:52px !important;
  min-width:260px !important; padding:0 32px !important; border:none !important; border-radius:300px !important;
  font-family:inherit !important; font-size:14px !important; font-weight:800 !important;
  letter-spacing:0.05em !important; line-height:1 !important; text-transform:uppercase !important;
  text-decoration:none !important; white-space:nowrap !important; cursor:pointer !important;
  background:#FF2026 !important; color:#FFFFFF !important;
  transition:background-color .2s ease, color .2s ease !important;
}
[data-m="cta"]:hover{ background:#FFFFFF !important; color:#FF2026 !important; }
/* на красной подложке — белая кнопка с чёрным текстом */
[data-m="ev-hero"] [data-m="cta"],
[style*="background:#FF2026"] [data-m="cta"],
[style*="background: #FF2026"] [data-m="cta"]{ background:#FFFFFF !important; color:#000000 !important; }
[data-m="ev-hero"] [data-m="cta"]:hover,
[style*="background:#FF2026"] [data-m="cta"]:hover,
[style*="background: #FF2026"] [data-m="cta"]:hover{ background:#000000 !important; color:#FFFFFF !important; }
/* группа кнопок — равная ширина по самой длинной */
[data-m="cta-row"]{ display:grid !important; grid-auto-flow:column !important; grid-auto-columns:1fr !important; width:fit-content !important; max-width:100% !important; gap:14px !important; align-items:stretch !important; }
@media (max-width:768px){
  [data-m="cta"]{ width:100% !important; min-width:0 !important; padding:0 20px !important; }
  [data-m="cta-row"]{ grid-auto-flow:row !important; grid-auto-columns:auto !important; width:100% !important; }
}
/* 769–1180px: в хедере не хватает ширины на кнопку 260px — снимаем минимум, чтобы не срезало */
@media (min-width:769px) and (max-width:1180px){
  header [data-m="cta"]{ min-width:0 !important; padding:0 20px !important; flex:0 1 auto !important; }
  [data-m="cta-row"] [data-m="cta"]{ min-width:0 !important; padding:0 20px !important; }
  header{ min-width:0 !important; gap:18px !important; padding-left:20px !important; padding-right:20px !important; }
  header > *{ min-width:0 !important; }
  header > *:last-child{ flex:0 1 auto !important; gap:12px !important; }
  header nav{ flex:0 1 auto !important; overflow:hidden !important; }
}
@media (min-width:769px) and (max-width:1040px){
  header a[href^="tel:"]{ display:none !important; }
}
`;
function tag(t){
  let count=0;
  const out=t.replace(/<(a|button)\b([^>]*)>([\s\S]{0,400}?)<\/\1>/g,(m,tg,attrs,inner)=>{
    const st=(attrs.match(/style="([^"]*)"/)||[,''])[1];
    if(!/border-radius:300px/.test(st)) return m;
    if(!/background:\s*(#FF2026|#fff\b|#ffffff|#0B0B0C)/i.test(st)) return m;
    const txt=inner.replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').trim();
    if(!CTA.test(txt)) return m;
    if(/data-m="cta"/.test(attrs)){count++; return m;}
    count++;
    return `<${tg} data-m="cta"${attrs}>${inner}</${tg}>`;
  });
  return {text:out,count};
}
function css(t){
  if(t.includes(MARK)) return {text:t,added:false};
  // убрать прежние конфликтующие правила компонента
  let out=t.replace(/\[data-m="cta"\]\{[^}]*\}/g,'');
  out=out.replace('</style>',CSS+'</style>');
  return {text:out,added:true};
}
function apply(t){ const a=tag(t); const b=css(a.text); return {text:b.text,count:a.count,css:b.added}; }
return { apply, tag, css, MARK };
})();
