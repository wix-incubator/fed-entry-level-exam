export const sleep = (millisecondsCount) => {
  if (!millisecondsCount) {
    return;
  }
  return new Promise(resolve => setTimeout(resolve, millisecondsCount)).catch();
}
