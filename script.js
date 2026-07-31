(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const progress = document.getElementById('pageProgress');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const themeToggle = document.getElementById('themeToggle');
  const cursorGlow = document.getElementById('cursorGlow');
  const heroVisual = document.getElementById('heroVisual');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const savedTheme = localStorage.getItem('faria-theme');
  if (savedTheme) root.dataset.theme = savedTheme;

  themeToggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    localStorage.setItem('faria-theme', next);
  });

  navToggle?.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  const handleScroll = () => {
    const total = document.documentElement.scrollHeight - innerHeight;
    const percentage = total > 0 ? (scrollY / total) * 100 : 0;
    progress.style.width = `${percentage}%`;
    header.classList.toggle('scrolled', scrollY > 14);
  };
  addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
    addEventListener('mousemove', event => {
      cursorGlow.style.opacity = '1';
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    });

    heroVisual?.addEventListener('mousemove', event => {
      const box = heroVisual.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      const dashboard = heroVisual.querySelector('.dashboard-window');
      dashboard.style.transform = `rotateY(${x * 7 - 4}deg) rotateX(${-y * 6 + 2}deg)`;
    });
    heroVisual?.addEventListener('mouseleave', () => {
      const dashboard = heroVisual.querySelector('.dashboard-window');
      dashboard.style.transform = 'rotateY(-4deg) rotateX(2deg)';
    });

    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', event => {
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

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    });
  }, { threshold: 0.55 });

  function animateCount(element) {
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || '';
    const duration = reduceMotion ? 1 : 1300;
    const start = performance.now();
    const format = value => Math.round(value).toLocaleString('en-GB') + suffix;
    const frame = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = format(target * eased);
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
  document.querySelectorAll('[data-count]').forEach(element => countObserver.observe(element));

  const typedPhrases = [
    'Data quality and validation',
    'KPI and MI reporting',
    'Dashboard design and storytelling',
    'Clear insight for non-technical audiences'
  ];
  const typedText = document.getElementById('typedText');
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
        setTimeout(typeLoop, 250);
        return;
      }
    } else {
      charIndex += 1;
      if (charIndex > typedPhrases[phraseIndex].length) {
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 58);
  }
  setTimeout(typeLoop, 1500);

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => navObserver.observe(section));
})();
