const host=document.querySelector('#blog-grid');
const category=document.querySelector('#blog-category');
const search=document.querySelector('#blog-search');
const params=new URLSearchParams(location.search);
const requestedTopic=params.get('topic');
if(requestedTopic&&category){const match=[...category.options].find(option=>option.value.toLowerCase()===requestedTopic.toLowerCase()||option.textContent.toLowerCase()===requestedTopic.toLowerCase());if(match)category.value=match.value;}
const sourceThumbs={
  'best-plastic-surgeon-in-jalandhar/':'2025/10/mul.jpg',
  'dimple-treatment-power-assisted-liposuction-in-jalandhar/':'2025/02/Multani-Dimple-Treatment-1-768x768.png',
  'burns-treatment/':'2024/09/burns-treatment-horiz-768x120.jpg',
  'maxillofacial-surgery/':'2024/09/Maxillofacial-surgery-768x120.jpg',
  'congenital-anomalies/':'2024/09/congenitalanomalies-horiz-768x120.jpg',
  'hand-micro-vascular-surgery/':'2024/09/handmicrovascular-horiz-768x120.jpg',
  'reconstructive-surgery/':'2024/09/reconstructive-banner-768x120.jpg',
  'vitligo-surgery/':'2024/09/facelift-procedure-horiz-768x120.jpg',
  'facelift-procedure/':'2024/09/facelift-procedure-horiz-768x120.jpg',
  'fat-transfer-procedure/':'2024/09/fat-removal-banner-768x120.jpg',
  'blepharoplasty-eyelid-surgery/':'2024/09/Eyelid-banner-horiz-768x120.jpg',
  'scar-revision/':'2024/09/fat-removal-banner-768x120.jpg',
  'rhinoplasty-or-nose-job/':'2024/09/fat-removal-banner-768x120.jpg',
  'abdominoplastytummy-tuck/':'2024/09/fat-removal-banner-768x120.jpg',
  'liposuction/':'2024/09/fat-removal-banner-768x120.jpg',
  'fractional-co2-laser/':'2024/09/laser-banner-768x120.jpg',
  'mesotherapy/':'2024/09/hair-banner-1-768x120.jpg',
  'low-level-laser-therapy/':'2024/09/hair-banner-1-768x120.jpg',
  'hair-reduction/':'2024/09/laser-banner-768x120.jpg',
  'prp-therapy/':'2024/09/hair-banner-1-768x120.jpg',
  'fue-hair-transplant/':'2024/09/hair-banner-768x120.jpg'
};
const sourceMediaRoot='https://flash-bb8b5f50.mileswebhosting.com/wp-content/uploads/';
const archiveNav=document.querySelector('#archive-month-links');
const monthLabel=post=>new Intl.DateTimeFormat('en',{month:'long',year:'numeric'}).format(new Date(post.date+' 12:00:00'));
const monthId=label=>'archive-'+label.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
function renderPosts(){
  const selected=category.value;
  const query=search.value.trim().toLowerCase();
  const posts=window.blogPosts.filter(post=>(selected==='all'||post.category===selected)&&(!query||(post.title+' '+post.summary+' '+post.category).toLowerCase().includes(query)));
  host.replaceChildren();
  const groups=new Map();
  posts.forEach(post=>{const label=monthLabel(post);if(!groups.has(label))groups.set(label,[]);groups.get(label).push(post);});
  if(archiveNav){archiveNav.replaceChildren();groups.forEach((_,label)=>{const link=document.createElement('a');link.href='#'+monthId(label);link.textContent=label;archiveNav.append(link);});}
  groups.forEach((items,label)=>{
    const section=document.createElement('section');section.className='archive-month';section.id=monthId(label);section.setAttribute('aria-labelledby',monthId(label)+'-title');
    const heading=document.createElement('h2');heading.id=monthId(label)+'-title';heading.textContent=label;
    const list=document.createElement('div');list.className='archive-post-list';
    items.forEach(post=>{
    const card=document.createElement('article');card.className='blog-card reveal visible';
    const thumbnail=sourceThumbs[post.url];
    if(thumbnail){
      const imageLink=document.createElement('a');imageLink.className='blog-thumbnail-link';imageLink.href='https://flash-bb8b5f50.mileswebhosting.com/'+post.url;imageLink.target='_blank';imageLink.rel='noopener noreferrer';imageLink.setAttribute('aria-label',`Open ${post.title} on the original website`);
      const image=document.createElement('img');image.className='blog-thumbnail';image.src=sourceMediaRoot+thumbnail;image.alt='';image.loading='lazy';image.decoding='async';
      imageLink.append(image);card.append(imageLink);
    }
    const tag=document.createElement('span');tag.className='blog-category';tag.textContent=post.category;
    const time=document.createElement('time');time.className='blog-date';time.textContent=post.date;
    const heading=document.createElement('h2');const titleLink=document.createElement('a');titleLink.href='https://flash-bb8b5f50.mileswebhosting.com/'+post.url;titleLink.target='_blank';titleLink.rel='noopener noreferrer';titleLink.textContent=post.title;heading.append(titleLink);
    const excerpt=document.createElement('p');excerpt.textContent=post.summary;
    const link=document.createElement('a');link.className='blog-read';link.href=titleLink.href;link.target='_blank';link.rel='noopener noreferrer';link.innerHTML='Read full article <span aria-hidden="true">↗</span>';
    const summaryLink=document.createElement('a');summaryLink.className='blog-summary';summaryLink.href='article.html?slug='+encodeURIComponent(post.url);summaryLink.textContent='Quick summary';
    card.append(tag,time,heading,excerpt,link,summaryLink);list.append(card);
    });
    section.append(heading,list);host.append(section);
  });
  document.querySelector('#blog-count').textContent=posts.length+' '+(posts.length===1?'article':'articles');
  document.querySelector('#blog-empty').hidden=posts.length>0;
}
category.addEventListener('change',renderPosts);search.addEventListener('input',renderPosts);renderPosts();
