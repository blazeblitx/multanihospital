(() => {
  const profiles = {
    facebook: 'https://www.facebook.com/multaniplasticsurgerycentre/',
    instagram: 'https://www.instagram.com/multaniplasticsurgerycentre/'
  };

  const safeExternalUrl = value => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : '';
    } catch { return ''; }
  };

  const createPostCard = post => {
    const url = safeExternalUrl(post.url);
    if (!url) return null;
    const card = document.createElement('a');
    card.className = 'social-post-card';
    card.href = url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    const imageUrl = safeExternalUrl(post.image);
    if (imageUrl) {
      const image = document.createElement('img');
      image.src = imageUrl;
      image.alt = '';
      image.loading = 'lazy';
      image.addEventListener('error', () => image.remove(), { once: true });
      card.append(image);
    }
    const content = document.createElement('span');
    content.className = 'social-post-copy';
    const source = document.createElement('span');
    source.className = 'eyebrow';
    source.textContent = `LATEST ON ${String(post.platform || 'SOCIAL').toUpperCase()}`;
    const caption = document.createElement('span');
    caption.className = 'social-post-caption';
    caption.textContent = post.caption || 'A recent update from the clinic.';
    const date = document.createElement('time');
    date.className = 'social-post-date';
    if (post.timestamp && !Number.isNaN(Date.parse(post.timestamp))) {
      date.dateTime = post.timestamp;
      date.textContent = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(post.timestamp));
    }
    const link = document.createElement('span');
    link.className = 'social-post-link';
    link.textContent = 'View post ↗';
    content.append(source, caption, date, link);
    card.append(content);
    return card;
  };

  const loadFeed = async () => {
    try {
      const response = await fetch('/api/social-feed', { cache: 'no-store' });
      if (!response.ok) return null;
      return await response.json();
    } catch { return null; }
  };

  const renderHomepageHighlight = (feed) => {
    const root = document.querySelector('#home-social-highlight');
    if (!root || !feed?.connected || !feed.posts?.length) return;
    const latest = createPostCard(feed.posts[0]);
    if (!latest) return;
    root.querySelector('[data-social-highlight-card]')?.replaceChildren(latest);
    root.hidden = false;
  };

  const renderSocialPage = (feed) => {
    const root = document.querySelector('#social-feed-root');
    if (!root) return;
    const posts = feed?.connected ? (feed.posts || []) : [];
    const profiles = feed?.profiles || {};
    const facebook = root.querySelector('[data-social-profile="facebook"]');
    const instagram = root.querySelector('[data-social-profile="instagram"]');
    if (facebook) facebook.href = safeExternalUrl(profiles.facebook) || profiles.facebook || 'https://www.facebook.com/multaniplasticsurgerycentre/';
    if (instagram) instagram.href = safeExternalUrl(profiles.instagram) || profiles.instagram || 'https://www.instagram.com/multaniplasticsurgerycentre/';
    const grid = root.querySelector('[data-social-posts]');
    const status = root.querySelector('[data-social-status]');
    if (!feed?.connected) {
      status.textContent = 'Follow the clinic on Facebook or Instagram for its latest updates.';
      return;
    }
    if (!posts.length) {
      status.textContent = 'There are no recent public posts to show right now. Follow the clinic for updates.';
      return;
    }
    status.textContent = 'Recent public posts from the clinic’s Facebook Page and Instagram account.';
    posts.forEach(post => {
      const card = createPostCard(post);
      if (card) grid.append(card);
    });
  };

  const refresh = async () => {
    const feed = await loadFeed();
    renderHomepageHighlight(feed);
    renderSocialPage(feed);
  };

  refresh();
  if (document.querySelector('#home-social-highlight')) window.setInterval(refresh, 5 * 60 * 1000);
})();
