// Пересборка списков городов по ТЕКСТУ ссылок. Цепочкой считается любая
// последовательность из 2+ ссылок-городов, разделённых только пробелами.
const API = (() => {
const ORDER=[['Тюмень','tyumen'],['Ижевск','izhevsk'],['Сургут','surgut'],['Нижневартовск','nv'],['Самара','samara'],['Москва','msk'],['Санкт-Петербург','spb']];
const TYU='Brooklyn Bowl - Главный.dc.html';
const pathTo=(slug,inDir)=>{const up=inDir?'../':'';return slug==='tyumen'?encodeURI(up+TYU):up+slug+'/index.dc.html';};
const NAME='(?:Тюмень|Ижевск|Сургут|Нижневартовск|Самара|Москва|Санкт-Петербург)';
const PAD='(?:\\s|&nbsp;|\\u00A0)*';
const A='<a href="[^"]*"[^>]*>'+PAD+NAME+PAD+'<\\/a>';
function fixOrder(t,curSlug,inDir){
  let out=t, pos=0, changed=0;
  while(true){
    const re=new RegExp(A,'g'); re.lastIndex=pos;
    const m=re.exec(out); if(!m) break;
    let start=m.index, end=m.index+m[0].length, count=1;
    while(true){
      const tail=out.slice(end);
      const nx=tail.match(new RegExp('^(\\s*)('+A+')'));
      if(!nx) break;
      end+=nx[0].length; count++;
    }
    if(count<2){ pos=m.index+m[0].length; continue; }
    const style=(m[0].match(/style="([^"]*)"/)||[,''])[1];
    const hov=(m[0].match(/style-hover="([^"]*)"/)||[,''])[1];
    const items=ORDER.filter(([,s])=>s!==curSlug)
      .map(([name,s])=>`<a href="${pathTo(s,inDir)}" style="${style}"${hov?` style-hover="${hov}"`:''}>${name}</a>`).join('');
    out=out.slice(0,start)+items+out.slice(end);
    pos=start+items.length; changed++;
  }
  return { text: out, groups: changed };
}
return { fixOrder, ORDER, pathTo };
})();
