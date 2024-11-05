
function loadClassroomOptions() {
  window.api.getOptionsClassroom().then((options) => {
    const selectClassroom = document.querySelector('#classroom-number');
    selectClassroom.innerHTML = '';
  
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.id;
      optionElement.textContent = option.classroomNumber;
      selectClassroom.appendChild(optionElement);
    });
  }).catch((err) => {
    console.error('Failed to load classroom options:', err);
  });
}

function handleFormSubmit() {
  const form = document.querySelector('#form-add-military');

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = {
      classroomNumber: document.querySelector('#classroom-number').value,
      militaryNumber: document.querySelector('#military-number').value,
      functionalName: document.querySelector('#functional-name').value
        .toLowerCase(),
      name: document.querySelector('#name').value.toLowerCase(),
      rank: document.querySelector('#rank').value,
      role: document.querySelector('#role').value,
      firstPhone: document.querySelector('#first-phone').value,
      secondPhone: document.querySelector('#second-phone').value,
      street: document.querySelector('#street').value.toLowerCase(),
      houseNumber: document.querySelector('#house-number').value.toLowerCase(),
      complement: document.querySelector('#complement').value.toLowerCase(),
      neighborhood: document.querySelector('#neighborhood').value.toLowerCase(),
      city: document.querySelector('#city').value.toLowerCase(),
      rpmOrigin: document.querySelector('#rpm-origin').value.toLowerCase(),
      unitOrigin: document.querySelector('#unit-origin').value.toLowerCase(),
      companyOrigin: document.querySelector('#company-origin').value
        .toLowerCase(),
      driverLicence: document.querySelector('#driver-licence').value,
      profissionalExperience: document.querySelector('#profissional-experience')
        .value.toLowerCase(),
      academicBackground: document.querySelector('#academic-background').value
        .toLowerCase()
    };
   
    try {
      window.api.sendMilitaryData(JSON.stringify(formData));
      alert('Militar cadastrado com sucesso!');
      const continueAdd = confirm('Continuar Cadastrando?');
      if (!continueAdd) window.close();

    } catch (error) {
      console.error('Erro ao cadastrar militar: ', error);
      alert('Erro ao cadastrar militar.');
    }
  });
}

function init() {
  document.addEventListener('DOMContentLoaded', () => {
    loadClassroomOptions();
    handleFormSubmit();
  });
}

init();
