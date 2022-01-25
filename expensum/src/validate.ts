
/**
 * Check whether something is a number
 *
 * @param {any} input Value that should be a number
 *
 * @returns {boolean} `TRUE` if the input is a number.
 *                    `FALSE` otherwise
 */
export const isNumber = (input : any) => {
  return (typeof input === 'number' || (typeof input === 'string' && !isNaN(parseFloat(input))))
  // return (typeof input === 'number' && !isNaN(parseFloat(input)) && !isFinite(input))
}
