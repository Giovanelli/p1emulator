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
function updateClassroomMilitaryData( militaryId, data) {
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
function deleteClassroomMilitaryData(classroomId, militaryId) {
  const stmt = database.prepare(
    'DELETE FROM classroomMilitary WHERE classroomId = ? AND militaryId = ?'
  );
  return stmt.run(classroomId, militaryId);
}

module.exports = {
  addClassroomMilitaryData,
  getClassroomMilitaryData,
  getClassroomMilitaryByClassroomId,
  getClassroomByMilitaryId,
  updateClassroomMilitaryData,
  deleteClassroomMilitaryData
};
