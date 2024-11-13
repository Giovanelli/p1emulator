const { 
	getMilitaryByNumber, 
	getMilitaryByFunctionalName 
} = require('../../../dataBase/military');

const { getClassroomByNumber } = require('../../../dataBase/classroom');

function validateCsvRecord(record) {
	const errors = {};

	// Funções auxiliares para evitar repetição de código
	const isEmpty = (field, fieldName, message) => {
		if (field === '') {
			errors[fieldName] = `O campo ${message} não pode estar vazio.`;
			return true;
		}
		return false;
	};

	const isNumeric = (field, fieldName, message) => {
		if (!/^\d+$/.test(field)) {
			errors[fieldName] = `${message} deve conter apenas números.`;
			return false;
		}
		return true;
	};

	const isLetter = (field, fieldName, message) => {
		if (!/^[A-Za-zÇç\s]+$/.test(field)) {
			errors[fieldName] = `${message} deve conter apenas letras.`
			return false;
		}
		return true;
	};

	const isAlphaNumeric = (field, fieldName, message) => {
		if (!/^[a-zA-Z0-9 Çç]+$/.test(field)) {
			errors[fieldName] = `${message} deve conter apenas letras e números.`
			return false;
		}
		return true;
	};

	const isValidLength = (field, min, max, fieldName, message) => {
		if (field.length < min || field.length > max) {
			errors[fieldName] = 
				`${message} deve ter entre ${min} e ${max} caracteres.`
			return false;
		}
		return true;
	};

	const recordExists = (checkFunc, field, fieldName, message, option) => {
		if(option === true) {
			if (!checkFunc(field)) { 
				errors[fieldName] = `${message} não existe no sistema.`;
				return false;
			} else return true;
			
		} else {
			if (checkFunc(field)) { 
				errors[fieldName] = `${message} já existe no sistema.`;
				return false;
			} else return true;
		}
		
		
	};

	// Validação da turma
	if (!isEmpty(record.classroomNumber, 'classroomNumber','Turma')) {
		if (isNumeric(record.classroomNumber, 'classroomNumber', 'Turma')) {
			if (
				recordExists(
					getClassroomByNumber, 
					record.classroomNumber, 
					'classroomNumber', 
					'Turma',
					true
				)
			) {
				errors['classroomNumber'] = 'ok';
			}	
		}
	} 

	// Validação da matrícula
	if (!isEmpty(record.militaryNumber, 'militaryNumber', 'Matrícula')) {
		if (isNumeric(record.militaryNumber, 'militaryNumber', 'Matrícula')) {
			if (
				isValidLength(
					record.militaryNumber, 
					5, 
					7, 
					'militaryNumber', 
					'Matrícula'
				)
			) {
				if (
					recordExists(
						getMilitaryByNumber, 
						record.militaryNumber, 
						'militaryNumber', 
						'Matrícula',
						false
					)
				) {
					errors['militaryNumber'] = 'ok';
				}
			}
		}
	}

	// Validação do nome funcional
	if (!isEmpty(record.functionalName, 'functionalName' , 'Nome-Funcional')) {
		if(isLetter(record.functionalName, 'functionalName', 'Nome-Funcional')) {
			if (
				recordExists(
					getMilitaryByFunctionalName, 
					record.functionalName, 
					'functionalName', 
					'Este Nome-Funcional',
					false
				)
			) {
				errors['functionalName'] = 'ok';
			}
		}
	}

	// Validação do nome
	if (!isEmpty(record.name, 'name', 'Nome')) {
		if(isLetter(record.name, 'name', 'Nome')) {
			errors['name'] = 'ok';
		}
	}

	// Validação da graduação
	if (!isEmpty(record.rank, 'rank', 'Graduação')) {
			switch (record.rank) {
					case 'soldado':
					case 'cabo':
						errors['rank'] = 'ok'
						break;
					default:
						errors['rank'] = 'A Graduação deve ser Soldado ou Cabo.';
			}
	}

	if(record.role === '') {
		errors['role'] = 'ok';
	} else {
		if(isValidLength(record.role, 2, 15, 'role', 'Função')) {
			if(isAlphaNumeric(record.role, 'role', 'Função')) {
				errors['role'] = 'ok';
			}
		}
	}

	if(record.driverLicence === '') {
		errors['driverLicence'] = 'ok';
	} else {
		if(isValidLength(record.driverLicence, 1, 2, 'driverLicence', 'CNH')) {
			if(isLetter(record.driverLicence, 'driverLicence', 'CNH')) {
				switch (record.driverLicence.toLowerCase()) {
					case 'a':
					case 'b':
					case 'ab':
					case 'ba':
					case 'c':
					case 'ac':
					case 'ca':
					case 'd':
					case 'ad':
					case 'da':
					case 'e':
					case 'ae':
					case 'ea':
						errors['driverLicence'] = 'ok'
						break;
					default:
						errors['driverLicence'] = 'A CNH deve ser A/B/AB/C/AC/D/AD/E/AE';
				}
			}
		}
	}

	// Validação da Formação Acadêmica
	if (record.academicBackground === '') {
		errors['academicBackground'] = 'ok';
	} else {
		if(
			isAlphaNumeric(
				record.academicBackground, 'academicBackground', 'Formação-Academica'
			)
		) {
			errors['academicBackground'] = 'ok';
		}
	}

		// Validação da Experiência Profissional
		if (record.profissionalExperience === '') {
			errors['profissionalExperience'] = 'ok';
		} else {
			if(
				isAlphaNumeric(
					record.profissionalExperience, 
					'profissionalExperience', 
					'Experiência Profissional'
				)
			) {
				errors['profissionalExperience'] = 'ok';
			}
		}

	// Validação do telefone 1
	if (!isEmpty(record.firstPhone, 'firstPhone', 'Telefone-1')) {
		if (isNumeric(record.firstPhone, 'firstPhone', 'Telefone-1')) {
			if (
				isValidLength(record.firstPhone, 10, 11, 'firstPhone', 'Telefone-1')
			) {
				errors['firstPhone'] = 'ok';
			}
		}
	}

	// Validação do telefone 2
	if(record.secondPhone === ''){
		errors['secondPhone'] = 'ok';
	} else {
		if (isNumeric(record.secondPhone, 'secondPhone', 'Telefone-2')) {
			if (
				isValidLength(record.secondPhone, 10, 11, 'secondPhone', 'Telefone-2')
			) {
				errors['secondPhone'] = 'ok';
			}
		}
	}
	
	// Validação da rua
	if (!isEmpty(record.street, 'street', 'Rua')) {
		errors['street'] = 'ok';
	}

	// Validação do número da residência
	if (!isEmpty(record.houseNumber, 'houseNumber', 'Número da residência')) {
		errors['houseNumber'] = 'ok';
	}

	// Validação de Complemento
	if (record.complement === '') {
		errors['complement'] = 'ok';
	} else {
		if (isAlphaNumeric(record.complement, 'complement', 'Complemento')) {
			errors['complement'] = 'ok';
		}
	}

	// Validação do bairro
	if (!isEmpty(record.neighborhood, 'neighborhood', 'Bairro')) {
		errors['neighborhood'] = 'ok'
	}

	// Validação da cidade
	if (!isEmpty(record.city, 'city', 'Cidade')) {
		errors['city'] = 'ok';
	}

	// Validação da RPM de Origem
	if (record.rpmOrigin === '') {
		errors['rpmOrigin'] = 'ok';
	} else {
		if (isAlphaNumeric(record.rpmOrigin, 'rpmOrigin', 'RPM de Origem')) {
			errors['rpmOrigin'] = 'ok';
		}
	}

	// Validação da Unidade de Origem
	if (record.unitOrigin === '') {
		errors['unitOrigin'] = 'ok';
	} else {
		if (
			isAlphaNumeric(
				record.unitOrigin, 
				'unitOrigin', 
				'Unidade de Origem'
			)
		) {
			errors['unitOrigin'] = 'ok';
		}
	}
	// Validação da Companhia de Origem
	if (record.companyOrigin === '') {
		errors['companyOrigin'] = 'ok';
	} else {
		if (
			isAlphaNumeric(
				record.companyOrigin, 
				'companyOrigin', 
				'Companhia de Origem'
			)
		) {
			errors['companyOrigin'] = 'ok';
		}
	}

	return errors;
	
}

module.exports = {
  validateCsvRecord
};

