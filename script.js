// =========================================================================
// DEFAULT DATA (if localStorage is empty)
// =========================================================================
const defaultTeam = [
    {
        id: "team-1",
        name: "Alex Johnson",
        role: "President",
        branch: "Computer Science",
        photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "team-2",
        name: "Maria Garcia",
        role: "Vice President",
        branch: "Electronics",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "team-3",
        name: "David Smith",
        role: "Event Coordinator",
        branch: "Mechanical",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "team-4",
        name: "Priya Patel",
        role: "PR Head",
        branch: "Information Tech",
        photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400"
    }
];

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

// Initialize localStorage
if (!localStorage.getItem('abhyuday_team')) {
    localStorage.setItem('abhyuday_team', JSON.stringify(defaultTeam));
}
if (!localStorage.getItem('abhyuday_events')) {
    localStorage.setItem('abhyuday_events', JSON.stringify(defaultEvents));
}

// =========================================================================
// GENERAL UI FUNCTIONS
// =========================================================================

// Set Current Year in Footer
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Init UI elements
    initScrollEffects();
    initMobileNav();
    
    // Load data if on Home Page
    if (document.getElementById('team-container')) {
        renderTeam();
        renderEvents('upcoming');
    }
});

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Scroll Effects (Navbar & Animations)
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const fadeElements = document.querySelectorAll('.fade-in');

    window.addEventListener('scroll', () => {
        // Navbar Scrolled State
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Fade In Elements
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            if (rect.top <= windowHeight * 0.85) {
                el.classList.add('visible');
            }
        });
    });

    // Trigger once on load
    window.dispatchEvent(new Event('scroll'));
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

function renderTeam() {
    const container = document.getElementById('team-container');
    if (!container) return;
    
    const team = JSON.parse(localStorage.getItem('abhyuday_team')) || [];
    container.innerHTML = '';
    
    team.forEach((member, index) => {
        const delay = (index % 4) * 0.1;
        container.innerHTML += `
            <div class="member-card card fade-in" style="transition-delay: ${delay}s">
                <div class="member-img">
                    <img src="${member.photo}" alt="${member.name}" onerror="this.src='https://via.placeholder.com/400x400?text=No+Photo'">
                </div>
                <div class="member-info">
                    <h3 class="member-name">${member.name}</h3>
                    <p class="member-role">${member.role}</p>
                    <p class="member-branch">${member.branch}</p>
                </div>
            </div>
        `;
    });
    window.dispatchEvent(new Event('scroll')); // re-trigger animations
}

function switchEventTab(category) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
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
    window.dispatchEvent(new Event('scroll')); // re-trigger animations
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

function verifyAdminPin() {
    const pinInput = document.getElementById('admin-pin');
    const errorMsg = document.getElementById('admin-error');
    
    if (pinInput.value === 'navkis@202526') { // Hardcoded PIN
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        window.location.href = 'admin.html';
    } else {
        errorMsg.style.display = 'block';
        pinInput.value = '';
        setTimeout(() => { errorMsg.style.display = 'none'; }, 3000);
    }
}

