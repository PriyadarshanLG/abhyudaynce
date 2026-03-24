// =========================================================================
// DEFAULT DATA (if localStorage is empty)
// =========================================================================
// =========================================================================
// DEFAULT DATA (if localStorage is empty)
// =========================================================================

const defaultEvents = [
    {
        id: "evt-1",
        name: "Abhyuday Fest 2026",
        date: "2026-04-15",
        category: "upcoming",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800",
        desc: "The biggest cultural extravaganza of the year. Join us for 3 days of music, dance, and art."
    },
    {
        id: "evt-2",
        name: "Rhythm & Beats",
        date: "2026-05-10",
        category: "upcoming",
        image: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800",
        desc: "Inter-college dance competition featuring the best crews from across the state."
    },
    {
        id: "evt-3",
        name: "Voices Unplugged",
        date: "2026-01-20",
        category: "past",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
        desc: "An acoustic evening featuring soulful performances by our very own college bands."
    },
    {
        id: "evt-4",
        name: "BrushStrokes Exhibition",
        date: "2025-11-15",
        category: "past",
        image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&q=80&w=800",
        desc: "Annual fine arts exhibition showcasing paintings, sculptures, and digital art by students."
    }
];

// Initialize localStorage safely natively
try {
    if (typeof massiveTeamList !== 'undefined') {
        // Automatically forcefully load the 50 members from teamData.js!
        localStorage.setItem('abhyuday_team', JSON.stringify(massiveTeamList));
    }
} catch(e) {
    console.error("Storage error for team:", e);
}

try {
    const testEvents = JSON.parse(localStorage.getItem('abhyuday_events'));
    if (!testEvents || testEvents.length === 0) {
        localStorage.setItem('abhyuday_events', JSON.stringify(defaultEvents));
    }
} catch(e) {
    localStorage.setItem('abhyuday_events', JSON.stringify(defaultEvents));
}

// =========================================================================
// GENERAL UI FUNCTIONS
// =========================================================================

function initRightSocialWidget() {
    const widget = document.getElementById('right-social-widget');
    const toggle = document.getElementById('right-social-toggle');
    if (!widget || !toggle) return;

    toggle.addEventListener('click', () => {
        const isOpen = widget.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
}

// =========================================================================
// GALLERY VIDEOS — 3-column layout + scroll-based autoplay (center plays)
// =========================================================================
function renderVideoGallery(container) {
    if (!container) return;

    // Files from: public/videos/
    // (ordered as: 1 center video, then alternating left/right)
    const files = [
        'Ethnic Day.mp4',
        // Use exact on-disk filenames to avoid load failures.
        'Art Attack.mp4',
        'Mehendi Competition.mp4',
        'Solo Performence.mp4',
        'VARNAM 2K24.mp4',
        'Dumb Charades.mp4',
        'Group Dance.mp4',
        'Cultural Fest.mp4',
        'Patang.mp4',
        'That Rangoli Glows.mp4',
        'DJ TIME.mp4',
        'Fashmob.mp4',
        'Tune In.mp4',
        'Talent Hunt.mp4',
    ];

    container.innerHTML = '';

    const row = document.createElement('div');
    row.className = 'video-row-scroll';
    row.setAttribute('aria-label', 'Scrollable video gallery');

    files.forEach((fileName, idx) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'video-slot fade-in';
        wrapper.dataset.index = String(idx);

        const frame = document.createElement('div');
        frame.className = 'video-frame';

        const video = document.createElement('video');
        video.className = 'video-item';
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        // Preload more data so audio/video starts faster when centered.
        video.preload = 'auto';
        video.loop = true;
        // Start muted/off; center logic will control which single video gets audio.
        video.muted = true;
        video.defaultMuted = true;
        video.setAttribute('muted', '');
        video.volume = 0;
        video.src = 'public/videos/' + encodeURIComponent(fileName);
        video.setAttribute('aria-label', 'Gallery video');
        video.addEventListener('error', () => {
            // Helps when a filename contains special characters and the URL doesn't match the file.
            console.error('Gallery video failed to load:', video.currentSrc || video.src);
        });
        video.addEventListener('loadedmetadata', () => {
            // Build a visible preview frame (avoid black first frame for paused videos).
            if (video.dataset.previewReady === '1') return;
            const d = Number.isFinite(video.duration) ? video.duration : 0;
            if (d <= 0.12) return;
            try {
                video.currentTime = Math.min(0.45, d * 0.12);
            } catch (_) {
                // Ignore seek issues on some mobile browsers.
            }
        });
        video.addEventListener('seeked', () => {
            // Mark once we have a decoded non-black preview frame.
            if (video.dataset.previewReady === '1') return;
            video.dataset.previewReady = '1';
            video.pause();
        });

        const label = document.createElement('p');
        label.className = 'video-title';
        // Convert file name to readable event title (without extension).
        label.textContent = fileName
            .replace(/\.[^/.]+$/, '')
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        frame.appendChild(video);
        wrapper.appendChild(frame);
        wrapper.appendChild(label);
        row.appendChild(wrapper);
    });

    container.appendChild(row);
    initVideoRowControls(row);

    // Always start with "group dance" at center on initial load/refresh.
    const preferredCenter = files.findIndex((name) => name.toLowerCase() === 'group dance.mp4');
    const centerIdx = preferredCenter !== -1 ? preferredCenter : Math.floor(files.length / 2);
    requestAnimationFrame(() => {
        const slot = row.querySelector(`.video-slot[data-index="${centerIdx}"]`);
        if (!slot) return;
        row.scrollLeft = slot.offsetLeft - (row.clientWidth - slot.clientWidth) / 2;
    });

    // Lock arrangement: center is always the middle (6 left + 6 right = 13 total)
    container._videoGalleryLocked = true;
    container._videoGalleryCenterIndex = centerIdx;
    container._videoGalleryRow = row;
}

function initVideoRowControls(row) {
    if (!row) return;

    row.style.cursor = 'grab';

    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    const onPointerDown = (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        isDown = true;
        row.style.cursor = 'grabbing';
        startX = e.clientX;
        startScrollLeft = row.scrollLeft;
        try { row.setPointerCapture(e.pointerId); } catch (_) {}
        e.preventDefault();
    };

    const onPointerMove = (e) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        row.scrollLeft = startScrollLeft - dx;
    };

    const stop = () => {
        isDown = false;
        row.style.cursor = 'grab';
    };

    row.addEventListener('pointerdown', onPointerDown);
    row.addEventListener('pointermove', onPointerMove);
    row.addEventListener('pointerup', stop);
    row.addEventListener('pointercancel', stop);

    // Wheel to horizontal
    row.addEventListener(
        'wheel',
        (e) => {
            const wantsHorizontal = Math.abs(e.deltaY) > Math.abs(e.deltaX);
            if (!wantsHorizontal) return;
            if (row.scrollWidth <= row.clientWidth) return;
            e.preventDefault();
            row.scrollLeft += e.deltaY;
        },
        { passive: false }
    );
}

