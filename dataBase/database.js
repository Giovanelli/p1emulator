const Database = require('better-sqlite3');
const path = require('node:path');
const database = new Database(path.join(__dirname, 'cfs_database.db'));

function initializeDatabase() {
  database.exec(`
    CREATE TABLE IF NOT EXISTS military (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      militaryNumber INTEGER UNIQUE NOT NULL,
      functionalName TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      rank TEXT NOT NULL,
      firstPhone TEXT NOT NULL,
      secondPhone TEXT,
      street TEXT NOT NULL,
      houseNumber TEXT NOT NULL,
      complement TEXT,
      neighborhood TEXT NOT NULL,
      city TEXT NOT NULL,
      rpmOrigin INTEGER NOT NULL,
      unitOrigin TEXT NOT NULL,
      companyOrigin TEXT,
      observation TEXT,
      driverLicence TEXT,
      profissionalExperience TEXT,
      academicBackground TEXT
    )
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS classroom (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      classroomNumber INTEGER UNIQUE NOT NULL,
      numberOfMilitary INTEGER DEFAULT 0,
      monitor TEXT
    )
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS classroomMilitary(
      classroomId INTEGER NOT NULL,
      militaryId INTEGER NOT NULL,
      role TEXT,
      PRIMARY KEY (classroomId, militaryId),
      FOREIGN KEY (classroomId) REFERENCES classroom(id),
      FOREIGN KEY (militaryId) REFERENCES military(id) ON DELETE CASCADE
    )
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS activity(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      activityName TEXT UNIQUE NOT NULL,
      activityWeight INTEGER NOT NULL,
      type TEXT,
      perimeter TEXT,
      activityObservation TEXT
    )
  `);
}

function getCombinedData() {
  const query = `
    SELECT 
      c.classroomNumber,
      m.militaryNumber,
      m.functionalName,
      m.name,
      m.rank,
      m.id AS militaryId,
      cm.role
    FROM
      classroomMilitary cm
    JOIN
      military m ON cm.militaryId = m.id
    JOIN 
      classroom c ON cm.classroomID = c.id;
  `;
  return database.prepare(query).all();
}

function getCombinedDataEdit(militaryId) {
  const query = `
    SELECT 
      c.classroomNumber,
      m.militaryNumber,
      m.functionalName,
      m.name,
      m.rank,
      m.firstPhone,
      m.secondPhone,
      m.street,
      m.houseNumber,
      m.complement,
      m.neighborhood,
      m.city,
      m.rpmOrigin,
      m.unitOrigin,
      m.companyOrigin,
      m.driverLicence,
      m.profissionalExperience,
      m.academicBackground,
      m.observation,
      cm.role
    FROM
      classroomMilitary cm
    JOIN
      military m ON cm.militaryId = m.id
    JOIN 
      classroom c ON cm.classroomID = c.id
    WHERE
      m.id = ?;
  `;
  return database.prepare(query).get(militaryId);
}

function simpleSearchMilitary(field, value) {
  const query = `
    SELECT
      c.classroomNumber,
      m.id AS militaryId,
      m.militaryNumber,
      m.functionalName,
      m.name,
      m.rank,
      cm.role
    FROM
      classroomMilitary cm
    JOIN
      military m ON cm.militaryId = m.id
    JOIN
      classroom c ON cm.classroomId = c.id
    WHERE m.${field} LIKE ?;
  `
  return database.prepare(query).all(`%${value}%`)
}

function advancedSearchMilitary(searchParams) {
  const { 
    rpmOrigin, 
    unitOrigin, 
    companyOrigin, 
    classroomNumber, 
    rank, 
    role 
  } = searchParams

  let query = `
    SELECT
      c.classroomNumber,
      m.id AS militaryId,
      m.militaryNumber,
      m.functionalName,
      m.name,
      m.rank,
      cm.role
    FROM
      classroomMilitary cm
    JOIN
      military m ON cm.militaryId = m.id
    JOIN
      classroom c ON cm.classroomId = c.id
    WHERE 1=1
  `

  // Mapeamento dos filtros
  const filters = {
    'm.rpmOrigin': rpmOrigin,
    'm.unitOrigin': unitOrigin,
    'm.companyOrigin': companyOrigin,
    'c.classroomNumber': classroomNumber,
    'm.rank': rank,
    'cm.role': role,
  };

  const queryParams = []

  Object.keys(filters).forEach((field) => {
    if (filters[field]) {
      query += ` AND ${field} = ?`
      queryParams.push(filters[field])
    }
  })

  try {
    const result = database.prepare(query).all(...queryParams)
    return result
  } catch (error) {
    console.error('Erro ao buscar dados na pesquisa avancada: ', error)
    throw error
  }

}


module.exports = { 
  database, 
  initializeDatabase,
  getCombinedData,
  simpleSearchMilitary,
  advancedSearchMilitary,
  getCombinedDataEdit

};