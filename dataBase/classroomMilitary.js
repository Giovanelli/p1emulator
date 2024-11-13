const { database } = require('./database');

// Função para adicionar um registro na tabela classroom_military
function addClassroomMilitaryData(data) {
  const stmt = database.prepare(`
    INSERT INTO classroomMilitary (
      classroomId,
      militaryId,
      role
    ) VALUES (?, ?, ?)
  `);

  return stmt.run(
    data.classroomId,
    data.militaryId,
    data.role
  );
}

// Função para obter todos os registros da tabela classroom_military
function getClassroomMilitaryData() {
  const stmt = database.prepare('SELECT * FROM classroomMilitary');
  return stmt.all();
}

// Função para obter registros da tabela classroom_military por classroomId
function getClassroomMilitaryByClassroomId(classroomId) {
  const stmt = database.prepare(
    'SELECT * FROM classroomMilitary WHERE classroomId = ?'
  );
  return stmt.all(classroomId);
}

// Função para obter a sala de aula associada a um militar específico
function getClassroomByMilitaryId(militaryId) {
  const stmt = database.prepare(`
    SELECT * FROM classroomMilitary WHERE militaryId = ?
  `);
  return stmt.get(militaryId); 
  // Use stmt.get() porque só deve haver um registro
}

// Função para atualizar um registro na tabela classroom_military
function updateClassroomMilitaryData(militaryId, data) {
  const stmt = database.prepare(`
    UPDATE classroomMilitary SET 
      classroomId = ?, 
      role = ?
    WHERE militaryId = ?
  `);

  return stmt.run(
    data.classroomId,
    data.role,
    militaryId
  );
}

// Função para deletar um registro da tabela classroom_military
// function deleteClassroomMilitaryData(classroomId, militaryId) {
//   const stmt = database.prepare(
//     'DELETE FROM classroomMilitary WHERE classroomId = ? AND militaryId = ?'
//   );
//   return stmt.run(classroomId, militaryId);
// }

function deleteClassroomMilitaryData(classroomId = null, militaryId = null) {
  let query = 'DELETE FROM classroomMilitary WHERE';
  const conditions = [];
  const params = [];

  if (classroomId !== null) {
    conditions.push('classroomId = ?');
    params.push(classroomId);
  }

  if (militaryId !== null) {
    conditions.push('militaryId = ?');
    params.push(militaryId);
  }

  // Se nenhuma condição foi adicionada, evitamos uma exclusão acidental sem filtro
  if (conditions.length === 0) {
    throw new Error(
      'Pelo menos um dos parâmetros (classroomId ou militaryId)' + 
      'deve ser fornecido'
    );
  }

  query += ' ' + conditions.join(' AND ');
  const stmt = database.prepare(query);
  return stmt.run(...params);
}



module.exports = {
  addClassroomMilitaryData,
  getClassroomMilitaryData,
  getClassroomMilitaryByClassroomId,
  getClassroomByMilitaryId,
  updateClassroomMilitaryData,
  deleteClassroomMilitaryData
};
