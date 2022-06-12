export const capitalizeFirstLet = (sentence) => {
  if (typeof sentence !== "string") return "";
  sentence = sentence.replace(/\s+/g, " ").trim();
  return sentence[0].toUpperCase() + sentence.slice(1);
};

export const ellipsify = (sentence, number) => {
  if (typeof sentence !== "string") return "";
  console.log(sentence);
  return sentence.length > number
    ? `${sentence.substring(0, number)} ...`
    : sentence;
};
