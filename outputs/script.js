const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');

function closeMenu() {
  if (!menuButton || !nav) return;
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

// Bring a restrained 3D letter flip to prominent actions, without changing
// their meaning or affecting the accessible name of the link/button.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-blur-highlight]').forEach(paragraph => {
  if (motionPreference.matches || !('IntersectionObserver' in window)) {
    paragraph.classList.add('is-inview');
    return;
  }
  paragraph.classList.add('blur-highlight-ready');
  const highlightObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      paragraph.classList.add('is-inview');
      highlightObserver.disconnect();
    }
  }, { threshold: 0.25 });
  highlightObserver.observe(paragraph);
});
if (!motionPreference.matches) {
  document.querySelectorAll('.hero-actions .button, .page-cta .button, .home-feature .button, .map-copy .button, .contact-page .button').forEach(control => {
    const textNodes = Array.from(control.childNodes).filter(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim());
    if (!textNodes.length) return;
    const accessibleText = control.getAttribute('aria-label') || control.textContent.replace(/[↗→]/g, '').trim();
    if (!control.hasAttribute('aria-label')) control.setAttribute('aria-label', accessibleText);
    textNodes.forEach(textNode => {
      const textRun = document.createElement('span');
      textRun.className = 'swap-copy';
      textRun.setAttribute('aria-hidden', 'true');
      Array.from(textNode.nodeValue).forEach((character, index) => {
        if (/\s/.test(character)) {
          textRun.append(document.createTextNode(character));
          return;
        }
        const unit = document.createElement('span');
        unit.className = 'swap-letter';
        unit.setAttribute('aria-hidden', 'true');
        unit.style.setProperty('--letter-delay', `${index * 22}ms`);
        const front = document.createElement('span');
        front.className = 'swap-face swap-front';
        front.textContent = character;
        const back = document.createElement('span');
        back.className = 'swap-face swap-back';
        back.textContent = character;
        unit.append(front, back);
        textRun.append(unit);
      });
      textNode.replaceWith(textRun);
    });
    control.classList.add('letter-swap');
  });
}

// A lightweight, accessible Ghost Type treatment for the static homepage.
// Suggestions are curated service labels; the effect does not generate claims.
const ghostHeadline = document.querySelector('.ghost-headline');
if (ghostHeadline && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const liveText = ghostHeadline.querySelector('.ghost-live');
  const phrases = ['Personal goals.', 'Hair restoration.', 'Laser treatments.', 'Cosmetic surgery.'];
  let phraseIndex = 0;
  let timer;
  let started = false;

  const startGhostType = () => {
    if (started) return;
    started = true;
    ghostHeadline.classList.add('is-typing');

    const typePhrase = () => {
      const phrase = phrases[phraseIndex];
      liveText.classList.add('is-suggesting');
      liveText.textContent = '';
      // Softly reveal a suggested completion, then accept it as the new line.
      let index = 0;
      const typeNext = () => {
        liveText.textContent = phrase.slice(0, index);
        index += 1;
        if (index <= phrase.length) {
          timer = window.setTimeout(typeNext, 58);
        } else {
          liveText.classList.remove('is-suggesting');
          liveText.classList.add('is-accepted');
          timer = window.setTimeout(() => {
            liveText.classList.remove('is-accepted');
            let eraseIndex = phrase.length;
            const erase = () => {
              liveText.textContent = phrase.slice(0, eraseIndex--);
              if (eraseIndex >= 0) timer = window.setTimeout(erase, 20);
              else {
                phraseIndex = (phraseIndex + 1) % phrases.length;
                timer = window.setTimeout(typePhrase, 330);
              }
            };
            erase();
          }, 1800);
        }
      };
      typeNext();
    };
    typePhrase();
  };

  if ('IntersectionObserver' in window) {
    const ghostObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        startGhostType();
        ghostObserver.disconnect();
      }
    }, { threshold: 0.35 });
    ghostObserver.observe(ghostHeadline);
  } else startGhostType();
  window.addEventListener('pagehide', () => window.clearTimeout(timer), { once: true });
}

const appointmentForm = document.querySelector('#appointment-form');
if (appointmentForm) {
  appointmentForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!appointmentForm.reportValidity()) return;
    const values = new FormData(appointmentForm);
    const subject = encodeURIComponent('Appointment enquiry — Multani Plastic Surgery Centre');
    const body = encodeURIComponent(
      `Name: ${values.get('name')}\nEmail: ${values.get('email')}\nPhone: ${values.get('phone') || 'Not provided'}\n\nQuery:\n${values.get('query')}`
    );
    window.location.href = `mailto:jangpreetsingh@yahoo.co.in?subject=${subject}&body=${body}`;
  });
}

