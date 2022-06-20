export function getIndex(collection, email) {
  return collection.findIndex((item) => item.email === email);
}

export function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

export const search = (data, keys, query) => {
    if (data.length) {
        return data.filter((item) =>
            keys.some((key) =>
                item[key]?.toLowerCase().includes(query.toLowerCase())
            )
        );
    }

    return data;
};
