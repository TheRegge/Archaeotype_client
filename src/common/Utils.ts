import config from './Config'

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
   * @param {(number | undefined)} n an hexadecimal number to convert (ex: 0xd0ab1e)
   * @returns {(string | undefined)} a string representing the hexadecimal number for use in CSS
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
    return n * config.QUAD_ONE_METER_PIXELS
  }

  /**
   * pixelToMeters
   *
   * Converts a distance in pixels into a distance in meters
   * according to game's scale.
   *
   * @param {number} n the distance in pixels to be converted.
   * @returns {number} the converted distance in meters
   * @memberof Utils
   */
  pixelsToMeters(n: number): number {
    return n / config.QUAD_ONE_METER_PIXELS
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

  /**
   * lazzyLoadImage
   *
   * Loads an image file and use it to replace the existing
   * texture of the image passed as a parameter. Returns a promise
   * which resolves when the image (texture) is loaded
   *
   * @param {Phaser.Scene} scene The scene in which the image was created. It is needed to create the loader.
   * @param {Phaser.GameObjects.Image} image The image we want to change the texture of.
   * @param {string} imageName The image 'name' key on the scene.
   * @param {string} src The image source path of the new image to load
   * @memberof Utils
   */
  lazzyLoadImage(
    scene: Phaser.Scene,
    image: Phaser.GameObjects.Image,
    imageName: string,
    src: string,
    width?: number,
    height?: number
  ) {
    return new Promise<void>((resolve) => {
      if (scene.textures.exists(imageName)) {
        image.setTexture(imageName)
        if (width && height) {
          image.setDisplaySize(width, height)
        }
        return
      }
      let loader = new Phaser.Loader.LoaderPlugin(scene)
      loader.image(imageName, src)

      loader.once(Phaser.Loader.Events.COMPLETE, () => {
        image.setTexture(imageName)
        if (width && height) {
          image.setSize(width, height)
          resolve()
        }
      })
      loader.start()
    })
  }

  /**
   * Return a JSON formatted string of the representing
   * the game object WITH its data full object.
   *
   * Why? For some reason, `Phaser.GameObjects.GameObject.toJSON`
   * returns a representation of the game object, but with its
   * data object EMPTY! (at least Phaser.GameObjects.Image.toJSON
   * does.)
   *
   * @param {Phaser.GameObjects.GameObject} go
   * @returns {string}
   * @memberof Utils
   */
  gameObjectToJSONWithData(go: Phaser.GameObjects.GameObject): string {
    const json = go.toJSON()
    json.data = go.data.getAll()
    return JSON.stringify(json)
  }
}

export default Utils.getInstance()
