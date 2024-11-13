import { updateInputRestriction } from '../public/js/updateInputRestriction.js';

let currentPage = 1;
const itemsPerPage = 10;

const radios = document.querySelectorAll('input[name="options"');
const inputSearch = document.querySelector('#input-search');


async function populateTable(page = 1, filteredData = null) {
  try {
    const data = filteredData || await window.api.getClassroomData()
    
    const tbody = document.querySelector('tbody')
    tbody.innerHTML = ''

    //Essa parte deve ser arrumada
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
        ${(row.monitor === null || row.monitor === '') ? 'Indefinido' : row.monitor}
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
      const classroomId = this.getAttribute('data-id');  // Obter o ID da turma
      window.api.viewClassroomRecord(classroomId);
    })
  })

}

function updatePaginationControls(page, totalItems) {
  //Math.ceil -> arredonda a divisão para cima.
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const prevButton = document.querySelector('#prevButton');
  const nextButton = document.querySelector('#nextButton');

  prevButton.disabled = (page === 1);
  nextButton.disabled = (page >= totalPages);
    
  prevButton.innerHTML = (page === 1)
    ? '<i class="bi bi-caret-left"></i>'  
    : '<i class="bi bi-caret-left-fill"></i>'; 

  nextButton.innerHTML = (page >= totalPages)
    ? '<i class="bi bi-caret-right"></i>' 
    : '<i class="bi bi-caret-right-fill"></i>'; 
}


async function handleFormSubmit(event) {
  event.preventDefault();

  const radioChecked = document.querySelector('input[name="options"]:checked');
  const inputSearch = 
    document.querySelector('#input-search').value.toLowerCase().trim();
  

  if (radioChecked && inputSearch !== '') {
    //Aqui será feita a pesquisa simples
    let fieldSearch = 
    radioChecked.id === 'radio-classroom-number' 
        ? 'classroomNumber' 
        : 'monitor';
    
    try {
      const filteredData =  
        await window.api.searchClassroom(fieldSearch, inputSearch);

      console.log(filteredData)

      await populateTable(1, filteredData);
    } catch (error) {
      console.error('Erro ao buscar dados na pesquisa simples: ', error);
    }
  } else {
    alert('Por favor, insira um valor para a busca.');
  }
}

function init () {
  document.addEventListener('DOMContentLoaded', async () =>   {
    const formSearch = document.querySelector('#form-search');

    radios.forEach(radio => {
      radio.addEventListener('click', () => {
        updateInputRestriction(inputSearch, ...radios); // Espalha os rádios como argumentos
      });
    });
    
    await populateTable(currentPage);

    formSearch.addEventListener('submit', handleFormSubmit);

    document.querySelector('#btn-refresh').addEventListener(
      'click', 
      async () => await populateTable(currentPage)
    )
    document.querySelector('#prevButton').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        populateTable(currentPage);
      }
    });
    document.querySelector('#nextButton').addEventListener('click', () => {
      currentPage++;
      populateTable(currentPage);
    });
  });
}

init();