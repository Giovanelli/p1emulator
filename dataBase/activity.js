const { database } = require('./database');

function addActivityData(data) {
	const stmt = database.prepare(`
		INSERT INTO activity (
			activityName,
			activityWeight,  
			type, 
			perimeter,
			activityObservation
		) VALUES (?, ?, ?, ?, ?)
  `);

	const info = stmt.run(
		data.activityName,
		data.activityWeight,
		data.type,
		data.perimeter,
		data.activityObservation
	);

	return info.lastInsertRowid;
}

function getActivityData() {
	const stmt = database.prepare('SELECT * FROM activity');
	return stmt.all();
}

function getActivityById(id) {
  const stmt = database.prepare('SELECT * FROM activity WHERE id = ?');
  return stmt.get(id);
}

function getActivityByName(activityName) {
  const stmt = database.prepare(
		'SELECT * FROM activity WHERE activityName = ?'
	);
  return stmt.get(activityName);
}

function updateActivityData(id, data) {
	const stmt = database.prepare(`
		UPDATE activity SET
      activityName = ?,
      activityWeight = ?,  
      type = ?, 
      perimeter = ?,
			activityObservation = ?
    WHERE id = ?
	`);

	return stmt.run(
		data.activityName,
		data.activityWeight,
		data.type,
		data.perimeter,
		data.activityObservation,
		id
	);
}

function deleteActivityById(id) {
	const stmt = database.prepare('DELETE FROM activity WHERE id = ?');
	return stmt.run(id)
}

module.exports = {
	addActivityData,
	getActivityData,
	getActivityById,
	getActivityByName,
	updateActivityData,
	deleteActivityById
}