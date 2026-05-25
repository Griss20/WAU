document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const petCards = document.querySelectorAll('.pet-card');
  const searchInput = document.getElementById('pet-search');

  let currentFilter = 'todos';
  let searchTerm = '';

  const applyFilters = () => {
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
      } else {
        card.style.display = 'none';
      }
    });
  };

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