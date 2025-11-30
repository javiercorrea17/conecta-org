const defaultState = {
    currentUser: null,
    events: [
        {
            id: 1,
            title: "Limpieza de Playa",
            date: "2025-12-15",
            description: "Únete a nosotros para limpiar la playa central.",
            target: 20,
            image: "https://images.unsplash.com/photo-1618477461853-5f8dd68aa395?auto=format&fit=crop&w=500&q=60",
            registeredVolunteers: [1, 3]
        },
        {
            id: 2,
            title: "Taller de Reciclaje",
            date: "2025-12-20",
            description: "Aprende a reciclar correctamente y crea arte.",
            target: 15,
            image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=500&q=60",
            registeredVolunteers: [2]
        }
    ],
    volunteers: [
        { id: 1, name: "Ana García", email: "ana@example.com", skills: "Primeros Auxilios", status: "active" },
        { id: 2, name: "Carlos Ruiz", email: "carlos@example.com", skills: "Carpintería", status: "active" },
        { id: 3, name: "Elena Torres", email: "elena@example.com", skills: "Redes Sociales", status: "active" }
    ]
};

let appState = JSON.parse(localStorage.getItem('conectaOngState')) || defaultState;

function saveState() {
    localStorage.setItem('conectaOngState', JSON.stringify(appState));
}

function navigateTo(viewId) {
    closeModal();

    // 1. Manejo del Home
    if (viewId === 'home') {
        document.querySelectorAll('.view').forEach(view => view.classList.add('hidden'));
        document.getElementById('home-view').classList.remove('hidden');
        return;
    }

    // 2. Auth Check
    if (['dashboard', 'events', 'volunteers'].includes(viewId) && !appState.currentUser) {
        showLoginModal();
        return;
    }

    // 3. Cambiar Vista (Ocultar todas, mostrar la elegida)
    document.querySelectorAll('.view').forEach(view => view.classList.add('hidden'));
    const targetView = document.getElementById(`${viewId}-view`);
    if (targetView) {
        targetView.classList.remove('hidden');
        if (viewId === 'dashboard') renderDashboard();
        if (viewId === 'events') renderEvents();
        if (viewId === 'volunteers') renderVolunteers();
    }

    // 4. Actualizar Menú Activo (FIX DEL MENÚ)
    updateActiveMenu(viewId);
}