function updateVideoRowEdgeSpacing(row) {
    if (!row) return;
    const firstSlot = row.querySelector('.video-slot');
    if (!firstSlot) return;
    // Measure real visual width in center state (includes scale transform),
    // so first/last videos do not appear cut at the edges.
    const CENTER_SCALE = 1.18;
    const hadCenterClass = firstSlot.classList.contains('is-center');
    const prevScale = firstSlot.style.getPropertyValue('--vs-scale');
    if (!hadCenterClass) firstSlot.classList.add('is-center');
    firstSlot.style.setProperty('--vs-scale', String(CENTER_SCALE));
    const centeredWidth = firstSlot.getBoundingClientRect().width;
    if (!hadCenterClass) firstSlot.classList.remove('is-center');
    if (prevScale) firstSlot.style.setProperty('--vs-scale', prevScale);
    else firstSlot.style.removeProperty('--vs-scale');
    // Add equal side space so first/last items can also align to row center.
    const edgeSpace = Math.max(0, (row.clientWidth - centeredWidth) / 2);
    row.style.setProperty('--video-edge-space', `${Math.round(edgeSpace)}px`);
}

function centerVideoSlotByIndex(row, index) {
    if (!row || typeof index !== 'number' || index < 0) return;
    const slot = row.querySelector(`.video-slot[data-index="${index}"]`);
    if (!slot) return;
    // Use live visual positions for precise centering after transforms/layout shifts.
    const rowRect = row.getBoundingClientRect();
    const slotRect = slot.getBoundingClientRect();
    const rowCenterX = rowRect.left + rowRect.width / 2;
    const slotCenterX = slotRect.left + slotRect.width / 2;
    row.scrollLeft += slotCenterX - rowCenterX;
}

