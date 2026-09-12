// Единый стандарт CTA-кнопок: padding 16/32, 14px, 800, letter-spacing .05em
const API = (() => {
const CTA=/^(?:БРОНЬ|ЗАБРОНИРОВАТЬ|БРОНИРОВАТЬ|ПОДРОБНЕЕ|КУПИТЬ|СКАЧАТЬ|ОСТАВИТЬ|ОТПРАВИТЬ|СМОТРЕТЬ|НА ГЛАВНУЮ|ХОЧУ|ЗАПРОСИТЬ|ПОЗВОНИТЬ|ЗАКАЗАТЬ|УЗНАТЬ|ОТКРЫТЬ|ВЫБРАТЬ)/i;
function norm(t){
  let count=0;
  const re=/<(a|button)\b([^>]*)>([\s\S]{0,400}?)<\/\1>/g;
  const out=t.replace(re,(m,tag,attrs,inner)=>{
    const st=(attrs.match(/style="([^"]*)"/)||[,''])[1];
    if(!/border-radius:300px/.test(st)) return m;
    if(!/background:\s*(#FF2026|#fff\b|#ffffff)/i.test(st)) return m;
    const txt=inner.replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').trim();
    if(!CTA.test(txt)) return m;
    let s=st;
    s=/padding:/.test(s)? s.replace(/padding:[^;]+;?/,'padding:16px 32px;') : s+' padding:16px 32px;';
    s=/font-size:/.test(s)? s.replace(/font-size:[^;]+;?/,'font-size:14px;') : s+' font-size:14px;';
    s=/font-weight:/.test(s)? s.replace(/font-weight:[^;]+;?/,'font-weight:800;') : s+' font-weight:800;';
    s=/letter-spacing:/.test(s)? s.replace(/letter-spacing:[^;]+;?/,'letter-spacing:0.05em;') : s+' letter-spacing:0.05em;';
    count++;
    return `<${tag}${attrs.replace(/style="[^"]*"/,'style="'+s+'"')}>${inner}</${tag}>`;
  });
  return {text:out,count};
}
return { norm };
})();
