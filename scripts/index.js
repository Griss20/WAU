document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const petCards = document.querySelectorAll('.pet-card');
  const searchInput = document.getElementById('pet-search');
  const visibleCountEl = document.getElementById('visible-count');
  const noResultsEl = document.getElementById('no-results');

  // Calcular totales para las tarjetas de resumen
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
    if (el) {
      el.textContent = counts[key];
    }
  });

  let currentFilter = 'todos';
  let searchTerm = '';

  const applyFilters = () => {
    let visibleCards = 0;

    petCards.forEach(card => {
      // Extraemos el contenido de texto para la búsqueda
      const textContent = card.textContent.toLowerCase();
      const matchesSearch = textContent.includes(searchTerm);
      
      // Obtenemos el estado para el filtro de botones
      const status = card.getAttribute('data-status');
      const matchesFilter = (currentFilter === 'todos') || (status === currentFilter);

      // Aplicar visualización basada en ambos filtros
      if (matchesSearch && matchesFilter) {
        card.style.display = 'grid'; // .pet-card usa display: grid
        visibleCards++;
      } else {
        card.style.display = 'none';
      }
    });

    // Actualizar el contador de resultados
    if (visibleCountEl) {
      visibleCountEl.textContent = visibleCards;
    }

    // Mostrar u ocultar mensaje de "sin resultados"
    if (noResultsEl) {
      if (visibleCards === 0) {
        noResultsEl.style.display = 'block';
      } else {
        noResultsEl.style.display = 'none';
      }
    }
  };

  // Inicializar el contador al cargar la página
  if (visibleCountEl) {
    visibleCountEl.textContent = petCards.length;
  }

  if (filterBtns.length > 0 && petCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remover clase activa de todos los botones
        filterBtns.forEach(b => b.classList.remove('active-filter'));
        // Agregar clase activa al botón clickeado
        btn.classList.add('active-filter');

        currentFilter = btn.getAttribute('data-filter');
        applyFilters();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase();
      applyFilters();
    });
  }

  // Validación del formulario de reporte
  const reportForm = document.querySelector('.report-form');
  if (reportForm) {
    // Deshabilitar validación nativa del navegador para usar la nuestra
    reportForm.setAttribute('novalidate', true);
    
    // Crear contenedor para los mensajes
    const msgContainer = document.createElement('div');
    msgContainer.style.marginTop = '1rem';
    msgContainer.style.fontWeight = '700';
    msgContainer.style.fontSize = '0.95rem';
    msgContainer.style.display = 'none';
    msgContainer.style.textAlign = 'center';
    reportForm.appendChild(msgContainer);

    reportForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Evitar envío automático
      
      const requiredFields = reportForm.querySelectorAll('[required]');
      let isValid = true;

      // Limpiar errores previos
      requiredFields.forEach(field => field.classList.remove('input-error'));

      // Validar campos vacíos y formato de número
      requiredFields.forEach(field => {
        const val = field.value.trim();
        
        if (!val) {
          isValid = false;
          field.classList.add('input-error');
        } else if (field.type === 'tel') {
          // Validar que el teléfono solo contenga números (se permiten espacios)
          const phoneRegex = /^[0-9\s]+$/;
          if (!phoneRegex.test(val) || val.replace(/\s/g, '').length < 6) {
            isValid = false;
            field.classList.add('input-error');
          }
        }
      });

      if (!isValid) {
        msgContainer.style.color = '#B42318'; // Rojo error
        msgContainer.textContent = 'Completa los campos obligatorios y asegúrate de que el teléfono solo tenga números.';
        msgContainer.style.display = 'block';
      } else {
        msgContainer.style.color = '#13795B'; // Verde éxito
        msgContainer.textContent = '¡Reporte enviado exitosamente! Nuestro equipo lo revisará pronto.';
        msgContainer.style.display = 'block';
        
        // Simular envío y resetear formulario
        setTimeout(() => {
          reportForm.reset();
          msgContainer.style.display = 'none';
        }, 4000);
      }
    });
  }

  // Botón flotante para volver arriba
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.innerHTML = '↑';
  scrollTopBtn.className = 'scroll-top-btn';
  scrollTopBtn.setAttribute('aria-label', 'Volver arriba');
  document.body.appendChild(scrollTopBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});