function validateLetterInput() {
  document.querySelectorAll(".validate-letter-input")
    .forEach(function(input) {
      input.addEventListener("input", function() {
        // Remove qualquer caractere que não seja letra (a-z, A-Z) ou espaço
        setTimeout(() => {
          // Remove qualquer caractere que não seja letra (a-z, A-Z), acentuação
          // ou espaço.
          // this.value = this.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
          this.value = this.value.replace(/[^a-zA-ZÇç\s]/g, '');
        }, 0);
      }); 
    }
  );
}
  
function validateNumberInput() {
  document.querySelectorAll(".validate-number-input")
    .forEach(function(input) {
      input.addEventListener("input", function() {
      // Remove qualquer caractere que não seja um número (0-9).
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});
}
  
function validateAlphanumericInput() {
  document.querySelectorAll(".validate-alphanumeric-input")
    .forEach(function(input) {
      input.addEventListener("input", function() {
      // Remove qualquer caractere que não seja letra (a-z, A-Z), número (0-9), 
      // çÇ ou espaço.
      setTimeout(() => {
        // Remove qualquer caractere que não seja letra (a-z, A-Z), acentuação 
        // ou espaço.
        //this.value = this.value.replace(/[^a-zA-ZÀ-ÿ0-9\s]/g, '');
        this.value = this.value.replace(/[^a-zA-ZÇç0-9\s]/g, '');
      }, 0);
    });
  });
}

function init() {
  document.addEventListener('DOMContentLoaded', () => {
    validateLetterInput();
    validateNumberInput();
    validateAlphanumericInput();
  });
}

init();