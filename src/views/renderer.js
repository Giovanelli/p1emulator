console.log('renderer.js carregado');


async function fetchMilitaryData() {
  try {
    const response = await window.api.existData();
    if (response.success) {
      // console.log('Dados de militares:', response.data);
      // Processar dados conforme necessário
      // document.getElementById('btn-search-military').style.display = 'none';
    } else {
      // console.error('Erro ao buscar dados de militares:', response.error);
      // document.getElementById('btn-search-military').style.display = 'none';
    }
  } catch (error) {
    console.error('Erro na solicitação de dados:', error);
  }
}

function init() {
  window.addEventListener('DOMContentLoaded', () => {

    const btnAddClassroom = document.querySelector('#btn-add-classroom').
    addEventListener('click', () => {
      api.openAddClassroom()
    })

    const btnSearchClassroom = document.querySelector('#btn-search-classroom').
    addEventListener('click', () => {
      api.openSearchClassroom()
    })
    
    const btnAddMilitary = document.querySelector('#btn-add-military').
    addEventListener('click', () => { 
      api.openAddMilitary() 
    })

  const btnSearchMilitary = document.querySelector('#btn-search-military').
    addEventListener('click', () => {
      api.openSearchMilitary()
    })
  })
}

init()