function initVideoGalleryAutoplay() {
    const host = document.getElementById('video-gallery');
    if (!host) return;

    const slots = Array.from(host.querySelectorAll('.video-slot'));
    const videos = slots.map((s) => s.querySelector('video.video-item')).filter(Boolean);
    if (!videos.length) return;

    let playing = null;
    let rafId = null;
    let activeIndex = -1;
    let audioUnlocked = false;
    let hasUserMovedGallery = false;
    let startupLockActive = true;
    const startupLockUntil = Date.now() + 1200;
    let playSeq = 0;

    const row = host.querySelector('.video-row-scroll');
    if (!row) return;

    const pauseAll = () => {
        videos.forEach((v) => {
            if (!v.paused) v.pause();
            v.muted = true;
            v.volume = 0;
        });
    };

    const silenceAllExcept = (activeVideo) => {
        videos.forEach((v) => {
            if (v === activeVideo) return;
            if (!v.paused) v.pause();
            v.muted = true;
            v.volume = 0;
        });
    };

    const waitUntilPlayable = (v, timeoutMs = 1500) => new Promise((resolve) => {
        if (!v) return resolve();
        if (v.readyState >= 2) return resolve();
        const onReady = () => {
            cleanup();
            resolve();
        };
        const onTimeout = () => {
            cleanup();
            resolve();
        };
        const cleanup = () => {
            clearTimeout(timer);
            v.removeEventListener('loadeddata', onReady);
            v.removeEventListener('canplay', onReady);
        };
        const timer = setTimeout(onTimeout, timeoutMs);
        v.addEventListener('loadeddata', onReady, { once: true });
        v.addEventListener('canplay', onReady, { once: true });
    });

    const tryPlayWithSound = async (v) => {
        if (!v) return false;
        await waitUntilPlayable(v);
        // Always attempt audible playback first after unlock; otherwise muted autoplay.
        if (audioUnlocked) {
            v.muted = false;
            v.defaultMuted = false;
            v.volume = 1;
            try {
                await v.play();
                return true;
            } catch (_) {
                // fall through to muted fallback
            }
        }
        v.muted = true;
        v.defaultMuted = true;
        v.volume = 0;
        try {
            await v.play();
            return true;
        } catch (_) {
            return false;
        }
    };

    const unlockAudio = () => {
        if (audioUnlocked) return;
        audioUnlocked = true;
        // Ensure only active center video can be audible.
        silenceAllExcept(playing);
        // If one video is active, switch to audible playback right away.
        if (playing) {
            playing.muted = false;
            playing.defaultMuted = false;
            playing.volume = 1;
            playing.play().catch(() => {});
        }
    };

    const applyScaling = (newActiveIndex) => {
        const CENTER_SCALE = 1.18;
        // Center biggest; neighbors gradually smaller moving outward.
        slots.forEach((slotEl, idx) => {
            const diff = Math.abs(idx - newActiveIndex);
            const isCenter = idx === newActiveIndex;
            // Keep center clearly larger while side cards stay compact.
            const scale = isCenter ? CENTER_SCALE : Math.max(0.72, 0.96 - diff * 0.12);
            slotEl.classList.toggle('is-center', isCenter);
            slotEl.style.setProperty('--vs-scale', String(scale));
            slotEl.style.zIndex = String(1000 - diff);
        });
    };

    // Apply initial scaling immediately so the center looks big even before autoplay settles.
    const initialCenterIndex = host._videoGalleryCenterIndex ?? Math.floor(slots.length / 2);
    activeIndex = initialCenterIndex;
    applyScaling(activeIndex);
    // Re-center after scaling because center card width is larger than side cards.
    centerVideoSlotByIndex(row, initialCenterIndex);

    const update = () => {
        rafId = null;

        const gallerySection = document.getElementById('gallery');
        const rect = gallerySection ? gallerySection.getBoundingClientRect() : null;
        // Only run gallery playback when gallery itself is the active viewport section.
        // This prevents video/audio from continuing in later sections (e.g. Reach Out).
        const viewportMidY = window.innerHeight * 0.5;
        const inView = !rect || (rect.top <= viewportMidY && rect.bottom >= viewportMidY);

        if (!inView) {
            pauseAll();
            playing = null;
            activeIndex = -1;
            return;
        }

        const rowRect = row.getBoundingClientRect();
        const rowCenterX = rowRect.left + rowRect.width / 2;
        // Use a wider threshold so autoplay starts reliably even with slight layout shifts.
        const threshold = Math.max(180, rowRect.width * 0.55);

        let bestVideo = null;
        let bestDist = Infinity;
        let bestIndex = -1;

        // Keep startup locked to preferred center only briefly (prevents load drift).
        if (startupLockActive && initialCenterIndex >= 0 && initialCenterIndex < slots.length) {
            if (hasUserMovedGallery || Date.now() > startupLockUntil) {
                startupLockActive = false;
            }
        }

        if (startupLockActive && initialCenterIndex >= 0 && initialCenterIndex < slots.length) {
            const forcedSlot = slots[initialCenterIndex];
            const forcedVideo = forcedSlot ? forcedSlot.querySelector('video.video-item') : null;
            if (forcedVideo) {
                bestVideo = forcedVideo;
                bestIndex = initialCenterIndex;
                bestDist = 0;
            }
        }

        if (!bestVideo) {
            slots.forEach((slotEl, idx) => {
                const v = slotEl.querySelector('video.video-item');
                if (!v) return;

                const r = v.getBoundingClientRect();
                if (r.right <= 0 || r.left >= window.innerWidth) return;
                if (r.bottom <= 0 || r.top >= window.innerHeight) return;

                const vCenterX = r.left + r.width / 2;
                const dist = Math.abs(vCenterX - rowCenterX);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestVideo = v;
                    bestIndex = idx;
                }
            });
        }

        if (!bestVideo) return;

        const nearCenter = bestDist <= threshold;

        if (bestIndex !== activeIndex) {
            activeIndex = bestIndex;
            applyScaling(activeIndex);
        }

        if (!nearCenter) {
            if (playing) {
                pauseAll();
                playing = null;
            }
            return;
        }

        if (playing !== bestVideo) {
            silenceAllExcept(bestVideo);
            playing = bestVideo;
            const seq = ++playSeq;
            // Always restart from beginning when a new video becomes center.
            try { playing.currentTime = 0; } catch (_) {}
            tryPlayWithSound(playing).then(() => {
                // Ignore stale play attempts from previous center selections.
                if (seq !== playSeq) return;
            });
        } else if (audioUnlocked && playing && playing.muted) {
            // After first user interaction, unmute current playing video instantly.
            silenceAllExcept(playing);
            playing.muted = false;
            playing.defaultMuted = false;
            playing.volume = 1;
            playing.play().catch(() => {});
        }
    };

    const schedule = () => {
        if (rafId) return;
        rafId = window.requestAnimationFrame(update);
    };

    row.addEventListener('scroll', schedule, { passive: true });
    row.addEventListener('pointerdown', () => { hasUserMovedGallery = true; startupLockActive = false; }, { passive: true });
    row.addEventListener('touchstart', () => { hasUserMovedGallery = true; startupLockActive = false; }, { passive: true });
    row.addEventListener('wheel', () => { hasUserMovedGallery = true; startupLockActive = false; }, { passive: true });
    row.addEventListener('pointerdown', unlockAudio, { passive: true });
    row.addEventListener('touchstart', unlockAudio, { passive: true });
    row.addEventListener('click', unlockAudio, { passive: true });
    // Audio policies unlock on first user gesture anywhere on page.
    document.addEventListener('pointerdown', unlockAudio, { passive: true, once: true });
    document.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
    document.addEventListener('click', unlockAudio, { passive: true, once: true });
    document.addEventListener('keydown', unlockAudio, { passive: true, once: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', () => {
        updateVideoRowEdgeSpacing(row);
        schedule();
    });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseAll();
            return;
        }
        schedule();
    });

    // Initial pick after metadata loads/first paint
    requestAnimationFrame(update);
    setTimeout(update, 700);
}

