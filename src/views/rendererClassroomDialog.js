const form = document.querySelector('#classroom-dialog-form');

form.addEventListener('submit', async (event) => {
  
  event.preventDefault();
  
  const classroomDialogCount = document.querySelector('#count').value;
  
  const result = await window.api.submitClassroomDialogData(classroomDialogCount);
  
  // Analisar a validade do código abaixo, caso nao sejá útil deverá ser
  // excuido.
  
  if (result.success) {
    // Fechar o formulário ou exibir uma mensagem de sucesso
    console.log('Registros de turmas criados com sucesso');
  } else {
    // Exibir uma mensagem de erro
    console.error(result.error || 'Erro desconhecido');
  }
});
