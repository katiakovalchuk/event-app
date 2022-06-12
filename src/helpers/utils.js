export function getIndex(collection, id) {
  return collection.findIndex((item) => item.id === id);
}

export function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}