// Set Current Year in Footer
// Prevent browser from restoring previous scroll position on refresh/back-forward.
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
    // Always fall back to homepage state on refresh/open.
    if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Init UI elements
    initScrollEffects();
    initMobileNav();
    initRightSocialWidget();

    // Render + autoplay gallery videos
    if (document.getElementById('video-gallery')) {
        const host = document.getElementById('video-gallery');
        renderVideoGallery(host);
        const row = host.querySelector('.video-row-scroll');
        if (row) {
            updateVideoRowEdgeSpacing(row);
            // Re-center after edge spacing so startup always lands on preferred video.
            centerVideoSlotByIndex(row, host._videoGalleryCenterIndex ?? -1);
            requestAnimationFrame(() => centerVideoSlotByIndex(row, host._videoGalleryCenterIndex ?? -1));
            setTimeout(() => centerVideoSlotByIndex(row, host._videoGalleryCenterIndex ?? -1), 220);
        }
        initVideoGalleryAutoplay();
    }
    
    // Load data if on Home Page
    if (document.getElementById('team-container')) {
        initTeamYearGridCollapsible();
        renderTeam();
        renderEvents('upcoming');
    }
    
    // Load embedded Admin Portal if logged in natively
    if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
        const wrapper = document.getElementById('admin-dashboard-wrapper');
        if (wrapper) {
            wrapper.style.display = 'block';
            initAdminData();
        }
    }
});

// Some browsers restore scroll after DOMContentLoaded; enforce top once page fully settles.
window.addEventListener('load', () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
});
window.addEventListener('pageshow', () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
});

// Toast Notification (preserve icon + #toast-msg markup)
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    const msgEl = document.getElementById('toast-msg');
    if (msgEl) msgEl.textContent = message;
    else toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

/** Safe text for injecting into admin table cells */
function escapeAdminText(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/** After any admin save/delete, keep the public home page lists in sync */
function refreshPublicTeamAndEvents() {
    if (document.getElementById('team-container')) {
        renderTeam();
        bindTeamYearGridImagesForPeek();
        requestAnimationFrame(() => refreshTeamYearGridPeek());
    }
    const eventsHost = document.getElementById('events-container');
    if (eventsHost) {
        const activeBtn = document.querySelector('.event-tabs .tab-btn.active');
        const category =
            activeBtn && activeBtn.textContent && activeBtn.textContent.toLowerCase().includes('past')
                ? 'past'
                : 'upcoming';
        renderEvents(category);
    }
}

// Scroll Effects (Navbar & Animations)
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a:not(.admin-link)');

    window.addEventListener('scroll', () => {
        // Navbar Scrolled State
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Active Section ScrollSpy
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Activate when section hits the top 1/3 of screen
            if (window.scrollY >= (sectionTop - window.innerHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Fade In Elements
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            if (rect.top <= windowHeight * 0.85) {
                el.classList.add('visible');
            }
        });
    });

    // Trigger once on load
    setTimeout(() => window.dispatchEvent(new Event('scroll')), 50);
}

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fa-solid fa-xmark"></i>' 
                : '<i class="fa-solid fa-bars"></i>';
        });

        // Close when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }
}

// Lightbox for Gallery
function openLightbox(imgElement) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox && lightboxImg) {
        lightboxImg.src = imgElement.src;
        lightbox.style.display = 'flex';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
    }
}

// Handle Esc key for modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
        closeModal('admin-modal');
        closeModal('event-modal');
        closeModal('team-modal');
    }
});


