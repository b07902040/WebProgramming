let number

const getNumber = (forceRestart = false) => {
  // TODO:
  // generate a random number if number is undefined or forceRestart is true
  if (number === undefined || forceRestart) {
    number = 1 + Math.floor(Math.random() * (100));
  }
  return number
}

export default getNumber
