


window.api.getOptionsClassroom().then((options) => {
  const selectClassroom = document.querySelector('#classroom-number');
  selectClassroom.innerHTML = '';

  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.id;
    optionElement.textContent = option.classroomNumber;
    selectClassroom.appendChild(optionElement);
  });
});


const form = document.querySelector('#form-add-military');

form.addEventListener('submit', (event) => {
  // event.preventDefault()
  
  const formData = {
    classroomNumber: document.querySelector('#classroom-number').value,
    militaryNumber: document.querySelector('#military-number').value,
    functionalName: document.querySelector('#functional-name').value,
    name: document.querySelector('#name').value,
    rank: document.querySelector('#rank').value,
    role: document.querySelector('#role').value,
    firstPhone: document.querySelector('#first-phone').value,
    secondPhone: document.querySelector('#second-phone').value,
    street: document.querySelector('#street').value,
    houseNumber: document.querySelector('#house-number').value,
    complement: document.querySelector('#complement').value,
    neighborhood: document.querySelector('#neighborhood').value,
    city: document.querySelector('#city').value,
    rpmOrigin: document.querySelector('#rpm-origin').value,
    unitOrigin: document.querySelector('#unit-origin').value,
    companyOrigin: document.querySelector('#company-origin').value,
    driverLicence: document.querySelector('#driver-licence').value,
    profissionalExperience: 
      document.querySelector('#profissional-experience').value,
    academicBackground: document.querySelector('#academic-background').value
  }

  try {
    window.api.sendMilitaryData(JSON.stringify(formData))
    alert('Militar cadastrado com sucesso!')
    const contineAdd = confirm('Continuar Cadastrando?')
    if (!contineAdd) window.close()

  } catch (error) {
    console.error('Erro ao cadastrar militar: ', error)
    alert('Erro ao cadastrar militar.')
  }
})


