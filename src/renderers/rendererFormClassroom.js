window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#form-add-classroom')
  const message = document.querySelector('#alert');


  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const formData = {
      classroomNumber: document.querySelector('#classroom-number').value,
      monitor: document.querySelector('#monitor').value
    }

    const response = await window.api.addClassroomData(formData);

    if (response.available) {
      message.style.display = 'block'
      message.innerHTML = `
        <p class="text-center text-success">
          <i class="bi bi-patch-check-fill"></i>
          ${response.message}
          <i class="bi bi-patch-check-fill"></i>
        </p>`;
      form.reset()
    } else {
      message.style.display = 'block'
      message.innerHTML = `
        <p class="text-center text-danger">
          <i class="bi bi-x-octagon-fill"></i> 
          ${response.message} <i class="bi bi-x-octagon-fill"></i>
        </p>
        <p class="text-center text-danger">Turmas que já foram cadastradas:</p>
        <p class="text-center text-danger">${response.busyNumbers}</p>
      `
      form.reset()
    }
  })
})






