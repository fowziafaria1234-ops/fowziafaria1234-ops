(() => {
  const header = document.querySelector('.site-header');
  const progress = document.getElementById('pageProgress');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const cursorGlow = document.getElementById('cursorGlow');
  const heroVisual = document.getElementById('heroVisual');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  navToggle?.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  const onScroll = () => {
    const total = document.documentElement.scrollHeight - innerHeight;
    const pct = total > 0 ? (scrollY / total) * 100 : 0;
    if (progress) progress.style.width = `${pct}%`;
    header?.classList.toggle('scrolled', scrollY > 16);

    document.querySelectorAll('.project-panel').forEach(panel => {
      const rect = panel.getBoundingClientRect();
      const center = window.innerHeight * 0.55;
      const offset = (rect.top + rect.height / 2 - center) / window.innerHeight;
      const twist = Math.max(-6, Math.min(6, offset * 10));
      if (!reduceMotion) {
        panel.style.transform = `perspective(1200px) rotateX(${twist * -0.18}deg) rotateZ(${twist * 0.14}deg)`;
      }
    });
  };

  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
    addEventListener('mousemove', (event) => {
      if (!cursorGlow) return;
      cursorGlow.style.opacity = '1';
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    });

    heroVisual?.addEventListener('mousemove', (event) => {
      const box = heroVisual.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      const card = heroVisual.querySelector('.hero-card');
      if (card) card.style.transform = `perspective(1200px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
    });
    heroVisual?.addEventListener('mouseleave', () => {
      const card = heroVisual.querySelector('.hero-card');
      if (card) card.style.transform = '';
    });

    document.querySelectorAll('.tilt-card, .capability-card, .cert-card').forEach(card => {
      card.addEventListener('mousemove', (event) => {
        const box = card.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-3px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  function animateCount(el) {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const duration = reduceMotion ? 1 : 1400;
    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-GB') + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  document.querySelectorAll('[data-count]').forEach((el) => countObserver.observe(el));

  const typedText = document.getElementById('typedText');
  const typedPhrases = [
    'Data quality and validation ☕',
    'KPI dashboards and insight reporting ✨',
    'SQL, Power BI, Excel and Python 📊',
    'Clean stories from complex data 🤎'
  ];

  let phraseIndex = 0;
  let charIndex = typedPhrases[0].length;
  let deleting = true;

  function typeLoop() {
    if (!typedText || reduceMotion) return;
    const phrase = typedPhrases[phraseIndex];
    typedText.textContent = phrase.slice(0, charIndex);

    if (deleting) {
      charIndex -= 1;
      if (charIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % typedPhrases.length;
        setTimeout(typeLoop, 240);
        return;
      }
    } else {
      charIndex += 1;
      if (charIndex > typedPhrases[phraseIndex].length) {
        deleting = true;
        setTimeout(typeLoop, 1500);
        return;
      }
    }
    setTimeout(typeLoop, deleting ? 34 : 58);
  }
  setTimeout(typeLoop, 1400);

  const sections = [...document.querySelectorAll('main section[id]')];
  const links = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -52% 0px' });
  sections.forEach(section => navObserver.observe(section));
})();
