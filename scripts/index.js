/**
 * WAU Piura - Scripts principales
 * Organizado por responsabilidades: Filtros, Búsqueda, Validaciones y Eventos UI.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCatalogFilters();
  initFormValidation('.report-form');
  initScrollAnimations();
  initScrollTopButton();
});

// ==========================================
// 1. FILTROS Y BÚSQUEDA (Catálogo)
// ==========================================
function initCatalogFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const petCards = document.querySelectorAll('.pet-card');
  const searchInput = document.getElementById('pet-search');
  const visibleCountEl = document.getElementById('visible-count');
  const noResultsEl = document.getElementById('no-results');

  if (petCards.length === 0) return; // Si no estamos en el catálogo o no hay tarjetas

  let currentFilter = 'todos';
  let searchTerm = '';

  // Calcular totales para tarjetas resumen
  const counts = {
    todos: petCards.length,
    evaluacion: 0,
    tratamiento: 0,
    recuperacion: 0,
    disponible: 0
  };

  petCards.forEach(card => {
    const status = card.getAttribute('data-status');
    if (counts[status] !== undefined) {
      counts[status]++;
    }
  });

  // Actualizar el DOM con los totales
  Object.keys(counts).forEach(key => {
    const el = document.getElementById(`count-${key}`);
    if (el) el.textContent = counts[key];
  });

  if (visibleCountEl) visibleCountEl.textContent = petCards.length;

  const applyFilters = () => {
    let visibleCards = 0;

    petCards.forEach(card => {
      // Búsqueda por texto (nombre, raza, estado)
      const textContent = card.textContent.toLowerCase();
      const matchesSearch = textContent.includes(searchTerm);
      
      // Filtro por estado
      const status = card.getAttribute('data-status');
      const matchesFilter = (currentFilter === 'todos') || (status === currentFilter);

      // Mostrar u ocultar la tarjeta
      if (matchesSearch && matchesFilter) {
        card.style.display = 'grid'; // .pet-card usa display: grid
        visibleCards++;
      } else {
        card.style.display = 'none';
      }
    });

    if (visibleCountEl) visibleCountEl.textContent = visibleCards;
    
    if (noResultsEl) {
      noResultsEl.style.display = (visibleCards === 0) ? 'block' : 'none';
    }
  };

  // Eventos de botones de filtro
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active-filter'));
        btn.classList.add('active-filter');
        
        currentFilter = btn.getAttribute('data-filter');
        applyFilters();
      });
    });
  }

  // Evento de caja de búsqueda
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase();
      applyFilters();
    });
  }
}

// ==========================================
// 2. VALIDACIONES DE FORMULARIOS
// ==========================================
function initFormValidation(selector) {
  const form = document.querySelector(selector);
  if (!form) return;

  // Deshabilitar validación nativa del navegador
  form.setAttribute('novalidate', true);
  
  // Contenedor para mensajes de estado
  const msgContainer = document.createElement('div');
  msgContainer.style.marginTop = '1rem';
  msgContainer.style.fontWeight = '700';
  msgContainer.style.fontSize = '0.95rem';
  msgContainer.style.display = 'none';
  msgContainer.style.textAlign = 'center';
  form.appendChild(msgContainer);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    // Limpiar errores visuales previos
    requiredFields.forEach(field => field.classList.remove('input-error'));

    requiredFields.forEach(field => {
      const val = field.value.trim();
      
      if (!val) {
        isValid = false;
        field.classList.add('input-error');
      } else if (field.type === 'tel') {
        const phoneRegex = /^[0-9\s]+$/;
        if (!phoneRegex.test(val) || val.replace(/\s/g, '').length < 6) {
          isValid = false;
          field.classList.add('input-error');
        }
      }
    });

    if (!isValid) {
      msgContainer.style.color = '#B42318';
      msgContainer.textContent = 'Completa los campos obligatorios y asegúrate de que el teléfono solo tenga números.';
      msgContainer.style.display = 'block';
    } else {
      msgContainer.style.color = '#13795B';
      msgContainer.textContent = '¡Enviado exitosamente! Nuestro equipo lo revisará pronto.';
      msgContainer.style.display = 'block';
      
      // Simular envío y resetear
      setTimeout(() => {
        form.reset();
        msgContainer.style.display = 'none';
      }, 4000);
    }
  });
}

// ==========================================
// 3. ANIMACIONES DE SCROLL (Observer)
// ==========================================
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll('.workflow-step, .support-card, .testimonial-card, .pet-card, .tracking-summary, .timeline-card, .info-card, .notes-card, .urgent-card');
  
  animateElements.forEach((el, index) => {
    el.classList.add('fade-in-section');
    // Retraso escalonado para dar efecto cascada
    el.style.transitionDelay = `${(index % 3) * 0.1}s`;
    observer.observe(el);
  });
}

// ==========================================
// 4. EVENTOS DE INTERFAZ (UI)
// ==========================================
function initScrollTopButton() {
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.innerHTML = '↑';
  scrollTopBtn.className = 'scroll-top-btn';
  scrollTopBtn.setAttribute('aria-label', 'Volver arriba');
  document.body.appendChild(scrollTopBtn);

  // Aparecer después de 300px
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  // Ir arriba fluidamente
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}