// =========================================================================
// HOME PAGE RENDERING
// =========================================================================

// Google Drive: thumbnail URL often works; if not, try uc?export=view with the same file id.
function handleDrivePhotoError(img, placeholderSrc) {
    const fallback = placeholderSrc || 'https://via.placeholder.com/400x400?text=No+Photo';
    if (img.dataset.driveFallback === '1') {
        img.onerror = null;
        img.src = fallback;
        return;
    }
    const src = img.getAttribute('src') || '';
    const m = src.match(/[?&]id=([^&]+)/);
    // Only retry for Google Drive URLs, not local /public files
    if (m && src.includes('drive.google.com')) {
        img.dataset.driveFallback = '1';
        img.src = 'https://drive.google.com/uc?export=view&id=' + decodeURIComponent(m[1]);
        return;
    }
    img.onerror = null;
    img.src = fallback;
}

// Year tier for Core Team cards (matches teamData branch text if yearBand missing in storage)
function teamYearBand(member) {
    if (member.yearBand === '3' || member.yearBand === '2' || member.yearBand === '1') return member.yearBand;
    const b = String(member.branch || '');
    if (/3rd\s*year/i.test(b)) return '3';
    if (/2nd\s*year/i.test(b)) return '2';
    if (/1st\s*year/i.test(b)) return '1';
    return '1';
}

function teamYearLabel(yb) {
    if (yb === '3') return '3rd year';
    if (yb === '2') return '2nd year';
    return '1st year';
}

/** Split roster into 3rd / 2nd / 1st year groups (fixed display order). */
function partitionTeamByYear(team) {
    const map = { '3': [], '2': [], '1': [] };
    team.forEach((m) => {
        const yb = teamYearBand(m);
        const key = map[yb] !== undefined ? yb : '1';
        map[key].push(m);
    });
    return [
        { year: '3', members: map['3'] },
        { year: '2', members: map['2'] },
        { year: '1', members: map['1'] },
    ].filter((s) => s.members.length > 0);
}

function escapeTeamHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Match `.team-grid` column count in style.css (desktop 7, ≤768px 3). */
function teamGridColumnCount() {
    return window.matchMedia('(max-width: 768px)').matches ? 3 : 7;
}

/**
 * Collapsed height = first row + half of second row; enables “View more” + blur overlay.
 * Skips clipping when everyone fits on one row.
 */
function refreshTeamYearGridPeek() {
    const clips = document.querySelectorAll('#team-container .team-grid-clip');
    clips.forEach((clip) => {
        const grid = clip.querySelector('.team-grid');
        const cards = grid ? grid.querySelectorAll('.member-card') : [];
        const colCount = teamGridColumnCount();

        if (!cards.length || cards.length <= colCount) {
            clip.classList.add('team-grid-clip--single-row');
            clip.classList.remove('is-expanded');
            clip.style.removeProperty('--team-grid-peek');
            clip.style.maxHeight = '';
            const btn = clip.querySelector('.team-view-more');
            if (btn) {
                btn.hidden = true;
                btn.textContent = 'View more';
                btn.setAttribute('aria-expanded', 'false');
            }
            return;
        }

        clip.classList.remove('team-grid-clip--single-row');
        const btn = clip.querySelector('.team-view-more');
        if (btn) btn.hidden = false;

        const y0 = cards[0].offsetTop;
        let row2 = null;
        for (let i = 1; i < cards.length; i++) {
            if (cards[i].offsetTop > y0) {
                row2 = cards[i];
                break;
            }
        }
        if (!row2) {
            clip.classList.add('team-grid-clip--single-row');
            clip.style.removeProperty('--team-grid-peek');
            const b = clip.querySelector('.team-view-more');
            if (b) b.hidden = true;
            return;
        }

        /* Distance from top of clip to middle of row-2 — includes padding (fixes mobile vs desktop) */
        const clipRect = clip.getBoundingClientRect();
        const row2Rect = row2.getBoundingClientRect();
        const peekPx = Math.ceil(row2Rect.top + row2Rect.height * 0.5 - clipRect.top);
        clip.style.setProperty('--team-grid-peek', `${Math.max(80, peekPx)}px`);

        if (!clip.classList.contains('is-expanded')) {
            clip.style.maxHeight = '';
        }
    });
}

function bindTeamYearGridImagesForPeek() {
    document.querySelectorAll('#team-container .team-grid img').forEach((img) => {
        if (img.dataset.peekBound) return;
        img.dataset.peekBound = '1';
        if (!img.complete) {
            img.addEventListener('load', () => refreshTeamYearGridPeek(), { once: true });
        }
    });
}

