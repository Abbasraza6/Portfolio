document.addEventListener('DOMContentLoaded', () => {
  function setupLetterAnimation(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const text = el.textContent.trim();
    if (!text) return;

    el.textContent = '';

    const accessibleSpan = document.createElement('span');
    accessibleSpan.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
    accessibleSpan.textContent = text;
    el.appendChild(accessibleSpan);

    const wrapper = document.createElement('span');
    wrapper.setAttribute('aria-hidden', 'true');

    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      if (char === ' ') {
        span.className = 'space';
        span.innerHTML = '&nbsp;';
      } else {
        span.className = 'char';
        span.textContent = char;
        span.style.animationDelay = `${0.05 + index * 0.03}s`;
      }
      wrapper.appendChild(span);
    });

    el.appendChild(wrapper);
  }

  ['hero-name', 'smit-heading', 'ics-heading', 'matric-heading'].forEach(setupLetterAnimation);
  document.getElementById('hero-name')?.classList.add('animated');

  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  if (themeBtn && themeIcon) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      document.body.classList.toggle('dark-theme');

      if (document.body.classList.contains('light-theme')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
    });
  }

  const macCursor = document.getElementById('mac-cursor');
  const glowBlob = document.getElementById('glow-blob');

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let blobX = 0, blobY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function renderPointerEffects() {
      cursorX += (mouseX - cursorX) * 0.35;
      cursorY += (mouseY - cursorY) * 0.35;

      blobX += (mouseX - blobX) * 0.1;
      blobY += (mouseY - blobY) * 0.1;

      if (macCursor) {
        macCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }

      if (glowBlob) {
        glowBlob.style.transform = `translate3d(${blobX}px, ${blobY}px, 0) translate(-50%, -50%)`;
      }

      requestAnimationFrame(renderPointerEffects);
    }
    requestAnimationFrame(renderPointerEffects);

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, .skill-card, .img-wrapper, .anim-card, .wp-btn')) {
        macCursor?.classList.add('hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, .skill-card, .img-wrapper, .anim-card, .wp-btn')) {
        macCursor?.classList.remove('hover');
      }
    });
  }

  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const codeChars = '01{}[]<>/\\;:$#@!=+*&%AR';
    const fontSize = 14;
    let columns = 0;
    let drops = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    function drawMatrixRain() {
      const isLightTheme = document.body.classList.contains('light-theme');
      ctx.fillStyle = isLightTheme ? 'rgba(244, 244, 246, 0.15)' : 'rgba(5, 5, 5, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = isLightTheme ? '#000000' : '#ffffff';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = codeChars.charAt(Math.floor(Math.random() * codeChars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    setInterval(drawMatrixRain, 40);
  }

  const laptopScene = document.getElementById('laptop-scene');
  const altLaptop = document.getElementById('alt-laptop');

  if (laptopScene && altLaptop) {
    laptopScene.addEventListener('mousemove', (e) => {
      const rect = laptopScene.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -15 + 20;
      const rotateY = ((x - centerX) / centerX) * 20 - 15;
      
      altLaptop.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    laptopScene.addEventListener('mouseleave', () => {
      altLaptop.style.transform = 'rotateX(20deg) rotateY(-15deg)';
      altLaptop.style.transition = 'transform 0.5s ease';
    });

    laptopScene.addEventListener('mouseenter', () => {
      altLaptop.style.transition = 'none';
    });
  }

  const skillCards = document.querySelectorAll('.skill-card');
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.style.transitionDelay = '0s';
          entry.target.classList.remove('visible');

          setTimeout(() => {
            entry.target.style.transitionDelay = '';
          }, 50);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  skillCards.forEach((card) => skillObserver.observe(card));

  const scrollElements = document.querySelectorAll('.scroll-fade');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          const animatedHeading = entry.target.querySelector('.animated-text');
          if (animatedHeading) {
            animatedHeading.classList.add('animated');
          }
        } else {
          entry.target.classList.remove('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  scrollElements.forEach((el) => sectionObserver.observe(el));
});

function changeWallpaper(wallpaperClass, element) {
  const isLightTheme = document.body.classList.contains('light-theme');
  document.body.className = `${wallpaperClass} ${isLightTheme ? 'light-theme' : 'dark-theme'}`;

  document.querySelectorAll('.wp-btn').wpForEach?.((btn) => btn.classList.remove('active'));
  document.querySelectorAll('.wp-btn').forEach((btn) => btn.classList.remove('active'));
  element?.classList.add('active');
}