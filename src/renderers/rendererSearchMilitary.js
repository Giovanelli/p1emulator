import { updateInputRestriction } from "../public/js/updateInputRestriction.js";

let currentPage = 1;
const itemsPerPage = 10;

const roleMapping = {
  "sem_funcao": "Sem Função",
  "auxiliar_p4": "Auxiliar de P4"
};

// teste
const formSearch = document.querySelector('#form-search');
const accordionButton = document.querySelector('.accordion-button');
const inputSearch = document.querySelector('#input-search');
const radios = document.querySelectorAll('input[name="options"');
const radioChecked = document.querySelector('input[name="options"]:checked');

// Vefiricar em quantos arquivos eu tenho a chamada dessa função.
async function populateClassroomSelect() {
  try {
    const options = await window.api.getOptionsClassroom();
    const selectClassroom = document.querySelector('#classroom-number');
    
    options.forEach ((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option.id;
      optionElement.textContent = option.classroomNumber;
      selectClassroom.appendChild(optionElement);
    })

    await populateTable(currentPage);
  } catch (error) {
    console.error('Erro ao preencher o select de turmas: ', error);
  }
}

async function populateTable(page = 1, filteredData = null) {
  try {
    const data = filteredData || await window.api.getCombinedData();
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    if (!data || data.length === 0) {
      console.warn('Nenhum dado disponível para exibir.');
      return;
    }

    const sortedData = data.sort((militaryA, militaryB) => {
      //First, sort the classroom by increasing number
      if (militaryA.classroomNumber !== militaryB.classroomNumber) {
        return militaryA.classroomNumber - militaryB.classroomNumber;
      }
      
      //Prioritizes 'cabo' in the ordering
      if (militaryA.rank === 'cabo' && militaryB.rank !== 'cabo') { return -1 };
      if (militaryA.rank !== 'cabo' && militaryB.rank === 'cabo') { return 1 };

      return militaryA.rank.localeCompare(militaryB.rank);
    })

    //Calculate the start and end index of pagination.
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = sortedData.slice(start, end);

    

    paginatedData.forEach((row) => {
      const roleFormatted = roleMapping[row.role] || row.role.toUpperCase();
      const tr = document.createElement('tr');
      
      tr.innerHTML = `
        <th scope="row" class="text-center border">${row.classroomNumber}</th>
        <td class="text-center border">${row.militaryNumber}</td>
        <td class="text-center border">${row.functionalName}</td>
        <td class="text-center border">${row.name}</td>
        <td class="text-center border">${row.rank}</td>
        <td class="text-center border">${roleFormatted}</td>
        <td class="text-center border">
          <a href="#" class="view-link" data-id="${row.militaryId}">
            <i class="bi bi-eye-fill"></i>
          </a>
        </td>
      `;
      
      tbody.appendChild(tr);
    });
    
    //Update the state of the navigation buttons
    updatePaginationControls(page, sortedData.length);
    addEditLinkEventListeners();
  } catch (error) { console.error('Erro ao carregar dados: ', error); }
}

function addEditLinkEventListeners() {
  document.querySelectorAll('.view-link').forEach((link) => {
    link.addEventListener('click', async function(event) {
      event.preventDefault();  // Evitar o comportamento padrão do link
      const militaryId = this.getAttribute('data-id');  // Obter o ID do militar
      window.api.viewMilitaryRecord(militaryId);
    });
  });
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

function clearSelectRadio() {
  // const selectedRadio = document.querySelector('input[name="options"]:checked');
  //const radioButtons = document.querySelectorAll('input[name="options"]');
  //const inputSearch = document.querySelector('#input-search')
  const collapseOne = document.querySelector('#collapseOne');

  const advancedSearchFields = [
    document.querySelector('#rpm-origin'),
    document.querySelector('#unit-origin'),
    document.querySelector('#company-origin'),
    document.querySelector('#classroom-number'),
    document.querySelector('#rank'),
    document.querySelector('#role')
  ];

  function toggleElements(disable) {
    // Desabilita ou habilita os botões de rádio e campos de entrada
    radios.forEach((radio) => {
      radio.disabled = disable;
      radio.checked = false;
    });
    advancedSearchFields.forEach(field => {
      field.value = ''; // Limpa o campo
    });
    inputSearch.disabled = disable;
  }

  collapseOne.addEventListener('shown.bs.collapse', () => { 
    toggleElements(true);
  });
  collapseOne.addEventListener('hidden.bs.collapse', () => {
    toggleElements(false);
  });

  if (radioChecked) { radioChecked.checked = false; }
  inputSearch.value = '';
};

async function handleFormSubmit(event) {
  event.preventDefault();

  //const radio = document.querySelector('input[name="options"]:checked');
  //const inputSearch = document.querySelector('#input-search').value;

  if (radioChecked && inputSearch.trim() !== '') {
    //Aqui será feita a pesquisa simples
    let fieldSearch = radioChecked.id === 'radio-military-number' 
      ? 'militaryNumber' 
      : radioChecked.id === 'radio-name'
      ? 'name'
      : 'functionalName';

    try {
      const filteredData =  await window.api.simpleSearchMilitary(
        fieldSearch, 
        inputSearch
      );

      await populateTable(1, filteredData)
    } catch (error) { 
      console.error('Erro ao buscar dados na pesquisa simples: ', error);
    }
  } else if (!radioChecked) {
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
};

function init () {
  document.addEventListener('DOMContentLoaded', async () =>   {
    // const formSearch = document.querySelector('#form-search');
    // const accordionButton = document.querySelector('.accordion-button');
    // const inputSearch = document.querySelector('#input-search');
    // const radios = document.querySelectorAll('input[name="options"');

    radios.forEach(radio => {
      radio.addEventListener('click', () => {
        updateInputRestriction(inputSearch, ...radios); // Espalha os rádios como argumentos
      });
    });

    
    accordionButton.addEventListener('click', clearSelectRadio);

    await populateClassroomSelect();
    
    formSearch.addEventListener('submit', handleFormSubmit);

    document.querySelector('#btn-refresh').addEventListener(
      'click', 
      async () => await populateTable(currentPage)
    );

    //Add pagination events
    document.querySelector('#prevButton').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        populateTable(currentPage);
      }
    })
    document.querySelector('#nextButton').addEventListener('click', () => {
      currentPage++;
      populateTable(currentPage);
    })

  })
};

init();