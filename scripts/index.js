document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const petCards = document.querySelectorAll('.pet-card');

  if (filterBtns.length > 0 && petCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remover clase activa de todos los botones
        filterBtns.forEach(b => b.classList.remove('active-filter'));
        // Agregar clase activa al botón clickeado
        btn.classList.add('active-filter');

        const filterValue = btn.getAttribute('data-filter');

        // Filtrar tarjetas
        petCards.forEach(card => {
          if (filterValue === 'todos') {
            card.style.display = 'grid'; // .pet-card usa display: grid
          } else {
            const status = card.getAttribute('data-status');
            if (status === filterValue) {
              card.style.display = 'grid';
            } else {
              card.style.display = 'none';
            }
          }
        });
      });
    });
  }
});