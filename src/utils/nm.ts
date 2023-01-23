
export const isMultiple = (num: number, base: number): boolean => {
  const div = num / base
  return div === Math.floor(div)
}