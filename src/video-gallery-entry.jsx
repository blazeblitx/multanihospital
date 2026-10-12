import React, { useCallback, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import AccordionGallery from './AccordionGallery.jsx';
import './video-gallery.css';

const topicTitles = {
  'hair-restoration': 'Hair restoration',
  laser: 'Laser treatment',
  'cosmetic-surgery': 'Cosmetic surgery',
  'reconstructive-surgery': 'Reconstructive surgery'
};

const reelEmbedUrl = id => `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(`https://www.facebook.com/reel/${id}/`)}&show_text=false&height=700&width=394`;

function VideoGallery({ reels }) {
  const pageSize = 5;
  const pageCount = Math.ceil(reels.length / pageSize);
  const [page, setPage] = useState(0);
  const [playingId, setPlayingId] = useState(null);
  const items = useMemo(() => reels.map((reel, index) => ({
    image: reel.thumbnail,
    label: reel.title || `Clinic Reel ${String(index + 1).padStart(2, '0')}`,
    alt: `${reel.title || 'Clinic Reel'} video thumbnail`,
    id: reel.id,
    description: reel.description || 'Learn more about this clinic reel and the topic it covers.'
  })), [reels]);
  const visibleItems = useMemo(() => items.slice(page * pageSize, (page + 1) * pageSize), [items, page]);
  const [activeId, setActiveId] = useState(() => items[Math.min(2, items.length - 1)]?.id);
  const activeItem = items.find(item => item.id === activeId) || visibleItems[Math.min(2, visibleItems.length - 1)];

  const selectPanel = useCallback((_panelIndex, item) => {
    if (item) {
      setActiveId(item.id);
      setPlayingId(current => current && current !== item.id ? null : current);
    }
  }, []);

  const movePage = nextPage => {
    const boundedPage = (nextPage + pageCount) % pageCount;
    const nextItems = items.slice(boundedPage * pageSize, (boundedPage + 1) * pageSize);
    setPage(boundedPage);
    setActiveId(nextItems[Math.min(2, nextItems.length - 1)]?.id);
    setPlayingId(null);
  };

  return (
    <div className="video-gallery-content">
      <div className="video-gallery-accordion">
        <AccordionGallery
          key={page}
          className="video-accordion"
          items={visibleItems}
          defaultIndex={Math.min(2, visibleItems.length - 1)}
          accentColor="#a8e8fb"
          overlayColor="#082a43"
          textColor="#ffffff"
          grayscale
          showLabels
          duration={0.58}
          ease="power3.out"
          parallax={0.35}
          tilt={6}
          stagger={0.05}
          trigger="hover"
          height={440}
          gap={9}
          radius={18}
          expandRatio={0.52}
          onActiveChange={selectPanel}
        />
      </div>

      {activeItem && (
        <article className="video-gallery-description" aria-live="polite">
          <div>
            <p className="eyebrow">SELECTED REEL · {String(items.indexOf(activeItem) + 1).padStart(2, '0')}</p>
            <h2>{activeItem.label}</h2>
            <p className="video-gallery-summary">{activeItem.description}</p>
          </div>
          <button
            className="video-gallery-play"
            type="button"
            aria-expanded={playingId === activeItem.id}
            onClick={() => setPlayingId(current => current === activeItem.id ? null : activeItem.id)}
          >
            <span aria-hidden="true">{playingId === activeItem.id ? '×' : '▶'}</span>
            {playingId === activeItem.id ? 'Close video' : 'Play reel here'}
          </button>
        </article>
      )}

      {activeItem && playingId === activeItem.id && (
        <div className="video-gallery-player" aria-label={`${activeItem.label} video player`}>
          <iframe
            src={reelEmbedUrl(activeItem.id)}
            title={activeItem.label}
            allow="autoplay; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}

      {pageCount > 1 && (
        <div className="video-gallery-controls" aria-label="Choose a reel group">
          <button type="button" className="video-gallery-arrow" onClick={() => movePage(page - 1)} aria-label="Previous group of reels">←</button>
          <div className="video-gallery-pages">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                className="video-gallery-page-dot"
                aria-label={`Show reels ${index * pageSize + 1} to ${Math.min((index + 1) * pageSize, items.length)}`}
                aria-current={page === index ? 'page' : undefined}
                onClick={() => movePage(index)}
              />
            ))}
          </div>
          <span className="video-gallery-page-count" aria-live="polite">{String(page + 1).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}</span>
          <button type="button" className="video-gallery-arrow" onClick={() => movePage(page + 1)} aria-label="Next group of reels">→</button>
        </div>
      )}
      <p className="video-gallery-hint">Select a panel to explore a reel. Press “Play reel here” to watch without leaving this page.</p>
    </div>
  );
}

export function mountVideoGallery() {
  const mount = document.getElementById('video-gallery-root');
  if (!mount) return;

  const allReels = Array.isArray(window.clinicReels) ? window.clinicReels : [];
  const requestedTopic = new URLSearchParams(window.location.search).get('topic');
  const topicTitle = topicTitles[requestedTopic] || '';
  const reels = topicTitle ? allReels.filter(reel => (reel.topics || []).includes(requestedTopic)) : allReels;
  const carousel = document.getElementById('reel-carousel');
  const topicNote = document.getElementById('video-topic-note');
  const emptyMessage = document.getElementById('video-topic-empty');
  const eyebrow = carousel?.querySelector('.lenticular-toolbar .eyebrow');

  if (topicTitle) {
    document.title = `${topicTitle} videos | Multani Plastic Surgery Centre`;
    if (topicNote) {
      topicNote.hidden = false;
      topicNote.textContent = `Videos related to ${topicTitle.toLowerCase()} from the clinic’s public Reels.`;
    }
  }

  if (eyebrow) eyebrow.textContent = `${reels.length} PUBLIC REEL${reels.length === 1 ? '' : 'S'}`;
  if (!reels.length) {
    if (carousel) carousel.hidden = true;
    if (emptyMessage) {
      emptyMessage.hidden = false;
      const link = document.createElement('a');
      link.href = 'videos.html';
      link.textContent = 'Browse all clinic videos ↗';
      emptyMessage.replaceChildren(document.createTextNode(`No public Reels are currently tagged for ${topicTitle.toLowerCase()}. `), link);
    }
    return;
  }

  createRoot(mount).render(<VideoGallery reels={reels} />);
}
