document.addEventListener('DOMContentLoaded', () => {

  // --- basic helpers (theme, year, smooth scroll) ---
  function scrollToEl(id) {
    const el = document.getElementById(id) || document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const yearEl = document.getElementById('year'); 
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme'); 
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => { 
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'; 
      if (next === 'light') root.setAttribute('data-theme', 'light'); 
      else root.removeAttribute('data-theme'); 
      localStorage.setItem('theme', next); 
    });
  }

  // --- filtering projects ---
  const filterBtns = document.querySelectorAll('.filter');
  const projects = document.querySelectorAll('#projects .project');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projects.forEach(project => {
        if (filter === 'all' || (project.dataset.tags && project.dataset.tags.includes(filter))) {
          project.style.display = '';
        } else {
          project.style.display = 'none';
        }
      });
      const projectsBlock = document.getElementById('projects');
      if (projectsBlock) projectsBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* -------------------------
     Project Video Modal
     ------------------------- */
  const modal = document.getElementById('videoModal');
  const videoContainer = document.getElementById('videoContainer');
  const closeBtn = modal ? modal.querySelector('.close') : null;
  const nextBtn = document.getElementById('nextVideo');
  const prevBtn = document.getElementById('prevVideo');
  const indicator = document.getElementById('videoIndicator');

  let videoList = [];
  let currentIndex = 0;
  let currentPlayer = null;

  function parseDataVideos(raw) {
    if (!raw) return null;
    raw = raw.trim();
    try { return JSON.parse(raw); }
    catch(e) {
      try { return JSON.parse(raw.replace(/'/g, '"')); }
      catch(e2) {
        const arr = raw.split(',').map(s => s.trim()).filter(Boolean);
        return arr.length ? arr : null;
      }
    }
  }

  function updateIndicator() {
    if (!indicator) return;
    indicator.textContent = videoList.length ? `${currentIndex + 1} / ${videoList.length}` : '';
  }

  function loadVideo(index) {
    videoContainer.innerHTML = '';
    currentPlayer = null;
    if (!videoList.length) return;
    const src = videoList[index];
    if (!src) return;

    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(src)) {
      const v = document.createElement('video');
      v.src = src;
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      v.style.width = '100%';
      v.style.maxHeight = '70vh';
      v.style.background = '#000';
      videoContainer.appendChild(v);
      currentPlayer = v;
      v.play().catch(()=>{});
    } else {
      const iframe = document.createElement('iframe');
      iframe.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.width = '100%';
      iframe.style.height = '70vh';
      iframe.style.border = '0';
      videoContainer.appendChild(iframe);
      currentPlayer = iframe;
    }

    updateIndicator();
  }

  function openModal(list, start = 0) {
    videoList = Array.isArray(list) ? list.slice() : [];
    currentIndex = (start >= 0 && start < videoList.length) ? start : 0;
    if (!videoList.length) {
      alert('No videos found for this project.');
      return;
    }
    loadVideo(currentIndex);
    if (modal) modal.style.display = 'flex';
  }

  function closeModal() {
    if (currentPlayer && currentPlayer.tagName === 'VIDEO') {
      try { currentPlayer.pause(); currentPlayer.src = ''; } catch(e) {}
    }
    videoContainer.innerHTML = '';
    videoList = []; 
    currentIndex = 0; 
    currentPlayer = null;
    if (modal) modal.style.display = 'none';
  }

  projects.forEach(card => {
    card.addEventListener('click', (ev) => {
      const play = ev.target.closest('.play');
      if (!play) return; 
      const thumb = card.querySelector('.thumb');
      if (!thumb) {
        console.warn('No .thumb in card', card);
        return;
      }
      const raw = thumb.getAttribute('data-videos');
      const single = thumb.getAttribute('data-video');

      let list = [];
      if (raw) {
        list = parseDataVideos(raw) || [];
      } else if (single) {
        list = [ single.trim() ];
      }

      if (!list.length) {
        alert('No videos found for this project.');
        return;
      }
      openModal(list, 0);
    });
  });

  if (nextBtn) nextBtn.addEventListener('click', () => { 
    if (!videoList.length) return; 
    currentIndex = (currentIndex + 1) % videoList.length; 
    loadVideo(currentIndex); 
  });
  if (prevBtn) prevBtn.addEventListener('click', () => { 
    if (!videoList.length) return; 
    currentIndex = (currentIndex - 1 + videoList.length) % videoList.length; 
    loadVideo(currentIndex); 
  });

  window.addEventListener('keydown', (e) => {
    if (!modal || modal.style.display !== 'flex') return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') nextBtn && nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn && prevBtn.click();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

}); // END DOMContentLoaded

  /* -------------------------
     Hire Me Modal
     ------------------------- */

  const hireBtn = document.getElementById("hireBtn");
  const hireModal = document.getElementById("hireModal");
  const closeHire = document.getElementById("closeHire");
  const contactScroll = document.getElementById("contactScroll");

  if (hireBtn && hireModal) {
    hireBtn.addEventListener("click", () => {
      hireModal.classList.add("active");
    });
  }

  if (closeHire) {
    closeHire.addEventListener("click", () => {
      hireModal.classList.remove("active");
    });
  }

  if (contactScroll) {
    contactScroll.addEventListener("click", () => {
      hireModal.classList.remove("active");
      const contact = document.getElementById("contact");
      if (contact) {
        contact.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  if (hireModal) {
    hireModal.addEventListener("click", (e) => {
      if (e.target === hireModal) {
        hireModal.classList.remove("active");
      }
    });
  }

// --- contact form submission ---

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const successPopup = document.getElementById('successPopup');
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(contactForm);

    // loading state
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = "⏳ Sending...";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", contactForm.action, true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        contactForm.reset();
        successPopup.style.display = "block";

        setTimeout(() => {
          successPopup.style.display = "none";
        }, 3000);
      } else {
        alert("⚠️ Failed to send message.");
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    };

    xhr.onerror = function () {
      alert("⚠️ Network error.");
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    };

    xhr.send(formData);
  });
});


