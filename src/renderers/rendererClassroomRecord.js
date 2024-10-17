const fieldIds = [
  'classroom-number', 'number-of-military', 'monitor'
]

const roleMapping = {
  "sem_funcao": "Sem Função",
  "auxiliar_p4": "Auxiliar de P4"
}

let isEditing = false


async function populateTable() {
  try {
    const data = await window.api.getCombinedData()
    console.log(data)
    const tbody = document.querySelector('tbody')
    tbody.innerHTML = ''

    if (!data || data.length === 0) {
      console.warn('Nenhum dado disponível para exibir.')
      return
    }

    const sortedData = data.sort((militaryA, militaryB) => {
      //First, sort the classroom by increasing number
      if (militaryA.classroomNumber !== militaryB.classroomNumber) {
        return militaryA.classroomNumber - militaryB.classroomNumber
      }
      
      //Prioritizes 'cabo' in the ordering
      if (militaryA.rank === 'cabo' && militaryB.rank !== 'cabo') { return -1 }
      if (militaryA.rank !== 'cabo' && militaryB.rank === 'cabo') { return 1 }

      return militaryA.rank.localeCompare(militaryB.rank);
    })

    //Calculate the start and end index of pagination.
    // const start = (page - 1) * itemsPerPage
    // const end = start + itemsPerPage
    // const paginatedData = sortedData.slice(start, end)

    

    sortedData.forEach((row) => {
      const roleFormatted = roleMapping[row.role] || row.role.toUpperCase()
      
      const tr = document.createElement('tr')
      tr.innerHTML = `
        <td class="text-center border">${row.militaryNumber}</td>
        <td class="text-center border">${row.rank}</td>
        <td class="text-center border">${row.functionalName}</td>
        <td class="text-center border">${roleFormatted}</td>
      `
      tbody.appendChild(tr)
    });
    
    //Update the state of the navigation buttons
    // updatePaginationControls(page, sortedData.length)
    // addEditLinkEventListeners()
  } catch (error) { console.error('Erro ao carregar dados: ', error) }
}


async function loadClassroomData() {
  return new Promise((resolve, reject) => {
    try {
      window.api.loadClassroomData((classroomInfo) => {
  
        const { id, data } = classroomInfo
  
        document.getElementById('classroom-number').value = 
          data.classroomNumber;
        document.getElementById('number-of-military').value = 
          data.numberOfMilitary;
        document.getElementById('monitor').value = data.monitor;
  
        resolve({id: id, data: data})
      });
    } catch (error) {
      console.error('Erro ao carregar os dados do militar: ', error);
      reject(error)
    }
  })
}

function enableFields() {
  document.querySelector('#classroom-number').disabled = false
  document.querySelector('#monitor').disabled = false
  document.querySelector('#observation').disabled = false
}

function disabledFields() {
  document.querySelector('#classroom-number').disabled = true
  document.querySelector('#monitor').disabled = true
}

function init() {
  document.addEventListener('DOMContentLoaded', async () => {
    const classroomInfo = await loadClassroomData();
    populateTable()

    const btnEdit = document.querySelector('#btn-edit')
    const btnDelete = document.querySelector('#btn-delete')

    btnEdit.addEventListener('click', async () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })

      if (!isEditing) {
        document.querySelector('#header').innerHTML = 'Editar Turma'
        enableFields()
        btnEdit.innerHTML = 'Salvar'
        btnDelete.style.display = 'none'
        document.title = 'Editar Turma'
        isEditing = true
      } else {
        document.querySelector('#header').innerHTML = 'Registro de Turma'
        const updateData = {
          classroomNumber: document.getElementById('classroom-number').value,
          monitor: document.getElementById('monitor').value
        }

        try {
          btnEdit.disabled = true
          await window.api.updateClassroomData(classroomInfo.id, updateData);
          disabledFields()
          //alert('Dados atualizados com sucesso!')
        } catch (error) {
          console.error('Erro ao atualizar dados: ', error)
          // alert('Erro ao atualizar os dados.')
        } finally {
          btnEdit.innerHTML = 'Editar'
          btnDelete.style.display = 'inline'
          document.title = 'Registro de Turma'
          isEditing = false
          btnEdit.disabled = false
        }
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


