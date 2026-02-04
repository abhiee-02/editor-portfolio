document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------
     Basic helpers
     ------------------------- */
  function scrollToEl(id) {
    const el = document.getElementById(id) || document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------
     Theme toggle
     ------------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next =
        root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      if (next === 'light') root.setAttribute('data-theme', 'light');
      else root.removeAttribute('data-theme');
      localStorage.setItem('theme', next);
    });
  }

  /* -------------------------
     Project Filtering
     ------------------------- */
  const filterBtns = document.querySelectorAll('.filter');
  const projects = document.querySelectorAll('#projects .project');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projects.forEach(project => {
        if (
          filter === 'all' ||
          (project.dataset.tags &&
            project.dataset.tags.includes(filter))
        ) {
          project.style.display = '';
        } else {
          project.style.display = 'none';
        }
      });
    });
  });

  /* -------------------------
     PROJECT CLICK HANDLER
     ------------------------- */
  projects.forEach(card => {
    const thumb = card.querySelector('.thumb');
    if (!thumb) return;

    thumb.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      const driveLink = thumb.getAttribute('data-drive');
      const videos = thumb.getAttribute('data-videos');

      // ✅ 1. GOOGLE DRIVE FOLDER (Logo Animation)
      if (driveLink && driveLink.trim() !== '') {
        window.open(driveLink, '_blank');
        return;
      }

      // ✅ 2. VIDEO LINK (Other projects)
      if (videos && videos.trim() !== '') {
        try {
          const list = JSON.parse(videos);
          if (Array.isArray(list) && list.length > 0) {
            window.open(list[0], '_blank');
            return;
          }
        } catch (err) {
          console.error('Invalid data-videos format', err);
        }
      }

      // ❌ Nothing found
      alert('⚠️ No media linked to this project');
    });
  });

  /* -------------------------
     Hire Me Modal
     ------------------------- */
  const hireBtn = document.getElementById('hireBtn');
  const hireModal = document.getElementById('hireModal');
  const closeHire = document.getElementById('closeHire');
  const contactScroll = document.getElementById('contactScroll');

  if (hireBtn && hireModal) {
    hireBtn.addEventListener('click', () => {
      hireModal.classList.add('active');
    });
  }

  if (closeHire) {
    closeHire.addEventListener('click', () => {
      hireModal.classList.remove('active');
    });
  }

  if (contactScroll) {
    contactScroll.addEventListener('click', () => {
      hireModal.classList.remove('active');
      const contact = document.getElementById('contact');
      if (contact) contact.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (hireModal) {
    hireModal.addEventListener('click', e => {
      if (e.target === hireModal) {
        hireModal.classList.remove('active');
      }
    });
  }

  /* -------------------------
     Contact Form Submission
     ------------------------- */
  const contactForm = document.getElementById('contactForm');
  const successPopup = document.getElementById('successPopup');

  if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      submitBtn.disabled = true;

      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '⏳ Sending...';

      const xhr = new XMLHttpRequest();
      xhr.open('POST', contactForm.action, true);

      xhr.onload = () => {
        if (xhr.status === 200) {
          contactForm.reset();
          if (successPopup) {
            successPopup.style.display = 'block';
            setTimeout(() => {
              successPopup.style.display = 'none';
            }, 3000);
          }
        } else {
          alert('⚠️ Failed to send message.');
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      };

      xhr.onerror = () => {
        alert('⚠️ Network error.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      };

      xhr.send(formData);
    });
  }

});
