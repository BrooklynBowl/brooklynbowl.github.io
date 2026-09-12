// Перевод ссылок городов внутрь проекта. Использование:
//   const src = await readFile('_citylinks.js'); const F = (new Function(src+';return API;'))();
//   text = F.fix(text, curSlug, inDir)
const API = (() => {
const ORDER=[['Тюмень','tyumen'],['Ижевск','izhevsk'],['Сургут','surgut'],['Нижневартовск','nv'],['Самара','samara'],['Москва','msk'],['Санкт-Петербург','spb']];
const TYU='Brooklyn Bowl - Главный.dc.html';
const CERT={tyumen:'https://certificate.brooklynbowl.ru/',izhevsk:'https://certificate.iz.brooklynbowl.ru/',surgut:'https://certificate.surgut.brooklynbowl.ru/',nv:'https://certificate.nv.brooklynbowl.ru/',samara:'https://certificate.smr.brooklynbowl.ru/',msk:'https://certificate.msk.brooklynbowl.ru/',spb:'https://certificate.spb.brooklynbowl.ru/'};
const pathTo=(slug,inDir)=>{const up=inDir?'../':'';return slug==='tyumen'?encodeURI(up+TYU):up+slug+'/index.dc.html';};
function fix(t,curSlug,inDir){
  const src='<a href="https?:\\/\\/[^"]*brooklynbowl\\.ru[^"]*"[^>]*>(?:Тюмень|Ижевск|Сургут|Нижневартовск|Самара|Москва|Санкт-Петербург)<\\/a>';
  let out=t,guard=0;
  while(guard++<40){
    const A=new RegExp(src,'g'); const m=A.exec(out); if(!m) break;
    let start=m.index,end=m.index+m[0].length;
    const re=new RegExp(src,'g'); re.lastIndex=end;
    let n; while((n=re.exec(out))&&n.index===end){ end=n.index+n[0].length; re.lastIndex=end; }
    const style=(m[0].match(/style="([^"]*)"/)||[,''])[1];
    const hov=(m[0].match(/style-hover="([^"]*)"/)||[,''])[1];
    out=out.slice(0,start)+ORDER.filter(([,s])=>s!==curSlug).map(([name,s])=>`<a href="${pathTo(s,inDir)}" style="${style}"${hov?` style-hover="${hov}"`:''}>${name}</a>`).join('')+out.slice(end);
  }
  const CERTMARK='@@CERT@@';
  out=out.replace(/https?:\/\/certificate\.[a-z]*\.?brooklynbowl\.ru\/?/g, CERTMARK);
  const map={'iz.brooklynbowl.ru':'izhevsk','surgut.brooklynbowl.ru':'surgut','nv.brooklynbowl.ru':'nv','smr.brooklynbowl.ru':'samara','msk.brooklynbowl.ru':'msk','spb.brooklynbowl.ru':'spb'};
  for(const [dom,slug] of Object.entries(map)) out=out.replace(new RegExp('https?:\\/\\/'+dom.replace(/\./g,'\\.')+'\\/?','g'), pathTo(slug,inDir));
  out=out.replace(/https?:\/\/brooklynbowl\.ru\/?(?![a-zA-Z])/g, pathTo('tyumen',inDir));
  out=out.split(CERTMARK).join(CERT[curSlug]);
  return out;
}
return { fix, ORDER, pathTo };
})();
