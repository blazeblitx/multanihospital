(() => {
  const key = 'multani-third-party-choice-v1';
  const state = { choice: localStorage.getItem(key) || '' };
  const addStyles = () => {
    if (document.getElementById('consent-style')) return;
    const style = document.createElement('link'); style.id = 'consent-style'; style.rel = 'stylesheet'; style.href = 'consent.css'; document.head.append(style);
  };
  addStyles();
  const activate = () => {
    document.querySelectorAll('[data-third-party-src]').forEach(frame => {
      frame.src = frame.dataset.thirdPartySrc;
      frame.removeAttribute('data-third-party-src');
    });
    document.body.classList.add('third-party-accepted');
  };
  const banner = () => {
    addStyles();
    if (document.querySelector('.consent-banner')) return;
    const box = document.createElement('section'); box.className = 'consent-banner'; box.setAttribute('aria-label', 'Privacy choices');
    box.innerHTML = '<div><strong>Choose optional third-party content</strong><p>Maps, videos and social media may share connection data with their providers. <a href="cookies.html">Cookie policy</a> · <a href="privacy.html">Privacy policy</a></p></div><div class="consent-actions"><button type="button" data-choice="declined">Decline optional content</button><button type="button" data-choice="accepted">Allow optional content</button></div>';
    box.addEventListener('click', event => {
      const choice = event.target.closest('[data-choice]')?.dataset.choice; if (!choice) return;
      localStorage.setItem(key, choice); state.choice = choice; box.remove();
      if (choice === 'accepted') activate(); else document.body.classList.add('third-party-declined');
    });
    document.body.append(box);
  };
  addStyles();
  const choice = state.choice;
  if (choice === 'accepted') activate();
  else {
    document.querySelectorAll('iframe[data-third-party-src]').forEach(frame => {
      const note = frame.parentElement.querySelector('[data-consent-placeholder]');
      if (note) note.hidden = false;
    });
    if (choice === 'declined') document.body.classList.add('third-party-declined');
    else banner();
  }
})();