function logoutAdmin() {
    sessionStorage.removeItem('isAdminLoggedIn');
    window.location.href = 'index.html';
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

// Generate Unique ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// --- EVENTS MANAGEMENT ---

function renderAdminEvents() {
    const tbody = document.getElementById('admin-events-list');
    if (!tbody) return;
    
    const events = JSON.parse(localStorage.getItem('abhyuday_events')) || [];
    tbody.innerHTML = '';
    
    events.forEach(evt => {
        tbody.innerHTML += `
            <tr>
                <td><img src="${evt.image}" alt="Event" onerror="this.src='https://via.placeholder.com/50?text=NA'"></td>
                <td><strong>${evt.name}</strong></td>
                <td>${evt.date}</td>
                <td><span style="padding: 4px 8px; background: rgba(255,121,0,0.2); color: var(--secondary); border-radius: 4px; font-size: 0.8rem; text-transform: capitalize;">${evt.category}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="btn-icon btn-edit" onclick="editEvent('${evt.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icon btn-delete" onclick="deleteEvent('${evt.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function openAddEventModal() {
    document.getElementById('event-form').reset();
    document.getElementById('event-id').value = '';
    document.getElementById('event-modal-title').textContent = 'Add Event';
    openModal('event-modal');
}

function saveEvent(e) {
    e.preventDefault();
    
    const id = document.getElementById('event-id').value;
    const name = document.getElementById('event-name').value;
    const date = document.getElementById('event-date').value;
    const image = document.getElementById('event-image').value;
    const category = document.getElementById('event-category').value;
    const desc = document.getElementById('event-desc').value;
    
    let events = JSON.parse(localStorage.getItem('abhyuday_events')) || [];
    
    if (id) {
        // Edit existing
        const index = events.findIndex(evt => evt.id === id);
        if (index !== -1) {
            events[index] = { id, name, date, image, category, desc };
            showToast('Event updated successfully!');
        }
    } else {
        // Add new
        const newEvent = { id: 'evt-' + generateId(), name, date, image, category, desc };
        events.push(newEvent);
        showToast('Event added successfully!');
    }
    
    localStorage.setItem('abhyuday_events', JSON.stringify(events));
    closeModal('event-modal');
    renderAdminEvents();
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
    
    document.getElementById('event-modal-title').textContent = 'Edit Event';
    openModal('event-modal');
}

function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        let events = JSON.parse(localStorage.getItem('abhyuday_events')) || [];
        events = events.filter(e => e.id !== id);
        localStorage.setItem('abhyuday_events', JSON.stringify(events));
        renderAdminEvents();
        showToast('Event deleted successfully!');
    }
}


// --- TEAM MANAGEMENT ---

function renderAdminTeam() {
    const tbody = document.getElementById('admin-team-list');
    if (!tbody) return;
    
    const team = JSON.parse(localStorage.getItem('abhyuday_team')) || [];
    tbody.innerHTML = '';
    
    team.forEach(member => {
        tbody.innerHTML += `
            <tr>
                <td><img src="${member.photo}" alt="Member" onerror="this.src='https://via.placeholder.com/50?text=NA'"></td>
                <td><strong>${member.name}</strong></td>
                <td>${member.role}</td>
                <td>${member.branch}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-icon btn-edit" onclick="editTeamMember('${member.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icon btn-delete" onclick="deleteTeamMember('${member.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function openAddTeamModal() {
    document.getElementById('team-form').reset();
    document.getElementById('team-id').value = '';
    document.getElementById('team-modal-title').textContent = 'Add Team Member';
    openModal('team-modal');
}

function saveTeamMember(e) {
    e.preventDefault();
    
    const id = document.getElementById('team-id').value;
    const name = document.getElementById('team-name').value;
    const role = document.getElementById('team-role').value;
    const branch = document.getElementById('team-branch').value;
    const photo = document.getElementById('team-photo').value;
    
    let team = JSON.parse(localStorage.getItem('abhyuday_team')) || [];
    
    if (id) {
        // Edit existing
        const index = team.findIndex(m => m.id === id);
        if (index !== -1) {
            team[index] = { id, name, role, branch, photo };
            showToast('Member updated successfully!');
        }
    } else {
        // Add new
        const newMember = { id: 'team-' + generateId(), name, role, branch, photo };
        team.push(newMember);
        showToast('Member added successfully!');
    }
    
    localStorage.setItem('abhyuday_team', JSON.stringify(team));
    closeModal('team-modal');
    renderAdminTeam();
}

function editTeamMember(id) {
    const team = JSON.parse(localStorage.getItem('abhyuday_team')) || [];
    const member = team.find(m => m.id === id);
    if (!member) return;
    
    document.getElementById('team-id').value = member.id;
    document.getElementById('team-name').value = member.name;
    document.getElementById('team-role').value = member.role;
    document.getElementById('team-branch').value = member.branch;
    document.getElementById('team-photo').value = member.photo;
    
    document.getElementById('team-modal-title').textContent = 'Edit Team Member';
    openModal('team-modal');
}

function deleteTeamMember(id) {
    if (confirm('Are you sure you want to delete this member?')) {
        let team = JSON.parse(localStorage.getItem('abhyuday_team')) || [];
        team = team.filter(m => m.id !== id);
        localStorage.setItem('abhyuday_team', JSON.stringify(team));
        renderAdminTeam();
        showToast('Member deleted successfully!');
    }
}
