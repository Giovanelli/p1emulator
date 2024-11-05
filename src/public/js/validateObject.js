function validateObject(object) {
  const validatedObject = {}
  for(key in object) {
    if(!isNaN(object[key])){
      validatedObject[key] = parseInt(object[key]);
    } else {
      validatedObject[key] = object[key];
    }
  }

  return validatedObject;
}

module.exports = { validateObject }
