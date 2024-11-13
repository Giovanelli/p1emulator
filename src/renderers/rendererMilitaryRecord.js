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
  { id: 'observation', name: 'observation' }
];

let isEditing = false

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

async function loadMilitaryData() {
  return new Promise((resolve, reject) => {
    try {
      window.api.loadMilitaryData((militaryInfo) => {
        if (!militaryInfo || !militaryInfo.data) {
          console.error('Dados de militar não encontrados');
          return reject('Dados de militar ausentes');
        }

        // Preencher dados no formulário usando o array fields
        fields.forEach(field => {
          const element = document.getElementById(field.id);
          if (element) {
            // Definir valor padrão vazio
            element.value = militaryInfo.data[field.name] || ''; 
          } else {
            console.warn(`Elemento com ID "${field.id}" não encontrado no DOM.`);
          }
        });

        resolve({ id: militaryInfo.id, data: militaryInfo.data });
      });
    } catch (error) {
      console.error('Erro ao carregar os dados do militar:', error);
      reject(error);
    }
  });
}


function enableFields() {
  fields.forEach(field => {
    document.getElementById(field.id).disabled = false;
  });
}

function disabledFields() {
  fields.forEach(field => {
    document.getElementById(field.id).disabled = true;
  });
}


async function handleEdit(militaryInfo, btnEdit, btnDelete) {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!isEditing) {
    setEditingMode(true, btnEdit, btnDelete);
  } else {
    const updateData = gatherFormData();
    
    try {
      await window.api.updateMilitaryData(militaryInfo.id, updateData);
      await window.api.showDialogActivity({
        type: 'info',
        buttons: ['Ok'],
        message: 'Dados atualizados com sucesso!'
      });
      setEditingMode(false, btnEdit, btnDelete);
    } catch (error) {
      console.error('Erro ao atualizar dados: ', error);
      await window.api.showDialogActivity({
        type: 'warning',
        buttons: ['Ok'],
        message: 'Erro ao atualizar os dados!'
      });
      btnEdit.disabled = false;
    }
  }
}

async function handleDelete(militaryInfo) {
  const confirmDelete = await window.api.showDialogActivity({
    type: 'warning',
    buttons: ['Sim', 'Não'],
    title: 'Deleção de Registro',
    message: 'Tem certeza que deseja excluir o militar?'
  });

  if (confirmDelete === 0) {
    try {
      await window.api.deleteMilitaryRecord(militaryInfo);
      await window.api.showDialogActivity({
        type: 'info',
        buttons: ['Ok'],
        message: 'Militar deletado com sucesso!'
      });
      window.close();
    } catch (error) {
      console.error('Erro ao deletar o militar: ', error);
      await window.api.showDialogActivity({
        type: 'info',
        buttons: ['Ok'],
        message: 'Erro ao deletar o militar.'
      });
    }
  }
}


function setEditingMode(isEditingMode, btnEdit, btnDelete) {
  const header = document.querySelector('#header');
  if (header) {
    header.textContent = isEditingMode ? 'Editar Militar' : 'Registro Militar';
  } 
  
  isEditingMode ? enableFields() : disabledFields();
  
  btnEdit.textContent = isEditingMode ? 'Salvar' : 'Editar';
  btnDelete.style.display = isEditingMode ? 'none' : 'inline';
  document.title = isEditingMode ? 'Editar Militar' : 'Registro Militar';

  isEditing = isEditingMode;
}

function gatherFormData() {
  const data = {};
  fields.forEach(field => {
    const element = document.getElementById(field.id);
    if (element) {
      data[field.name] = element.value.trim() || ''; // Valor padrão vazio e remoção de espaços
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
      const militaryInfo = await loadMilitaryData();

      const btnEdit = document.querySelector('#btn-edit');
      const btnDelete = document.querySelector('#btn-delete');

      btnEdit.addEventListener('click', () => { 
        handleEdit(militaryInfo, btnEdit, btnDelete)
      });

      btnDelete.addEventListener('click', () => handleDelete(militaryInfo));

    } catch (error) {
      console.error('Erro ao inicializar a página: ', error);
      await window.api.showDialogActivity({
        type: 'info',
        buttons: ['Ok'],
        message: 'Erro ao carregar os dados do registro.'
      });
    }

    console.log(gatherFormData());
  });
}

init();


