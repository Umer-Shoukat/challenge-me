export const getRandomNumber = (min = 1, max = 30) =>
  {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

const randomColor = () =>
  '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0')

export const getRandomColors = (limit = 20) => {
  let colors = ['#FC00FF', '#7024c4', '#2ba8f5', '#219653']

  for (let i = 0; i < limit; i++) {
    colors = [...colors, randomColor()]
  }

  return colors
}
