const allReels=Array.isArray(window.clinicReels)?window.clinicReels:[];
const videoParams=new URLSearchParams(location.search);
const requestedVideoTopic=videoParams.get('topic');
const topicTitles={'hair-restoration':'Hair restoration','laser':'Laser treatment','cosmetic-surgery':'Cosmetic surgery','reconstructive-surgery':'Reconstructive surgery'};
const videoTopicTitle=topicTitles[requestedVideoTopic]||'';
const relevantReels=videoTopicTitle?allReels.filter(reel=>(reel.topics||[]).includes(requestedVideoTopic)):allReels;
window.clinicReels=relevantReels;
const topicNote=document.querySelector('#video-topic-note');
const topicEmpty=document.querySelector('#video-topic-empty');
const carousel=document.querySelector('#reel-carousel');
if(videoTopicTitle){
  document.title=`${videoTopicTitle} videos | Multani Plastic Surgery Centre`;
  if(topicNote){topicNote.hidden=false;topicNote.textContent=`Videos related to ${videoTopicTitle.toLowerCase()} from the clinic’s public Reels.`;}
  const eyebrow=carousel?.querySelector('.lenticular-toolbar .eyebrow');
  if(eyebrow)eyebrow.textContent=`${videoTopicTitle.toUpperCase()} · ${relevantReels.length} REEL${relevantReels.length===1?'':'S'}`;
  if(relevantReels.length===0){
    carousel.hidden=true;
    if(topicEmpty){topicEmpty.hidden=false;topicEmpty.innerHTML=`<span>No public Reels are currently tagged for ${videoTopicTitle.toLowerCase()}.</span> <a href="videos.html">Browse all clinic videos ↗</a>`;}
  }
}else{
  const eyebrow=carousel?.querySelector('.lenticular-toolbar .eyebrow');
  if(eyebrow)eyebrow.textContent=`${allReels.length} PUBLIC REELS`;
}
if(carousel&&Array.isArray(window.clinicReels)&&window.clinicReels.length){
  const stage=carousel.querySelector('#reel-stage');
  const dots=carousel.querySelector('#reel-dots');
  const count=carousel.querySelector('#reel-count');
  const previous=carousel.querySelector('[data-reel-prev]');
  const next=carousel.querySelector('[data-reel-next]');
  let active=0;
  let startX=null;
  const reelUrl=reel=>`https://www.facebook.com/reel/${reel.id}/`;
  const labelFor=(reel,index)=>reel.title||`Clinic Reel ${String(index+1).padStart(2,'0')}`;
  const videoFrame=(reel,index)=>{
    const frame=document.createElement('iframe');
    frame.title=`Multani Plastic Surgery Centre Facebook Reel ${index+1}: ${labelFor(reel,index)}`;
    frame.dataset.thirdPartySrc=`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(reelUrl(reel))}&show_text=false&height=700&width=394`;
    frame.allow='autoplay; encrypted-media; picture-in-picture; web-share';frame.allowFullscreen=true;frame.loading='eager';frame.referrerPolicy='strict-origin-when-cross-origin';return frame;
  };
  const playButton=(reel,index)=>{
    const button=document.createElement('button');button.type='button';button.className=`lenticular-poster${reel.thumbnail?'':' is-placeholder'}`;button.setAttribute('aria-label',`Load and play ${labelFor(reel,index)} from Facebook`);
    if(reel.thumbnail){const image=document.createElement('img');image.className='lenticular-thumbnail';image.src=reel.thumbnail;image.alt='';image.loading='lazy';image.decoding='async';image.addEventListener('error',()=>image.remove(),{once:true});button.append(image);}else{const note=document.createElement('span');note.className='lenticular-placeholder-note';note.textContent='Facebook preview unavailable · open Reel to watch';button.append(note);}
    const kicker=document.createElement('span');kicker.className='lenticular-kicker';kicker.textContent=`FACEBOOK REEL · ${String(index+1).padStart(2,'0')}`;
    const title=document.createElement('span');title.className='lenticular-title';title.textContent=labelFor(reel,index);
    const play=document.createElement('span');play.className='lenticular-play';play.textContent='Play Reel';button.append(kicker,title,play);
    button.addEventListener('click',()=>{const media=button.closest('.lenticular-media');const frame=videoFrame(reel,index);const choice=localStorage.getItem('multani-third-party-choice-v1');if(choice==='accepted'){frame.src=frame.dataset.thirdPartySrc;frame.removeAttribute('data-third-party-src');media.replaceChildren(frame);media.classList.add('is-playing');return;}if(choice==='declined'){const note=document.createElement('p');note.className='medical-note';note.textContent='Allow optional third-party content in the privacy choices to play this video.';media.replaceChildren(note);return;}media.replaceChildren(frame);media.classList.add('is-playing');},{once:true});return button;
  };
  const makeCard=(index,position)=>{
    const reel=window.clinicReels[index];const card=document.createElement('article');card.className=`lenticular-card is-${position}`;card.setAttribute('aria-hidden',position==='center'?'false':'true');
    if(position!=='center'){const button=document.createElement('button');button.type='button';button.className='lenticular-side';button.setAttribute('tabindex','-1');button.setAttribute('aria-label',`Show ${labelFor(reel,index)}`);if(reel.thumbnail)button.style.setProperty('--reel-thumb',`url("${reel.thumbnail}")`);const title=document.createElement('span');title.textContent=labelFor(reel,index);button.append(title);button.addEventListener('click',()=>{direction=index>=active?'next':'previous';active=index;render();});card.append(button);return card;}
    const media=document.createElement('div');media.className='lenticular-media';media.append(playButton(reel,index));const caption=document.createElement('div');caption.className='lenticular-caption';const title=document.createElement('h2');title.textContent=labelFor(reel,index);const description=document.createElement('p');description.textContent=reel.description||'Open this public Reel to see the clinic’s original caption.';const link=document.createElement('a');link.href=reelUrl(reel);link.target='_blank';link.rel='noopener noreferrer';link.textContent='Open on Facebook ↗';caption.append(title,description,link);card.append(media,caption);return card;
  };
  function render(){stage.replaceChildren();stage.dataset.direction=direction;const total=window.clinicReels.length;const left=(active-1+total)%total,right=(active+1)%total;stage.append(makeCard(left,'left'),makeCard(active,'center'),makeCard(right,'right'));count.textContent=`${String(active+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;dots.replaceChildren();window.clinicReels.forEach((reel,index)=>{const dot=document.createElement('button');dot.type='button';dot.className='reel-dot';dot.setAttribute('aria-label',`Show ${labelFor(reel,index)}`);dot.setAttribute('aria-current',String(index===active));dot.addEventListener('click',()=>{const forward=(index-active+total)%total;direction=forward<=total/2?'next':'previous';active=index;render();});dots.append(dot);});}
  let direction='next';
  const go=delta=>{direction=delta<0?'previous':'next';active=(active+delta+window.clinicReels.length)%window.clinicReels.length;render();};
  previous.addEventListener('click',()=>go(-1));next.addEventListener('click',()=>go(1));stage.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();go(-1)}if(event.key==='ArrowRight'){event.preventDefault();go(1)}});stage.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'||event.pointerType==='pen')startX=event.clientX;});stage.addEventListener('pointerup',event=>{if(startX===null)return;const delta=event.clientX-startX;startX=null;if(Math.abs(delta)>45)go(delta<0?1:-1);});stage.addEventListener('pointercancel',()=>{startX=null;});render();
}
