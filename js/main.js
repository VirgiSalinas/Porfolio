// ============================
// FAVORITOS - PROYECTOS
// ============================

const favButtons = document.querySelectorAll('.btn-fav');
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

favButtons.forEach(button => {
  const id = button.dataset.id;

  // Estado inicial
  if (favorites.includes(id)) {
    button.classList.add('active');
    button.textContent = '★';
  }

  button.addEventListener('click', () => {
    if (favorites.includes(id)) {
      favorites = favorites.filter(fav => fav !== id);
      button.classList.remove('active');
      button.textContent = '☆';
    } else {
      favorites.push(id);
      button.classList.add('active');
      button.textContent = '★';
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
  });
});


// ============================
// FORMULARIO DE CONTACTO
// ============================

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const mail = document.getElementById('mail').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !lastname || !mail || !message) {
      alert('Por favor completá todos los campos');
      return;
    }

    // Guardar mensaje (simulado)
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push({ name, lastname, mail, message });

    localStorage.setItem('messages', JSON.stringify(messages));

    alert('Mensaje enviado con éxito 💚');
    contactForm.reset();
  });
}