/** One-time: View more / View less + resize reflow for year grids */
function initTeamYearGridCollapsible() {
    const root = document.getElementById('team-container');
    if (!root || root.dataset.collapsibleInit === '1') return;
    root.dataset.collapsibleInit = '1';
    root.addEventListener('click', (e) => {
        const btn = e.target.closest('.team-view-more');
        if (!btn || !root.contains(btn)) return;
        const clip = btn.closest('.team-grid-clip');
        if (!clip || clip.classList.contains('team-grid-clip--single-row')) return;
        e.preventDefault();
        const open = clip.classList.toggle('is-expanded');
        btn.textContent = open ? 'View less' : 'View more';
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (!open) {
            requestAnimationFrame(() => refreshTeamYearGridPeek());
        }
    });
    let resizeTimer;
    const schedulePeek = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => refreshTeamYearGridPeek(), 160);
    };
    window.addEventListener('resize', schedulePeek);
    window.addEventListener('orientationchange', schedulePeek);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', schedulePeek);
    }
    if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => schedulePeek());
        ro.observe(root);
    }
}

function renderTeam() {
    const container = document.getElementById('team-container');
    if (!container) return;

    const team = JSON.parse(localStorage.getItem('abhyuday_team')) || [];
    container.innerHTML = '';

    const sections = partitionTeamByYear(team);
    let globalIndex = 0;

    sections.forEach((section) => {
        const yb = section.year;
        const headingText = teamYearLabel(yb);
        const headingId = `team-year-title-${yb}`;
        let cardsHtml = '';

        section.members.forEach((member) => {
            const delay = (globalIndex % 4) * 0.1;
            globalIndex += 1;
            const nameHtml = escapeTeamHtml(member.name);
            const branchHtml = escapeTeamHtml(member.branch);
            const roleHtml = escapeTeamHtml(member.role || '');
            const altAttr = String(member.name).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
            cardsHtml += `
            <div class="member-card card fade-in" style="transition-delay: ${delay}s">
                <div class="member-img">
                    <img src="${member.photo}" alt="${altAttr}" onerror="handleDrivePhotoError(this)">
                </div>
                <div class="member-info">
                    <h3 class="member-name">${nameHtml}</h3>
                    <p class="member-role">${roleHtml}</p>
                    <p class="member-branch">${branchHtml}</p>
                </div>
            </div>`;
        });

        container.innerHTML += `
            <section class="team-year-block team-year-block--${yb}" aria-labelledby="${headingId}">
                <div class="team-year-panel fade-in">
                    <div class="team-year-banner">
                        <h2 class="team-year-heading" id="${headingId}">${headingText}</h2>
                    </div>
                    <div class="team-grid-clip">
                        <div class="team-grid">${cardsHtml}</div>
                        <div class="team-grid-fade" aria-hidden="true"></div>
                        <button type="button" class="team-view-more" aria-expanded="false" hidden>
                            View more
                        </button>
                    </div>
                </div>
            </section>`;
    });

    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
        refreshTeamYearGridPeek();
        bindTeamYearGridImagesForPeek();
        requestAnimationFrame(() => refreshTeamYearGridPeek());
    }, 50);
}

function switchEventTab(category, triggerEvent) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (triggerEvent && triggerEvent.currentTarget) {
        triggerEvent.currentTarget.classList.add('active');
    } else if (window.event && window.event.target) {
        try { window.event.target.classList.add('active'); } catch(e) {}
    }
    
    renderEvents(category);
}

function renderEvents(category) {
    const container = document.getElementById('events-container');
    if (!container) return;
    
    const events = JSON.parse(localStorage.getItem('abhyuday_events')) || [];
    const filteredEvents = events.filter(e => e.category === category);
    
    container.innerHTML = '';
    
    if (filteredEvents.length === 0) {
        container.innerHTML = `<p style="text-align: center; grid-column: 1/-1; color: var(--text-muted);">No ${category} events found.</p>`;
        return;
    }
    
    // Sort by date (descending for past, ascending for upcoming)
    filteredEvents.sort((a, b) => {
        return category === 'upcoming' 
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
    });
    
    filteredEvents.forEach((evt, index) => {
        const delay = (index % 3) * 0.1;
        const dateObj = new Date(evt.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        
        container.innerHTML += `
            <div class="event-card card fade-in" style="transition-delay: ${delay}s">
                <div class="event-img">
                    <img src="${evt.image}" alt="${evt.name}" onerror="this.src='https://via.placeholder.com/800x400?text=No+Image'">
                </div>
                <div class="event-details">
                    <div class="event-date"><i class="fa-regular fa-calendar"></i> ${formattedDate}</div>
                    <h3 class="event-title">${evt.name}</h3>
                    <p class="event-desc">${evt.desc}</p>
                </div>
            </div>
        `;
    });
    setTimeout(() => window.dispatchEvent(new Event('scroll')), 50); // re-trigger animations
}


// =========================================================================
// ADMIN AUTHENTICATION
// =========================================================================

const adminBtn = document.getElementById('admin-login-btn');
const adminModal = document.getElementById('admin-modal');
const closeAdminBtn = document.getElementById('close-admin-modal');

if (adminBtn) {
    adminBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('admin-modal');
    });
}

if (closeAdminBtn) {
    closeAdminBtn.addEventListener('click', () => {
        closeModal('admin-modal');
    });
}

const adminPinInput = document.getElementById('admin-pin');
if (adminPinInput) {
    adminPinInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            verifyAdminPin();
        }
    });
}

