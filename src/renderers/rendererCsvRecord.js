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
  { id: 'company-origin', name: 'companyOrigin' }
];

const dictionary = [
  { id: 'classroomNumber', name: 'Turma' },
  { id: 'militaryNumber', name: 'Matrícula' },
  { id: 'functionalName', name: 'Nome Funcional' },
  { id: 'name', name: 'Nome' },
  { id: 'rank', name: 'Graduação' },
  { id: 'role', name: 'Função' },
  { id: 'driverLicence', name: 'CNH' },
  { id: 'academicBackground', name: 'Formação Acadêmica' },
  { id: 'profissionalExperience', name: 'Experiência Profissional' },
  { id: 'firstPhone', name: 'Telefone 1' },
  { id: 'secondPhone', name: 'Telefone 2' },
  { id: 'street', name: 'Rua' },
  { id: 'houseNumber', name: 'Número da Residência' },
  { id: 'complement', name: 'Complemento' },
  { id: 'neighborhood', name: 'Bairro' },
  { id: 'city', name: 'Cidade' },
  { id: 'rpmOrigin', name: 'RPM de Origem' },
  { id: 'unitOrigin', name: 'Unidade de Origem' },
  { id: 'companyOrigin', name: 'Companhia de Origem' }
];

async function populateClassroomSelect() {
  try {
    const options = await window.api.getOptionsClassroom()
    const selectClassroom = document.querySelector('#classroom-number')
    
    options.forEach ((option) => {
      const optionElement = document.createElement('option')
      optionElement.value = option.id
      optionElement.textContent = option.classroomNumber
      selectClassroom.appendChild(optionElement)
    })

  } catch (error) {
    console.error('Erro ao preencher o select de turmas: ', error)
  }
}

async function populateCsvRecord() {
  
  const {csvData, ...csvRecord } = await window.api.loadCsvRecord();
  const errorsObj = await errorObjCreator(csvRecord);

  fields.forEach(field => {
    const element = document.getElementById(field.id);
    
    Object.keys(errorsObj).forEach(key => {
      if(field.name === key) {
        element.disabled = false;
        element.style.borderColor = 'red';
      }
    })
    
    if(element) element.value = csvRecord[field.name] || ''; 
 
  });

  populateErrorTable(errorsObj);
}

async function errorObjCreator(csvObject) {
  const errorsObj = {};

  Object.entries(csvObject.errors || csvObject).forEach(([chave, valor]) => {
    if (valor !== 'ok') {
      errorsObj[chave] = valor;
    }
  }); 

  return errorsObj;
}

function populateErrorTable(errorsObj) {
  
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = '';

  Object.entries(errorsObj).forEach(([key, value]) => {
    const tr = document.createElement('tr');
    let newKey = '';

    dictionary.forEach((dic) => { if (dic.id === key) newKey = dic.name });
    
    tr.innerHTML = `
      <th scope="row" class="text-center align-middle border">
      ${newKey}</th>
      <td class="text-center border">${value}</td>
    `;
    
    tbody.appendChild(tr);
  });

}

function gatherFormData() {
  
  const data = {};
  
  fields.forEach(field => {
    const element = document.getElementById(field.id);
    if (element) {
      data[field.name] = element.value || '';
    } else {
      console.warn(`Elemento com ID "${field.id}" não encontrado no DOM.`);
    }
  });
  
  return data;
}

function init() {
  document.addEventListener('DOMContentLoaded', async () => {
    
    try {
    
      await populateClassroomSelect();
      await populateCsvRecord();
 
      const btnCheck = document.querySelector('#btn-check');
      
      btnCheck.addEventListener('click', async () => {
        
        try {
          
          const updateRecord = gatherFormData();
          const result = await window.api.validateObject(updateRecord);
          const resultChecked = await window.api.validateObjectCsv(result);
          const errorObj = await errorObjCreator(resultChecked);

          if(Object.keys(errorObj).length > 0){
            populateErrorTable(errorObj);
          } else {

            const correctedRecord = await gatherFormData();
            correctedRecord.errors = resultChecked

            const question = await window.api.showDialogActivity({
              type: 'question',
              buttons: ['Sim', 'Não'],
              title: '[Sucesso]- Todos os erros foram corrigidos!',
              message: 'Deseja salvar as alterações?'
            });
            
            if (question === 0) {
              try {
                window.api.send('update-csv-data', correctedRecord);
                window.close();
              } catch (sendError) {
                console.error(
                  'Erro ao enviar os dados atualizados: ', sendError
                );
              }
            } else {
              populateErrorTable(errorObj);
            }
          }
         
        } catch (error) {
          console.error('Erro Misterioso: ', error);
        }
      })
   
    } catch (error) {
      console.error('Erro ao inicializar a página: ', error);
      await window.api.showDialogActivity({
        type: 'error',
        buttons: ['Ok'],
        message: 'Erro ao carregar os dados do registro.'
      });
    }
  });
}

init();