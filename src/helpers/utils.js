export function getIndex(collection, email) {
  return collection.findIndex((item) => item.email === email);
}

export function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}
