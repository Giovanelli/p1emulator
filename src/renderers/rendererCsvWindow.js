async function populateCsvTable(csvData = null) {
  try {
    
    let existError = false;
    
    // Carrega os dados do CSV se não forem fornecidos como parâmetro
    if (!csvData) {
      csvData = await window.api.loadCsvData();
    }

    // Verifica se csvData é um array antes de tentar iterar
    if (!Array.isArray(csvData)) {
      console.error("Erro: csvData não é uma lista válida.");
      return;
    }

    const errorList = [];
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    let count = 1;
    csvData.forEach((register) => {
      const errors = register.errors;
      let errorObj = null;

      Object.entries(errors).forEach(([chave, valor]) => {
        if (valor !== 'ok') {
          if (!errorObj) {
            errorObj = { [chave]: valor };
          } else {
            errorObj[chave] = valor;
          }
          existError = true;
        }
      });

      if (errorObj) {
        errorObj.id = register.militaryNumber;
        errorList.push(errorObj);
      }

    });

    // Preenche a tabela com os dados
    csvData.forEach((row) => {
      let checkError = false;
      for (let i = 0; i < errorList.length; i++) {
        if (row.militaryNumber === errorList[i].id) checkError = true;
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <th scope="row" class="text-center border">${count}</th>
        <td class="text-center border">${row.classroomNumber}</td>
        <td class="text-center border">${row.militaryNumber}</td>
        <td class="text-center border">${row.rank}</td>
        <td class="text-center border">${row.functionalName}</td>
        <td class="text-center border">
          ${
            !checkError
              ? '<i class="bi bi-check-lg text-success fs-5 fw-bolder"></i>'
              : '<i class="bi bi-x-lg text-danger fs-5 fw-bolder"></i>'
          }
        </td>
        <td class="text-center border">
          ${
            !checkError 
              ? '' 
              : `<a href="#" class="view-link" data-id="${row.militaryNumber}">
                  <i class="bi bi-tools text-secondary fs-5 fw-bolder"></i>
                </a>`
          }
        </td>
      `;
      tbody.appendChild(tr);
      count++;
    });

    addEditLinkEventListeners(csvData, errorList);
    changerButton(existError);

  } catch (error) {
    console.error("Erro ao popular a tabela:", error);
  }
}

async function updateTableCsv() {
  try {
    const updatedData = await window.api.getStoredCsvData();
    if(updatedData) 
      populateCsvTable(updatedData);
    
  } catch (error) {
    console.error("Erro ao atualizar a tabela:", error);
  }
}

function changerButton(change) {
  const btnInsert = document.querySelector('#btn-insert');
  const btnCheck = document.querySelector('#btn-check');
  if(change) {
    btnInsert.style.display = 'none';
    btnCheck.style.display = 'block';
  } else {
    btnInsert.style.display = 'block';
    btnCheck.style.display = 'none';
  }
}

function addEditLinkEventListeners(csvData, errorList) {
  document.querySelectorAll('.view-link').forEach((link) => {
    link.addEventListener('click', async function(event) {
      event.preventDefault();
      
      // Pega o ID específico do link clicado
      const errorId = this.getAttribute('data-id'); 
      const registerCsv = csvData.find((item) =>
        Number(item.militaryNumber) === Number(errorId)
      );
      
      if (registerCsv) {
        // Envia apenas o registro específico
        window.api.correctionWindowCsv(registerCsv); 
      } else {
        console.error('Registro CSV não encontrado para o ID:', militaryNumber);
      }

    });
  });
}

function init() {
  document.addEventListener('DOMContentLoaded', async () =>   {
    await populateCsvTable();

    const btnCheck = document.querySelector('#btn-check');
    btnCheck.addEventListener('click', async () => {
      await updateTableCsv();
    });

  })
}

init();