function verifyAdminPin() {
    const pinInput = document.getElementById('admin-pin');
    const errorMsg = document.getElementById('admin-error');
    
    if (pinInput.value === 'navkis@202526') { // Hardcoded PIN
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        closeModal('admin-modal');
        const wrapper = document.getElementById('admin-dashboard-wrapper');
        if(wrapper) {
            wrapper.style.display = 'block';
            initAdminData();
            window.scrollTo(0,0);
        }
        pinInput.value = '';
    } else {
        errorMsg.style.display = 'block';
        pinInput.value = '';
        setTimeout(() => { errorMsg.style.display = 'none'; }, 3000);
    }
}

function logoutAdmin() {
    sessionStorage.removeItem('isAdminLoggedIn');
    exitAdminDashboard();
}

function exitAdminDashboard() {
    const wrapper = document.getElementById('admin-dashboard-wrapper');
    if (wrapper) {
        wrapper.style.display = 'none';
    }
    renderTeam();
    renderEvents('upcoming');
    window.scrollTo(0,0);
}

function togglePinVisibility() {
    const pinInput = document.getElementById('admin-pin');
    const toggleIcon = document.getElementById('toggle-pin-icon');
    if (pinInput.type === 'password') {
        pinInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
        toggleIcon.style.color = 'var(--accent)';
    } else {
        pinInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
        toggleIcon.style.color = 'var(--text-muted)';
    }
}


// =========================================================================
// ADMIN DASHBOARD & CRUD OPERATIONS
// =========================================================================

// Generic Modal Handling
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.classList.remove('active');
}

// Admin Tab Switching
function switchAdminTab(tabId, element) {
    document.querySelectorAll('.admin-tab').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.admin-menu li').forEach(li => li.classList.remove('active'));
    
    document.getElementById(tabId).style.display = 'block';
    element.classList.add('active');
}

// Initialize Admin Data
function initAdminData() {
    renderAdminEvents();
    renderAdminTeam();
}

// Generate unique id for new rows
function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    }
    return Math.random().toString(36).slice(2, 11);
}

// --- EVENTS MANAGEMENT ---