// Floating AI Doctor: a site-wide, accessible clinic information chat.
(() => {
  if (document.querySelector('.ai-doctor')) return;
  const host = document.createElement('div');
  host.className = 'ai-doctor';
  host.innerHTML = `
    <section class="ai-panel" id="ai-doctor-panel" aria-labelledby="ai-title" aria-hidden="true" inert>
      <header class="ai-panel-head"><div class="ai-mini-orb ai-crystal-host" aria-hidden="true"></div><div><p>CLINIC INFORMATION</p><h2 id="ai-title">AI Doctor</h2></div><button class="ai-close" type="button" aria-label="Close AI Doctor">×</button></header>
      <p class="ai-disclaimer">I’m an AI assistant, not a doctor. I can share general information about this website and the clinic, but I can’t diagnose or recommend treatment. For personal advice, contact the clinic. For urgent symptoms, seek emergency care.</p>
      <div class="ai-messages" role="log" aria-live="polite" aria-relevant="additions text"><p class="ai-message ai-assistant">Hello. I can help you find clinic information or explain the services listed on this website. What would you like to know?</p></div>
      <p class="ai-status" role="status" aria-live="polite"></p>
      <form class="ai-form"><label class="ai-sr-only" for="ai-question">Your question</label><textarea id="ai-question" name="question" rows="1" maxlength="1200" placeholder="Ask a general question…" required></textarea><button type="submit" aria-label="Send question">↑</button></form>
      <p class="ai-privacy">Please don’t share personal or sensitive health details.</p>
    </section>
    <button class="ai-launcher" type="button" aria-expanded="false" aria-controls="ai-doctor-panel"><div class="ai-orb ai-crystal-host" aria-hidden="true"></div><span>AI Doctor</span></button>`;
  document.body.append(host);

  const crystalStyles = document.createElement('link');
  crystalStyles.rel = 'stylesheet';
  crystalStyles.href = 'ai-doctor-icon.css';
  document.head.append(crystalStyles);
  const crystalScript = document.createElement('script');
  crystalScript.src = 'ai-doctor-icon.js';
  crystalScript.defer = true;
  document.body.append(crystalScript);

  const panel = host.querySelector('.ai-panel');
  const launcher = host.querySelector('.ai-launcher');
  const close = host.querySelector('.ai-close');
  const form = host.querySelector('.ai-form');
  const input = host.querySelector('#ai-question');
  const messages = host.querySelector('.ai-messages');
  const status = host.querySelector('.ai-status');
  const history = [];
  let busy = false;

  const setOpen = open => {
    launcher.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    panel.inert = !open;
    host.classList.toggle('is-open', open);
    if (open) input.focus(); else launcher.focus();
  };
  launcher.addEventListener('click', () => setOpen(launcher.getAttribute('aria-expanded') !== 'true'));
  close.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && launcher.getAttribute('aria-expanded') === 'true') setOpen(false); });

  const addMessage = (role, text) => {
    const item = document.createElement('p');
    item.className = `ai-message ai-${role}`;
    item.textContent = text;
    messages.append(item);
    messages.scrollTop = messages.scrollHeight;
  };
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || busy) return;
    busy = true;
    input.value = '';
    addMessage('user', question);
    history.push({ role: 'user', content: question });
    status.textContent = 'Thinking…';
    host.classList.add('is-thinking');
    form.querySelector('button').disabled = true;
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-8) })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'The AI assistant is not connected right now. Please contact the clinic directly.');
      const answer = String(data.answer || '').slice(0, 5000);
      if (!answer) throw new Error('I couldn’t prepare a response. Please try again or contact the clinic.');
      history.push({ role: 'assistant', content: answer });
      addMessage('assistant', answer);
      status.textContent = 'Response ready';
    } catch (error) {
      addMessage('assistant', error.message || 'The AI assistant is unavailable right now. Please contact the clinic directly.');
      status.textContent = 'Assistant unavailable';
    } finally {
      busy = false;
      host.classList.remove('is-thinking');
      form.querySelector('button').disabled = false;
      input.focus();
    }
  });
})();


const currentNavPath = location.pathname.split('/').filter(Boolean).pop() || 'index.html';
nav?.querySelectorAll('a[href]').forEach(link => {
  if (link.getAttribute('href').split('#')[0] === currentNavPath) link.setAttribute('aria-current', 'page');
});
nav?.querySelectorAll('.nav-item').forEach(item => {
  if (item.querySelector(`.nav-dropdown a[href^="${currentNavPath}#"]`)) item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-current', 'page');
});

const dropdownButtons = document.querySelectorAll('.nav-dropdown-toggle');
function closeDropdowns(except) {
  dropdownButtons.forEach(button => {
    if (button === except) return;
    button.setAttribute('aria-expanded', 'false');
    button.closest('.nav-item')?.classList.remove('is-open');
  });
}
dropdownButtons.forEach(button => button.addEventListener('click', () => {
  const willOpen = button.getAttribute('aria-expanded') !== 'true';
  closeDropdowns(button);
  button.setAttribute('aria-expanded', String(willOpen));
  button.closest('.nav-item')?.classList.toggle('is-open', willOpen);
}));
document.addEventListener('click', event => {
  if (!event.target.closest('.main-nav')) closeDropdowns();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeDropdowns();
});
