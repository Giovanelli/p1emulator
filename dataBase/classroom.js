const { database } = require('./database');

function addClassroomData(data) {
  const stmt = database.prepare(`
    INSERT INTO classroom (
      classroomNumber,
      numberOfMilitary,
      monitor,
      observation
    ) VALUES (?, 0, ?, '')
  `);

  return stmt.run(
    data.classroomNumber,
    data.monitor,
    data.observation
  );
}

function getClassroomData() {
  const stmt = database.prepare('SELECT * FROM classroom');
  return stmt.all();
}

function getClassroomById(id) {
  const stmt = database.prepare('SELECT * FROM classroom WHERE id = ?');
  return stmt.get(id);
}

function getClassroomByNumber(classroomNumber) {
  const stmt = database.prepare(`
    SELECT * FROM classroom 
    WHERE classroomNumber = ?  
  `)

  return stmt.get(classroomNumber)
}

function updateClassroomData(id, data) {
  const stmt = database.prepare(`
    UPDATE classroom SET
      classroomNumber = ?,
      monitor = ?,
      observation = ?
    WHERE id = ?
  `);

  return stmt.run(
    data.classroomNumber,
    data.monitor,
    data.observation,
    id
  );
}

function updateNumberOfMilitary(classroomNumber, increment = true) {
  const stmt = database.prepare(`
    UPDATE classroom
    SET numberOfMilitary = numberOfMilitary ${increment ? '+' : '-'} 1
    WHERE classroomNumber = ?  
  `);

  return stmt.run(classroomNumber);
}

function deleteClassroomById(id) {
  const stmt = database.prepare('DELETE FROM classroom WHERE id = ?');
  return stmt.run(id);
}

function hasClassroomRecords() {
  const stmt = database.prepare('SELECT COUNT(*) AS count FROM classroom');
  const result = stmt.get();
  return result.count > 0;
}

// Função para criar registros de turmas no início do uso.
function createClassroomRecords(count) {
  const stmt = database.prepare(`
    INSERT INTO classroom (classroomNumber, numberOfMilitary)
    VALUES (?, ?)
  `);

  for (let i = 1; i <= count; i++) {
    stmt.run(i, 0);
  }
}

function searchClassroom(field, value) {
  const isStringField = field === 'monitor';
  const query = isStringField 
    ? `SELECT * FROM classroom WHERE ${field} LIKE ?;`
    : `SELECT * FROM classroom WHERE ${field} = ?;`;
  
  if (isStringField) {
    value = `%${value}%`; // Adiciona o operador curinga apenas para textos
  }

  const stmt = database.prepare(query);
  return stmt.all(value);
}


module.exports = {
  addClassroomData,
  getClassroomData,
  getClassroomById,
  getClassroomByNumber,
  updateClassroomData,
  deleteClassroomById,
  hasClassroomRecords,
  createClassroomRecords,
  updateNumberOfMilitary,
  searchClassroom
};