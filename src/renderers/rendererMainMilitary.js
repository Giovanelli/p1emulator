function init() {
  document.querySelector('#btn-add-military').addEventListener(
    'click', 
    () => { api.openAddMilitary(); }
  );

  document.querySelector('#btn-search-military').addEventListener(
    'click', 
    () => { api.openSearchMilitary(); }
  );

  document.querySelector('#btn-csv').addEventListener(
    'click',
    async () => {
      const filePath = await window.api.openFileCsv();
      
      if (filePath) {
        if (filePath.toLowerCase().endsWith('.csv')) {
          console.log(`Arquivo CSV selecionado: ${filePath}`);

          const csvData = await window.api.readCsvFile(filePath);
          console.log('Dados do CSV', csvData)
        } else {
          console.log('O arquivo selecionado não é um CSV.')
        }
      } else {
        console.log('Seleção de arquivo cancelada.')
      }
    }
  );

};

init();