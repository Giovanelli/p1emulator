// inputRestriction.js
export function updateInputRestriction(inputSearch, ...radios) {
  // Aplica as restrições com base nos rádios recebidos
  radios.forEach(radio => {
    if (radio.checked) {
      inputSearch.disabled = false;
      inputSearch.value = '';

      radio.classList.forEach(className => {
        if (className === 'onlyLetter') {
          inputSearch.oninput = function () {
            // Permite apenas letras não acentuadas (A-Z, a-z) e espaços
            this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
          };
          
        } else if (className === 'onlyNumber') {
          inputSearch.oninput = function () {
            // Remove qualquer caractere que não seja número
            this.value = this.value.replace(/[^0-9]/g, '');
          };
        }
      })
    }
  });
}
