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
});