function normalizeText(text) {
	return text.toLowerCase().trim();
}

function handleFormSubmit() {
  const form = document.querySelector('#form-add-activity');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

			const formData = {
				activityName: normalizeText(
					document.querySelector('#activity-name').value),
				activityWeight: document.querySelector('#activity-weight').value,
				type: document.querySelector('#type').value,
				perimeter: document.querySelector('#perimeter').value,
				activityObservation: document.querySelector('#observation').value
			};

			const response = await window.api.addActivityData(formData);

			if (response.available) {
				// Diálogo de sucesso
				const continueAdding = await window.api.showDialogActivity({
					type: 'info',
					buttons: ['Sim', 'Não'],
					title: 'Atividade cadastrada com sucesso!',
					message: 'Deseja continuar cadastrando?'
				});
				
				if (continueAdding === 0) {
					form.reset();
				} else {
					window.close();
				}
	
			} else {
				// Diálogo de erro
				await window.api.showDialogActivity({
					type: 'error',
					buttons: ['Ok'],
					title: 'Erro',
					message: response.message || 
						'Erro ao cadastrar a atividade. Essa atividade já existe!',
				});
			}

    });
}

function init() {
	document.addEventListener('DOMContentLoaded', () => {
		handleFormSubmit();
	});
}

init();