function renderAdminEvents() {
    const tbody = document.getElementById('admin-events-list');
    if (!tbody) return;

    const events = JSON.parse(localStorage.getItem('abhyuday_events')) || [];
    tbody.innerHTML = '';

    if (events.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="admin-empty-hint"><strong>No events yet</strong>Use “Add event” to create one. Changes save to this browser (localStorage).</td></tr>`;
        return;
    }

    events.forEach((evt) => {
        const name = escapeAdminText(evt.name);
        const date = escapeAdminText(evt.date);
        const cat = escapeAdminText(evt.category || '');
        const idLit = JSON.stringify(evt.id);
        tbody.innerHTML += `
            <tr>
                <td><img src="${evt.image}" alt="" onerror="this.src='https://via.placeholder.com/50?text=NA'"></td>
                <td><strong>${name}</strong></td>
                <td>${date}</td>
                <td><span class="admin-pill admin-pill--${evt.category === 'past' ? 'past' : 'up'}">${cat}</span></td>
                <td>
                    <div class="action-btns">
                        <button type="button" class="btn-icon btn-edit" onclick="editEvent(${idLit})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                        <button type="button" class="btn-icon btn-delete" onclick="deleteEvent(${idLit})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function openAddEventModal() {
    document.getElementById('event-form').reset();
    document.getElementById('event-id').value = '';
    document.getElementById('event-modal-title').textContent = 'Add event';
    openModal('event-modal');
}

function saveEvent(e) {
    if (e && e.preventDefault) e.preventDefault();

    const id = document.getElementById('event-id').value.trim();
    const name = document.getElementById('event-name').value.trim();
    const date = document.getElementById('event-date').value;
    const image = document.getElementById('event-image').value.trim();
    const category = document.getElementById('event-category').value;
    const desc = document.getElementById('event-desc').value.trim();

    let events = JSON.parse(localStorage.getItem('abhyuday_events')) || [];

    if (id) {
        const index = events.findIndex((evt) => evt.id === id);
        if (index !== -1) {
            events[index] = { id, name, date, image, category, desc };
            localStorage.setItem('abhyuday_events', JSON.stringify(events));
            showToast('Event saved.');
            closeModal('event-modal');
            renderAdminEvents();
            refreshPublicTeamAndEvents();
        } else {
            showToast('Could not find that event. Try refreshing.');
        }
    } else {
        const newEvent = { id: 'evt-' + generateId(), name, date, image, category, desc };
        events.push(newEvent);
        localStorage.setItem('abhyuday_events', JSON.stringify(events));
        showToast('Event added.');
        closeModal('event-modal');
        renderAdminEvents();
        refreshPublicTeamAndEvents();
    }
}

function editEvent(id) {
    const events = JSON.parse(localStorage.getItem('abhyuday_events')) || [];
    const evt = events.find(e => e.id === id);
    if (!evt) return;
    
    document.getElementById('event-id').value = evt.id;
    document.getElementById('event-name').value = evt.name;
    document.getElementById('event-date').value = evt.date;
    document.getElementById('event-image').value = evt.image;
    document.getElementById('event-category').value = evt.category;
    document.getElementById('event-desc').value = evt.desc;
    
    document.getElementById('event-modal-title').textContent = 'Edit event';
    openModal('event-modal');
}

function deleteEvent(id) {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    let events = JSON.parse(localStorage.getItem('abhyuday_events')) || [];
    events = events.filter((e) => e.id !== id);
    localStorage.setItem('abhyuday_events', JSON.stringify(events));
    renderAdminEvents();
    refreshPublicTeamAndEvents();
    showToast('Event removed.');
}


// --- TEAM MANAGEMENT ---

function adminYearLabel(yb) {
    if (yb === '3') return '3rd year';
    if (yb === '2') return '2nd year';
    return '1st year';
}

function renderAdminTeam() {
    const tbody = document.getElementById('admin-team-list');
    if (!tbody) return;

    const team = JSON.parse(localStorage.getItem('abhyuday_team')) || [];
    tbody.innerHTML = '';

    if (team.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="admin-empty-hint"><strong>No team members</strong>Use “Add member” or load defaults from teamData. Saves stay in this browser only.</td></tr>`;
        return;
    }

    team.forEach((member) => {
        const yb = member.yearBand === '3' || member.yearBand === '2' || member.yearBand === '1' ? member.yearBand : teamYearBand(member);
        const name = escapeAdminText(member.name);
        const role = escapeAdminText(member.role || '');
        const branch = escapeAdminText(member.branch || '');
        const yearLabel = escapeAdminText(adminYearLabel(yb));
        const idLit = JSON.stringify(member.id);
        tbody.innerHTML += `
            <tr>
                <td><img src="${member.photo}" alt="" onerror="handleDrivePhotoError(this)"></td>
                <td><strong>${name}</strong></td>
                <td><span class="admin-pill admin-pill--year">${yearLabel}</span></td>
                <td>${role}</td>
                <td>${branch}</td>
                <td>
                    <div class="action-btns">
                        <button type="button" class="btn-icon btn-edit" onclick="editTeamMember(${idLit})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                        <button type="button" class="btn-icon btn-delete" onclick="deleteTeamMember(${idLit})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function openAddTeamModal() {
    document.getElementById('team-form').reset();
    document.getElementById('team-id').value = '';
    document.getElementById('team-year-band').value = '3';
    document.getElementById('team-modal-title').textContent = 'Add team member';
    openModal('team-modal');
}

function saveTeamMember(e) {
    if (e && e.preventDefault) e.preventDefault();

    const id = document.getElementById('team-id').value.trim();
    const name = document.getElementById('team-name').value.trim();
    const role = document.getElementById('team-role').value.trim();
    const branch = document.getElementById('team-branch').value.trim();
    const photo = document.getElementById('team-photo').value.trim();
    let yearBand = document.getElementById('team-year-band').value;
    if (yearBand !== '3' && yearBand !== '2' && yearBand !== '1') yearBand = '1';

    let team = JSON.parse(localStorage.getItem('abhyuday_team')) || [];

    if (id) {
        const index = team.findIndex((m) => m.id === id);
        if (index !== -1) {
            team[index] = { id, name, role, branch, photo, yearBand };
            localStorage.setItem('abhyuday_team', JSON.stringify(team));
            showToast('Member saved.');
            closeModal('team-modal');
            renderAdminTeam();
            refreshPublicTeamAndEvents();
        } else {
            showToast('Could not find that member. Try refreshing.');
        }
    } else {
        const newMember = { id: 'team-' + generateId(), name, role, branch, photo, yearBand };
        team.push(newMember);
        localStorage.setItem('abhyuday_team', JSON.stringify(team));
        showToast('Member added.');
        closeModal('team-modal');
        renderAdminTeam();
        refreshPublicTeamAndEvents();
    }
}

function editTeamMember(id) {
    const team = JSON.parse(localStorage.getItem('abhyuday_team')) || [];
    const member = team.find((m) => m.id === id);
    if (!member) {
        showToast('Member not found.');
        return;
    }

    const yb =
        member.yearBand === '3' || member.yearBand === '2' || member.yearBand === '1'
            ? member.yearBand
            : teamYearBand(member);

    document.getElementById('team-id').value = member.id;
    document.getElementById('team-name').value = member.name || '';
    document.getElementById('team-role').value = member.role || '';
    document.getElementById('team-branch').value = member.branch || '';
    document.getElementById('team-photo').value = member.photo || '';
    document.getElementById('team-year-band').value = yb;

    document.getElementById('team-modal-title').textContent = 'Edit team member';
    openModal('team-modal');
}

function deleteTeamMember(id) {
    if (!confirm('Remove this member from the list?')) return;
    let team = JSON.parse(localStorage.getItem('abhyuday_team')) || [];
    team = team.filter((m) => m.id !== id);
    localStorage.setItem('abhyuday_team', JSON.stringify(team));
    renderAdminTeam();
    refreshPublicTeamAndEvents();
    showToast('Member removed.');
}
