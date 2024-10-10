const fieldIds = [
  'classroom-number', 'military-number', 'functional-name', 'name', 'rank',
  'role', 'driver-licence', 'academic-background', 'profissional-experience',
  'first-phone', 'second-phone', 'street', 'house-number', 'complement',
  'neighborhood', 'city', 'rpm-origin', 'unit-origin', 'company-origin',
  'observation'
]

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
  
        const { id, data } = militaryInfo
  
        document.getElementById('classroom-number').value = 
          data.classroomNumber;
        document.getElementById('military-number').value = data.militaryNumber;
        document.getElementById('functional-name').value = data.functionalName;
        document.getElementById('name').value = data.name;
        document.getElementById('rank').value = data.rank;
        document.getElementById('first-phone').value = data.firstPhone;
        document.getElementById('second-phone').value = data.secondPhone;
        document.getElementById('street').value = data.street;
        document.getElementById('house-number').value = data.houseNumber;
        document.getElementById('complement').value = data.complement;
        document.getElementById('neighborhood').value = data.neighborhood;
        document.getElementById('city').value = data.city;
        document.getElementById('rpm-origin').value = data.rpmOrigin;
        document.getElementById('unit-origin').value = data.unitOrigin;
        document.getElementById('company-origin').value = data.companyOrigin;
        document.getElementById('role').value = data.role
        document.getElementById('observation').value = data.observation
        document.getElementById('driver-licence').value = data.driverLicence
        document.getElementById('profissional-experience').value = 
          data.profissionalExperience
        document.getElementById('academic-background').value = 
          data.academicBackground
  
        resolve({id: id, data: data})
      });
    } catch (error) {
      console.error('Erro ao carregar os dados do militar: ', error);
      reject(error)
    }
  })
}

function enableFields() {
  fieldIds.forEach(id => {
    document.getElementById(id).disabled = false;
  });
}

function disabledFields() {
  fieldIds.forEach(id => {
    document.getElementById(id).disabled = true;
  });
}

function init() {
  document.addEventListener('DOMContentLoaded', async () => {
    
    await populateClassroomSelect();
    const militaryInfo = await loadMilitaryData();

    const btnEdit = document.querySelector('#btn-edit')
    const btnDelete = document.querySelector('#btn-delete')

    btnEdit.addEventListener('click', async () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })

      if (!isEditing) {
        document.querySelector('#header').innerHTML = 'Editar Militar'
        enableFields()
        btnEdit.innerHTML = 'Salvar'
        btnDelete.style.display = 'none'
        document.title = 'Editar Militar'
        isEditing = true
      } else {
        document.querySelector('#header').innerHTML = 'Registro Militar'

        const updateData = {
          classroomNumber: document.getElementById('classroom-number').value,
          militaryNumber: document.getElementById('military-number').value,
          functionalName: document.getElementById('functional-name').value,
          name: document.getElementById('name').value,
          rank: document.getElementById('rank').value,
          firstPhone: document.getElementById('first-phone').value,
          secondPhone: document.getElementById('second-phone').value,
          street: document.getElementById('street').value,
          houseNumber: document.getElementById('house-number').value,
          complement: document.getElementById('complement').value,
          neighborhood: document.getElementById('neighborhood').value,
          city: document.getElementById('city').value,
          rpmOrigin: document.getElementById('rpm-origin').value,
          unitOrigin: document.getElementById('unit-origin').value,
          companyOrigin: document.getElementById('company-origin').value,
          role: document.getElementById('role').value,
          driverLicence: document.querySelector('#driver-licence').value,
          profissionalExperience: 
            document.querySelector('#profissional-experience').value,
          academicBackground: 
            document.querySelector('#academic-background').value,
          observation: document.getElementById('observation').value
        }

        try {
          btnEdit.disabled = true
          await window.api.updateMilitaryData(militaryInfo.id, updateData);
          //alert('Dados atualizados com sucesso!')
        } catch (error) {
          console.error('Erro ao atualizar dados: ', error)
          alert('Erro ao atualizar os dados.')
        } finally {
          btnEdit.innerHTML = 'Editar'
          btnDelete.style.display = 'inline'
          document.title = 'Registro Militar'
          isEditing = false
          btnEdit.disabled = false
        }

        // disabledFields()
        // btnEdit.innerHTML = 'Editar'
        // btnDelete.style.display = 'inline'
        // document.title = 'Registro Militar'   
        // isEditing = false
      }
      
    })

    btnDelete.addEventListener('click', async () => {
      const confirmDelete = 
        confirm('Tem certeza que deseja excluir este militar?')
      if (confirmDelete){
        try {
          await window.api.deleteMilitaryRecord(militaryInfo.id)
          alert('Militar excluído com sucesso!')
        } catch (error) {
          console.error('Erro ao deletar o militar: ', error)
          alert('Erro ao deletar o militar')
        }
      }
    })


  })
}

init()


