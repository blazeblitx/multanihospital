const params = new URLSearchParams(window.location.search);
const requestedSlug = params.get('slug') || '';
const article = window.blogPosts.find(post => post.url === requestedSlug);
const content = document.querySelector('#article-content');
const sourceLink = document.querySelector('#source-link');
if (article) {
  document.title = `${article.title} | Multani Plastic Surgery Centre`;
  document.querySelector('meta[name="description"]').content = article.summary;
  document.querySelector('#crumb-title').textContent = article.title;
  const category = document.createElement('p');
  category.className = 'eyebrow';
  category.textContent = article.category.toUpperCase();
  const date = document.createElement('time');
  date.className = 'blog-date';
  date.textContent = article.date;
  const title = document.createElement('h1');
  title.textContent = article.title;
  const summary = document.createElement('p');
  summary.className = 'article-summary';
  summary.textContent = article.summary;
  content.replaceChildren(category, date, title, summary);
  sourceLink.href = `https://flash-bb8b5f50.mileswebhosting.com/${article.url}`;
} else {
  document.title = 'Article not found | Multani Plastic Surgery Centre';
  document.querySelector('#crumb-title').textContent = 'Not found';
  content.innerHTML = '<p class="eyebrow">JOURNAL</p><h1>We couldn’t find that article.</h1><p class="article-summary">Choose another article from the complete journal archive.</p><a class="button button-dark" href="blogs.html">Browse all 28 articles <span>↗</span></a>';
  sourceLink.hidden = true;
}
