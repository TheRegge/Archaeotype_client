/**
 * Utils singleton class
 *
 * Utils is using the 'Singleton' pattern, and thus
 * cannot be instanciated directly. Use `Utils.getInstance()`
 * to get the unique instance of the class.
 *
 * @class Utils
 */
export class Utils {
  private static instance: Utils

  private constructor() {}

  public static getInstance(): Utils {
    if (!Utils.instance) {
      Utils.instance = new Utils()
    }
    return Utils.instance
  }

  /**
   * Converts an hexadecimal number
   * to a CSS hex color string.
   *
   *
   * @param {(number | undefined)} n
   * @returns {(string | undefined)}
   * @memberof Utils
   */
  hexToString(n: number | undefined): string | undefined {
    if (n) return '#' + n.toString(16)
    return undefined
  }
}

export default Utils.getInstance()
