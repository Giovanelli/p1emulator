const { getMilitaryByNumber, getMilitaryByFunctionalName } = require('../../../dataBase/military');
const { getClassroomByNumber } = require('../../../dataBase/classroom');

function validateCsvRecord(record) {
    let errors = [];

    // Funções auxiliares para evitar repetição de código
    const isEmpty = (field, fieldName) => {
        if (field === '') {
            errors.push(`O campo ${fieldName} é obrigatório.`);
            return true;
        }
        return false;
    };

    const isNumeric = (field, fieldName) => {
        if (!/^\d+$/.test(field)) {
            errors.push(`${fieldName} deve conter apenas números.`);
            return false;
        }
        return true;
    };

    const isValidLength = (field, min, max, fieldName) => {
        if (field.length < min || field.length > max) {
            errors.push(`${fieldName} deve ter entre ${min} e ${max} caracteres.`);
            return false;
        }
        return true;
    };

    const recordExists = (checkFunc, field, fieldName, successMsg) => {
        if (checkFunc(field)) {
            errors.push(`${fieldName} já existe no sistema.`);
        } else {
            errors.push(successMsg);
        }
    };

    // Validação da turma
    if (!isEmpty(record.classroomNumber, "número da turma")) {
        if (isNumeric(record.classroomNumber, "Número da turma")) {
            if (!getClassroomByNumber(record.classroomNumber)) {
                errors.push(`O registro da turma ${record.classroomNumber} não existe no banco de dados.`);
            } else {
                errors.push('O registro de turma está correto.');
            }
        }
    }

    // Validação da matrícula
    if (!isEmpty(record.militaryNumber, "matrícula")) {
        if (isNumeric(record.militaryNumber, "Matrícula") && isValidLength(record.militaryNumber, 5, 7, "Matrícula")) {
            recordExists(getMilitaryByNumber, record.militaryNumber, "Matrícula", "O registro de matrícula está correto.");
        }
    }

    // Validação do nome funcional
    if (!isEmpty(record.functionalName, "nome funcional")) {
        recordExists(getMilitaryByFunctionalName, record.functionalName, "Nome funcional", "O registro de nome funcional está correto.");
    }

    // Validação do nome
    if (!isEmpty(record.name, "nome")) {
        if (/[^a-zA-ZÀ-ÿ\s]/g.test(record.name)) {
            errors.push(`O nome ${record.name} deve conter apenas letras, acentuadas ou não.`);
        } else {
            errors.push('O registro de nome está correto.');
        }
    }

    // Validação da graduação
    if (!isEmpty(record.rank, "graduação")) {
        switch (record.rank) {
            case 'soldado':
            case 'cabo':
                errors.push('O registro de graduação está correto.');
                break;
            default:
                errors.push('O militar só pode receber a graduação de soldado ou cabo.');
        }
    }

    // Validação do telefone
    if (!isEmpty(record.firstPhone, "telefone")) {
        if (isValidLength(record.firstPhone, 10, 11, "Telefone")) {
            errors.push('O registro de telefone está correto.');
        }
    }

    // Validação da rua
    if (!isEmpty(record.street, "logradouro")) {
        errors.push('O registro de rua está correto.');
    }

    // Validação do número da residência
    if (!isEmpty(record.houseNumber, "número da residência")) {
        errors.push('O registro do número da residência está correto.');
    }

    // Validação do bairro
    if (!isEmpty(record.neighborhood, "bairro")) {
        errors.push('O compo bairro está correto.')
    }

    // Validação da cidade
    if (!isEmpty(record.city, "cidade")) {
        errors.push('O campo cidade está correto.')
    }

    return errors;

}

module.exports = {
    validateCsvRecord
};

