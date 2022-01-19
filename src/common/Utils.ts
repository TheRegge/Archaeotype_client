import Config from './Config'

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

  /**
   * metersToPixels
   *
   * Converts a number in meters into a number of pixels
   * according to the game's scale.
   *
   * @param {number} n the distance in meters to convert.
   * @returns {number} the number of pixels at the game scale representing the distance in meters.
   * @memberof Utils
   */
  metersToPixels(n: number): number {
    return n * Config.ONE_METER_PIXELS
  }

  /**
   * Converts degrees to randians.
   *
   * @param {number} degrees The value in degrees to convert into radians.
   * @returns {number} The converted value in radians.
   * @memberof Utils
   */
  degreesToRandian(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

}

export default Utils.getInstance()
