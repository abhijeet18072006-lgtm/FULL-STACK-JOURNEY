const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.site-nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
const revealEls = [...document.querySelectorAll('.reveal')];
const contactForm = document.getElementById('contactForm');
const formStatus = document.querySelector('.form-status');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function setActiveNav() {
  const scrollPosition = window.scrollY + 140;

  let currentSection = sections[0]?.id;

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${currentSection}`;
    link.classList.toggle('active', isActive);
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((element) => revealObserver.observe(element));

window.addEventListener('scroll', setActiveNav, { passive: true });
window.addEventListener('load', setActiveNav);

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const formEndpoint = 'https://formspree.io/f/xdeoavrk';

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!submitButton || !formStatus) {
      return;
    }

    const formData = new FormData(contactForm);

    submitButton.disabled = true;
    formStatus.textContent = '';

    try {
      const response = await fetch(formEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      formStatus.textContent = 'Thanks! Your message has been sent.';
      contactForm.reset();
    } catch (error) {
      formStatus.textContent = 'Sorry, there was a problem sending your message. Please try again.';
    } finally {
      submitButton.disabled = false;
    }
  });
}