// Función dedicada para resaltar el menú
function updateActiveMenu(viewId) {
    // Quitar clase 'active' de todos los links
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));

    // Buscar el link específico por ID y activarlo
    const activeLink = document.getElementById(`nav-${viewId}`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function logout(e) {
    if (e) e.preventDefault();

    // Borrar usuario
    appState.currentUser = null;
    saveState();

    // Forzar actualización inmediata de la UI
    const authLinks = document.getElementById('auth-links');
    const loginBtn = document.getElementById('login-btn');
    if (authLinks) authLinks.classList.add('hidden');
    if (loginBtn) loginBtn.classList.remove('hidden');

    // Ir al inicio
    navigateTo('home');
}

// --- Renderers ---
function renderDashboard() {
    const activeCount = document.getElementById('active-events-count');
    if (activeCount) activeCount.textContent = appState.events.length;

    const volCount = document.getElementById('total-volunteers-count');
    if (volCount) volCount.textContent = appState.volunteers.length;

    const totalHours = appState.events.reduce((acc, event) => acc + (event.registeredVolunteers.length * 5), 0);
    const impactHours = document.getElementById('impact-hours');
    if (impactHours) impactHours.textContent = totalHours;
}

function renderEvents() {
    const container = document.getElementById('events-list');
    if (!container) return;

    if (appState.events.length === 0) {
        container.innerHTML = '<div class="card text-center" style="grid-column: 1/-1;">No hay eventos activos.</div>';
        return;
    }

    container.innerHTML = appState.events.map(event => {
        const percentage = (event.registeredVolunteers.length / event.target) * 100;
        const dateObj = new Date(event.date);
        const day = dateObj.getDate() + 1;
        const month = dateObj.toLocaleString('es-ES', { month: 'short' });

        return `
            <div class="event-card">
                <div class="event-image" style="background-image: url('${event.image}')">
                    <div class="event-date-badge">
                        <span class="event-date-day">${day}</span>
                        <span class="event-date-month">${month}</span>
                    </div>
                </div>
                <div class="event-content">
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                    <div class="progress-container">
                        <div class="progress-labels">
                            <span>Inscritos</span>
                            <span>${event.registeredVolunteers.length} / ${event.target}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%; background-color: var(--primary);"></div>
                        </div>
                    </div>
                    <div class="event-footer">
                        <button class="btn btn-outline" style="width: 100%" onclick="showEventDetails(${event.id})">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderVolunteers() {
    const container = document.getElementById('volunteers-list');
    if (!container) return;

    container.innerHTML = appState.volunteers.map(vol => {
        const userEvents = appState.events.filter(e => e.registeredVolunteers.includes(vol.id));
        const eventNames = userEvents.length > 0
            ? userEvents.map(e => `<span style="display:inline-block; background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px; font-size:0.7rem; margin-right:4px; margin-bottom:4px;">${e.title}</span>`).join('')
            : '<span style="color: var(--text-muted); font-size: 0.8rem;">Sin eventos</span>';

        return `
        <tr>
            <td><strong>${vol.name}</strong></td>
            <td>${vol.email}</td>
            <td>${vol.skills}</td>
            <td>${eventNames}</td>
            <td><span class="status-badge status-active">Activo</span></td>
        </tr>
    `}).join('');
}

// --- Modals ---
function closeModal() {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.classList.add('hidden');
}

function openModalHTML(htmlContent) {
    const container = document.getElementById('modal-container');
    container.innerHTML = htmlContent;
    container.classList.remove('hidden');
}

function showLoginModal() {
    openModalHTML(`
        <div class="modal">
            <div class="modal-header">
                <h3>Acceso Administrativo</h3>
                <button class="btn-outline" style="border:none;" onclick="closeModal()">✕</button>
            </div>
            <div class="modal-body">
                <form onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" value="admin@conectaong.org" required>
                    </div>
                    <div class="form-group">
                        <label>Contraseña</label>
                        <input type="password" value="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%">Ingresar</button>
                </form>
            </div>
        </div>
    `);
}

function showCreateEventModal() {
    openModalHTML(`
        <div class="modal">
            <div class="modal-header">
                <h3>Crear Nuevo Evento</h3>
                <button class="btn-outline" style="border:none;" onclick="closeModal()">✕</button>
            </div>
            <div class="modal-body">
                <form onsubmit="handleCreateEvent(event)">
                    <div class="form-group">
                        <label>Título</label>
                        <input type="text" name="title" required>
                    </div>
                    <div class="form-group">
                        <label>Fecha</label>
                        <input type="date" name="date" required>
                    </div>
                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea name="description" rows="2" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Meta de Voluntarios</label>
                        <input type="number" name="target" value="10" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%">Publicar Evento</button>
                </form>
            </div>
        </div>
    `);
}

function showCreateVolunteerModal() {
    openModalHTML(`
        <div class="modal">
            <div class="modal-header">
                <h3>Registrar Nuevo Voluntario</h3>
                <button class="btn-outline" style="border:none;" onclick="closeModal()">✕</button>
            </div>
            <div class="modal-body">
                <form onsubmit="handleCreateVolunteer(event)">
                    <div class="form-group">
                        <label>Nombre Completo</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label>Habilidades</label>
                        <input type="text" name="skills" placeholder="Ej: Cocina, Logística">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%">Guardar Voluntario</button>
                </form>
            </div>
        </div>
    `);
}

function showRegisterToEventModal(eventId) {
    const event = appState.events.find(e => e.id === eventId);
    const volunteerOptions = appState.volunteers.map(v =>
        `<option value="${v.id}">${v.name} (${v.email})</option>`
    ).join('');

    openModalHTML(`
        <div class="modal">
            <div class="modal-header">
                <h3>Inscribir a: ${event.title}</h3>
                <button class="btn-outline" style="border:none;" onclick="closeModal()">✕</button>
            </div>
            <div class="modal-body">
                <form onsubmit="handleInscription(event, ${eventId})">
                    <div class="form-group">
                        <label>Seleccionar Voluntario Existente</label>
                        <select id="volunteerSelect" name="existingId" onchange="toggleNewVolunteerFields(this)">
                            <option value="">-- Seleccionar --</option>
                            ${volunteerOptions}
                            <option value="new" style="color: var(--primary); font-weight:bold;">+ Crear Nuevo Voluntario</option>
                        </select>
                    </div>
                    <div id="newVolunteerFields" class="hidden" style="border-top: 1px solid var(--glass-border); padding-top: 1rem; margin-top: 1rem;">
                        <p style="margin-bottom:1rem; color:var(--primary);">Datos del Nuevo Voluntario:</p>
                        <div class="form-group">
                            <label>Nombre Completo</label>
                            <input type="text" name="name">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" name="email">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%">Confirmar Inscripción</button>
                </form>
            </div>
        </div>
    `);
}

function showEventDetails(eventId) {
    const event = appState.events.find(e => e.id === eventId);
    const volunteerList = event.registeredVolunteers.map(id => {
        const vol = appState.volunteers.find(v => v.id === id);
        return vol ? `<li style="padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);">${vol.name}</li>` : '';
    }).join('');

    openModalHTML(`
        <div class="modal">
            <div class="modal-header">
                <h3>${event.title}</h3>
                <button class="btn-outline" style="border:none;" onclick="closeModal()">✕</button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 1rem; color: var(--text-muted);">${event.description}</p>
                <h4 style="margin-bottom: 0.5rem; color: var(--primary);">Voluntarios Inscritos (${event.registeredVolunteers.length})</h4>
                <ul style="list-style: none; max-height: 150px; overflow-y: auto; margin-bottom: 1.5rem;">
                    ${volunteerList || '<li>No hay inscritos aún.</li>'}
                </ul>
                <button class="btn btn-primary" style="width:100%" onclick="showRegisterToEventModal(${event.id})">
                    Inscribir Voluntario
                </button>
            </div>
        </div>
    `);
}

function toggleNewVolunteerFields(selectElement) {
    const fields = document.getElementById('newVolunteerFields');
    if (selectElement.value === 'new') {
        fields.classList.remove('hidden');
    } else {
        fields.classList.add('hidden');
    }
}

// --- Handlers ---
function handleLogin(e) {
    e.preventDefault();
    appState.currentUser = { name: "Admin" };
    saveState();
    closeModal();
    navigateTo('dashboard');
}

function handleCreateEvent(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEvent = {
        id: Date.now(),
        title: formData.get('title'),
        date: formData.get('date'),
        description: formData.get('description'),
        target: parseInt(formData.get('target')),
        image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=500&q=60",
        registeredVolunteers: []
    };
    appState.events.unshift(newEvent);
    saveState();
    closeModal();
    renderDashboard();
    renderEvents();
}

function handleCreateVolunteer(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newVol = {
        id: Date.now(),
        name: formData.get('name'),
        email: formData.get('email'),
        skills: formData.get('skills') || "General",
        status: "active"
    };
    appState.volunteers.push(newVol);
    saveState();
    closeModal();
    renderVolunteers();
    renderDashboard();
    alert("Voluntario creado exitosamente");
}

function handleInscription(e, eventId) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const existingId = formData.get('existingId');
    let volId;

    if (existingId === 'new') {
        const email = formData.get('email');
        const name = formData.get('name');
        if (!email || !name) { alert("Por favor completa nombre y email"); return; }

        const newVol = { id: Date.now(), name: name, email: email, skills: "General", status: "active" };
        appState.volunteers.push(newVol);
        volId = newVol.id;
    } else if (existingId) {
        volId = parseInt(existingId);
    } else {
        alert("Selecciona un voluntario");
        return;
    }

    const event = appState.events.find(ev => ev.id === eventId);
    if (!event.registeredVolunteers.includes(volId)) {
        event.registeredVolunteers.push(volId);
        saveState();
        alert(`Inscripción exitosa`);
        closeModal();
        renderEvents();
        renderDashboard();
    } else {
        alert("Este voluntario ya está inscrito.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (appState.currentUser) {
        navigateTo('dashboard');
    }
});