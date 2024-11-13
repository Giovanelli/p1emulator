const fields = [
  { id: 'classroom-number', name: 'classroomNumber' },
  { id: 'military-number', name: 'militaryNumber' },
  { id: 'functional-name', name: 'functionalName' },
  { id: 'name', name: 'name' },
  { id: 'rank', name: 'rank' },
  { id: 'role', name: 'role' },
  { id: 'driver-licence', name: 'driverLicence' },
  { id: 'academic-background', name: 'academicBackground' },
  { id: 'profissional-experience', name: 'profissionalExperience' },
  { id: 'first-phone', name: 'firstPhone' },
  { id: 'second-phone', name: 'secondPhone' },
  { id: 'street', name: 'street' },
  { id: 'house-number', name: 'houseNumber' },
  { id: 'complement', name: 'complement' },
  { id: 'neighborhood', name: 'neighborhood' },
  { id: 'city', name: 'city' },
  { id: 'rpm-origin', name: 'rpmOrigin' },
  { id: 'unit-origin', name: 'unitOrigin' },
  { id: 'company-origin', name: 'companyOrigin' },
];


function normalizeText(text) {
	return text.toLowerCase().trim();
}

function gatherFormData() {
  const data = {};
  fields.forEach(field => {
    const element = document.getElementById(field.id);
    if (element) {
      switch(element.id) {
        case (element.id === 'military-number'):
          data[field.name] = element.value.trim() || '';
          break;
        case (element.id === 'first-phone'):
          data[field.name] = element.value.trim() || '';
          break;
        case (element.id === 'second-phone'):
          data[field.name] = element.value.trim() || '';
          break;
        default:
          data[field.name] = normalizeText(element.value) || '';
          break;
      }
    } else {
      console.warn(`Elemento com ID "${field.id}" não encontrado no DOM.`);
    }
  });
  return data;
}


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

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const formData = gatherFormData();
   
    const response =  await window.api.addMilitaryData(formData);
    
    if (response.available) {
      const continueAdding = await window.api.showDialogActivity({
        type: 'info',
        buttons: ['Sim', 'Não'],
        title: '[Sucesso] - Militar cadastrado com sucesso!',
        message: 'Deseja continuar cadastrando?'
      });

      if (continueAdding === 0) {
        form.reset();
      } else {
        window.close();
      }
    } else {
      await window.api.showDialogActivity({
        type: 'error',
        buttons: ['Ok'],
        title: response.error,
        message: response.message
      });
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

