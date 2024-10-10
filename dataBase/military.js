const { database } = require('./database');

function addMilitaryData(data) {
  const stmt = database.prepare(`
    INSERT INTO military (
      militaryNumber,
      functionalName,  
      name, 
      rank,
      firstPhone,
      secondPhone,
      street,
      houseNumber,
      complement,
      neighborhood,
      city,
      rpmOrigin,
      unitOrigin,
      companyOrigin,
      observation,
      driverLicence,
      profissionalExperience,
      academicBackground
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    data.militaryNumber,
    data.functionalName,
    data.name,
    data.rank,
    data.firstPhone,
    data.secondPhone,
    data.street,
    data.houseNumber,
    data.complement,
    data.neighborhood,
    data.city,
    data.rpmOrigin,
    data.unitOrigin,
    data.companyOrigin,
    data.observation,
    data.driverLicence,
    data.profissionalExperience,
    data.academicBackground
  );

  return info.lastInsertRowid;
}

function getMilitaryData() {
  const stmt = database.prepare('SELECT * FROM military');
  return stmt.all();
}

function getMilitaryById(id) {
  const stmt = database.prepare('SELECT * FROM military WHERE id = ?');
  return stmt.get(id);
}

function updateMilitaryData(id, data) {
  const stmt = database.prepare(`
    UPDATE military SET
      militaryNumber = ?,
      functionalName = ?,  
      name = ?, 
      rank = ?,
      firstPhone = ?,
      secondPhone = ?,
      street = ?,
      houseNumber = ?,
      complement = ?,
      neighborhood = ?,
      city = ?,
      rpmOrigin = ?,
      unitOrigin = ?,
      companyOrigin = ?,
      observation = ?,
      driverLicence = ?,
      profissionalExperience = ?,
      academicBackground = ? 
    WHERE id = ?
  `);

  return stmt.run(
    data.militaryNumber,
    data.functionalName,
    data.name,
    data.rank,
    data.firstPhone,
    data.secondPhone,
    data.street,
    data.houseNumber,
    data.complement,
    data.neighborhood,
    data.city,
    data.rpmOrigin,
    data.unitOrigin,
    data.companyOrigin,
    data.observation,
    data.driverLicence,
    data.profissionalExperience,
    data.academicBackground,
    id
  );
}

function deleteMilitaryById(id) {
  const stmt = database.prepare('DELETE FROM military WHERE id = ?');
  return stmt.run(id);
}

function hasMilitaryRecords() {
  const stmt = database.prepare('SELECT COUNT(*) AS count FROM classroom');
  const result = stmt.get();
  return result.count > 0;
}

module.exports = {
  addMilitaryData,
  getMilitaryData,
  getMilitaryById,
  updateMilitaryData,
  deleteMilitaryById,
  hasMilitaryRecords
};