function validateObject(object) {
  const validatedObject = {};

  for (let key in object) {
    if (object.hasOwnProperty(key)) {  // Garante que a chave pertence ao objeto
      const value = object[key];

      // Verifica se é um número e não está vazio
      if (!isNaN(value) && value !== '') {
        validatedObject[key] = parseInt(value, 10);
      } else {
        validatedObject[key] = removeDiacriticalMarks(value).toLowerCase();
      }
    }
  }

  return validatedObject;
}

// Função de remoção de acentos
function removeDiacriticalMarks(texto) {
  const mapaAcentos = {
    'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a', 'ä': 'a',
    'Á': 'a', 'À': 'a', 'Ã': 'a', 'Â': 'a', 'Ä': 'a',
    'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
    'É': 'e', 'È': 'e', 'Ê': 'e', 'Ë': 'e',
    'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
    'Í': 'i', 'Ì': 'i', 'Î': 'i', 'Ï': 'i',
    'ó': 'o', 'ò': 'o', 'õ': 'o', 'ô': 'o', 'ö': 'o',
    'Ó': 'o', 'Ò': 'o', 'Õ': 'o', 'Ô': 'o', 'Ö': 'o',
    'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
    'Ú': 'u', 'Ù': 'u', 'Û': 'u', 'Ü': 'u',
    'ç': 'ç', 'Ç': 'Ç', 'ñ': 'n', 'Ñ': 'n'
  };

  return texto.split('').map(letra => mapaAcentos[letra] || letra).join('');
}

module.exports = { validateObject }
