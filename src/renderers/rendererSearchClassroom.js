let currentPage = 1
const itemsPerPage = 10

// let currentSearchFilters = null
// let currentSimpleSearchField = null
// let currentSimpleSearchValue = null

async function populateTable(page = 1, filteredData = null) {
  try {
    const data = filteredData || await window.api.getClassroomData()
    const tbody = document.querySelector('tbody')
    tbody.innerHTML = ''

    if (!data || data.length === 0) {
      console.warn('Nenhum dado disponível para exibir.')
      return
    }

    //Calculate the start and end index of pagination.
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    const paginatedData = data.slice(start, end)

    paginatedData.forEach((row) => {
      
      const tr = document.createElement('tr')
      tr.innerHTML = `
        <th scope="row" class="text-center border">${row.classroomNumber}</th>
        <td class="text-center border">${row.numberOfMilitary}</td>
        <td class="text-center border">
        ${row.monitor === null ? 'Indefinido' : row.monitor}
        </td>
        <td class="text-center border">
          <a href="#" class="view-link" data-id="${row.id}">
            <i class="bi bi-eye-fill"></i>
          </a>
        </td>
      `
      tbody.appendChild(tr)
    });
    
    //Update the state of the navigation buttons
    updatePaginationControls(page, data.length)
    addEditLinkEventListeners()
  } catch (error) { console.error('Erro ao carregar dados: ', error) }
}

function addEditLinkEventListeners() {
  document.querySelectorAll('.view-link').forEach((link) => {
    link.addEventListener('click', async function(event) {
      event.preventDefault();  // Evitar o comportamento padrão do link
      const classroomId = this.getAttribute('data-id');  // Obter o ID do militar
      // Enviar o ID para o main.js via IPC
      window.api.viewClassroomRecord(classroomId);
    })
  })

}

function updatePaginationControls(page, totalItems) {
  //Math.ceil -> arredonda a divisão para cima.
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  document.querySelector('#prevButton').disabled = (page === 1)
  document.querySelector('#nextButton').disabled = (page >= totalPages)
}

// function clearSelectRadio() {
//   const selectedRadio = document.querySelector('input[name="options"]:checked')
//   const inputSearch = document.querySelector('#input-search')
  
//   if (selectedRadio) { selectedRadio.checked = false }

//   inputSearch.value = ''
// }

async function handleFormSubmit(event) {
  event.preventDefault()

  const radio = document.querySelector('input[name="options"]:checked')
  const inputSearch = document.querySelector('#input-search').value

  if (radio && inputSearch.trim() !== '') {
    //Aqui será feita a pesquisa simples
    let fieldSearch = radio.id === 'radio-military-number' 
        ? 'militaryNumber' 
        : radio.id === 'radio-name'
        ? 'name'
        : 'functionalName'
    
    try {
      const filteredData =  await window.api.simpleSearchMilitary(
        fieldSearch, 
        inputSearch
      );
    
      await populateTable(1, filteredData)
    } catch (error) {
      console.error('Erro ao buscar dados na pesquisa simples: ', error)
    }
  } else if (!radio) {
    // Aqui será feita a pesquisa avançada
    const advancedSearchData = {
      rpmOrigin: document.querySelector('#rpm-origin').value,
      unitOrigin: document.querySelector('#unit-origin').value,
      companyOrigin: document.querySelector('#company-origin').value,
      classroomNumber: document.querySelector('#classroom-number').value,
      rank: document.querySelector('#rank').value,
      role: document.querySelector('#role').value
    }

    try {
      const searchResults = 
        await window.api.advancedSearchMilitary(advancedSearchData)
      
      await populateTable(1, searchResults)
      //Limpa o formulário após a busca
      document.querySelector('#form-search').reset() 
    } catch (error) {
      console.error('Erro na pesquisa avançada: ', error)
    }
  } else {
    alert('Por favor, insira um valor para a busca.')
  }
}

function init () {
  document.addEventListener('DOMContentLoaded', async () =>   {
    const formSearch = document.querySelector('#form-search')
    // const radioButtons = document.querySelectorAll('input[name="options"]')

    await populateTable(currentPage)

    formSearch.addEventListener('submit', handleFormSubmit);

    document.querySelector('#btn-refresh').addEventListener(
      'click', 
      async () => await populateTable(currentPage)
    )

    //Add pagination events
    document.querySelector('#prevButton').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--
        populateTable(currentPage)
      }
    })

    document.querySelector('#nextButton').addEventListener('click', () => {
      currentPage++
      populateTable(currentPage)
    })

  })
}

init()