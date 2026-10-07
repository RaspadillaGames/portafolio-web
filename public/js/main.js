const form = document.getElementById('form-contacto')

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const datos = Object.fromEntries(new FormData(form))

    fetch('/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    }).then((res) => {
      if (res.ok) window.location.href = 'confirmacion.html'
    })
  })
}
