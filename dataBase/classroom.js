const { database } = require('./database');

function addClassroomData(data) {
  const stmt = database.prepare(`
    INSERT INTO classroom (
      classroomNumber,
      numberOfMilitary,
      monitor
    ) VALUES (?, 0, ?)
  `);

  return stmt.run(
    data.classroomNumber,
    data.monitor
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
      monitor = ?
    WHERE id = ?
  `);

  return stmt.run(
    data.classroomNumber,
    data.monitor,
    id
  );
}

function updateNumberOfMilitary(classroomNumber) {
  const stmt = database.prepare(`
    UPDATE classroom
    SET numberOfMilitary = numberOfMilitary + 1
    WHERE classroomNumber = ?  
  `)

  return stmt.run(classroomNumber)
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

// Função para criar registros de turmas
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
  if (field === 'monitor') value = `%${value}%`;

  const stmt = database.prepare(
    `SELECT * FROM classroom WHERE ${field} LIKE ?;`
  );

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