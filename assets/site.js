(()=>{
 'use strict';
 const toggle=document.querySelector('.menu-toggle');
 const nav=document.querySelector('#site-nav');
 if(toggle && nav){
   const close=()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation')};
   toggle.addEventListener('click',()=>{let open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
   nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
   document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 }
 const grid=document.getElementById('work-grid');
 const filterButtons=[...document.querySelectorAll('.filter-button')];
 let posts=[];
 let category='All';
 const placeholder=(filtered=false)=>{
   let box=document.createElement('div');box.className='work-placeholder';
   let symbol=document.createElement('span');symbol.className='work-symbol';symbol.textContent='✳';box.append(symbol);
   let h=document.createElement('h3');h.textContent=filtered?'Nothing in this category yet.':'Something good is cooking.';box.append(h);
   let p=document.createElement('p');p.textContent=filtered?'Choose another category or check back soon.':'Our latest creative projects and studio updates will appear here soon.';box.append(p);return box;
 };
 const buildCard=(post)=>{
   const card=document.createElement('article');card.className='work-card';
   const media=document.createElement('div');media.className='work-photo';
   if(post.image && /^[a-f0-9]{40}\.(jpe?g|png|webp)$/.test(post.image)){
     const img=document.createElement('img');img.loading='lazy';img.src='uploads/'+post.image;img.alt=post.title;media.append(img);
   }else{const mark=document.createElement('div');mark.className='work-placeholder';mark.textContent='COOKIE / CREATIVE';media.append(mark)}
   const meta=document.createElement('div');meta.className='work-meta';const label=document.createElement('span');label.textContent=post.category;const arrow=document.createElement('span');arrow.textContent='↗';meta.append(label,arrow);
   const title=document.createElement('h3');title.textContent=post.title;
   const description=document.createElement('p');description.textContent=post.description;
   card.append(media,meta,title,description);return card;
 };
 const render=()=>{
   if(!grid)return;
   grid.replaceChildren();
   let selection=category==='All'?posts:posts.filter(p=>p.category===category);
   if(!selection.length)grid.append(placeholder(category!=='All'));
   else selection.forEach(p=>grid.append(buildCard(p)));
 };
 filterButtons.forEach(btn=>btn.addEventListener('click',()=>{
   category=btn.dataset.category || 'All';
   filterButtons.forEach(b=>{let active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
   render();
 }));
 if(grid && document.body.dataset.mode!=='github'){
   fetch('api/posts.php',{credentials:'same-origin',cache:'no-store'})
    .then(res=>{if(!res.ok)throw new Error('Portfolio temporarily unavailable');return res.json()})
    .then(data=>{if(!Array.isArray(data))throw new Error('Portfolio format invalid');posts=data.filter(p=>p && typeof p.title==='string' && typeof p.description==='string' && typeof p.category==='string').slice(0,60);render()})
    .catch(()=>{render()});
 }

// Dynamically loaded performance results and approved testimonials (Hostingial only).
const mode=document.body.getAttribute('data-mode')||'hostingial';
const resultGrid=document.querySelector('#results-grid');
const reviewGrid=document.querySelector('#reviews-grid');
function emptyCard(title,message,kind){
 const card=document.createElement('div');card.className='content-empty'+(kind==='review'?' review-empty':'');
 const icon=document.createElement('span');icon.className='empty-symbol';icon.textContent=kind==='review'?'✳':'↗';
 const h=document.createElement('h3');h.textContent=title;const p=document.createElement('p');p.textContent=message;card.append(icon,h,p);return card;
}
function stat(label,value){
 const d=document.createElement('div'),strong=document.createElement('strong'),small=document.createElement('span');
 strong.textContent=value;small.textContent=label;d.append(strong,small);return d;
}
function displayMoney(n){const value=Number(n);return Number.isFinite(value)?'₹'+value.toLocaleString('en-IN',{maximumFractionDigits:2,minimumFractionDigits:2}):'';}
function buildResult(item){
 const card=document.createElement('article');card.className='result-extra-card';
 if(item.image && /^[a-f0-9]{40}\.(jpg|png|webp)$/.test(item.image)){
  const img=document.createElement('img');img.src='uploads/'+item.image;img.alt='Campaign report: '+String(item.title||'Result');img.loading='lazy';card.append(img);
 }
 const tag=document.createElement('span');tag.className='result-card-tag';tag.textContent=String(item.client||'CAMPAIGN RESULT');
 const h=document.createElement('h3');h.textContent=String(item.title||'Campaign');
 const p=document.createElement('p');p.textContent=String(item.description||'');
 card.append(tag,h,p);
 const box=document.createElement('div');box.className='extra-stats';
 if(item.conversations!==null && item.conversations!==undefined)box.append(stat('Conversations',Number(item.conversations).toLocaleString('en-IN')));
 if(item.cost_per_result!==null && item.cost_per_result!==undefined)box.append(stat('Cost / result',displayMoney(item.cost_per_result)));
 if(item.amount_spent!==null && item.amount_spent!==undefined)box.append(stat('Amount spent',displayMoney(item.amount_spent)));
 if(item.reach!==null && item.reach!==undefined)box.append(stat('Reach',Number(item.reach).toLocaleString('en-IN')));
 if(item.impressions!==null && item.impressions!==undefined)box.append(stat('Impressions',Number(item.impressions).toLocaleString('en-IN')));
 if(box.childElementCount)card.append(box);
 return card;
}
function buildReview(item){
 const card=document.createElement('article');card.className='review-card';
 const stars=document.createElement('div');stars.className='review-stars';const rating=Math.min(5,Math.max(1,Number(item.rating)||5));stars.textContent='★'.repeat(rating);stars.setAttribute('aria-label',rating+' out of 5 stars');
 const quote=document.createElement('p');quote.className='review-quote';quote.textContent='“'+String(item.quote||'')+'”';
 const author=document.createElement('div');author.className='review-author';const avatar=document.createElement('span');avatar.className='review-avatar';avatar.textContent=String(item.author||'C').trim().slice(0,1).toUpperCase();
 const holder=document.createElement('div');const name=document.createElement('strong');name.textContent=String(item.author||'Client');const role=document.createElement('small');role.textContent=String(item.company||'Client feedback');holder.append(name,role);author.append(avatar,holder);
 card.append(stars,quote,author);return card;
}
async function loadLiveEntries(path,target,render){
 if(!target)return;
 try{
  const response=await fetch(path,{credentials:'same-origin',cache:'no-store'});if(!response.ok)throw Error('API not available');const items=await response.json();if(!Array.isArray(items))return;
  if(items.length){target.replaceChildren();items.slice(0,24).forEach(item=>target.append(render(item)));}
  if(target===resultGrid && items.length){const label=document.querySelector('#results-count');if(label)label.textContent=items.length+' MORE CAMPAIGN'+(items.length===1?'':'S');}
 }catch(e){/* Keep the public site and default content working without MySQL. */}
}
loadLiveEntries('data/results.json',resultGrid,buildResult);
loadLiveEntries('data/reviews.json',reviewGrid,buildReview);

})();
