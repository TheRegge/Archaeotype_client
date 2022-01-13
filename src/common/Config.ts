/**
 * Contains all the configurations for the game.
 *
 * @class Config
 */
export class Config {
  private static instance: Config

  /**
   * The width of the terrain image in pixels.
   *
   * @memberof Config
   */
  private terrain_image_width_pixels = 4100

  /**
   * The height of the terrain image in pixels.
   *
   * @memberof Config
   */
  private terrain_image_height_pixels = 4100

  /**
   * The real-world width of a squad.
   *
   * This is only used to calculate the scale
   * of the map on screen, so the width
   * equivalent is not needed.
   *
   * @memberof Config
   */
  private terrain_width_meters = 50

  /**
   * The number of screen pixels representing 1 meter
   * in the real world.
   *
   * @memberof Config
   */
  readonly ONE_METER_PIXELS =
    this.terrain_image_width_pixels / this.terrain_width_meters

  /**
   * The scale of one tile.
   *
   * The number of real-world meters
   * each grid unit/tile covers.
   *
   * @memberof Config
   */
  readonly TILE_SCALE = 2

  /**
   * The scale of the mini map
   * relative to the size of the terrain
   * on screen.
   *
   * @memberof Config
   */
  readonly MINIMAP_SCALE = 1 / 20

  /**
   * The speed at which the viewport
   * spans accross the full terrain
   * in pixel per seconds.
   *
   * @memberof Config
   */
  readonly PLAYER_SPEED = 500

  /**
   * The vertical distance in pixels from the top
   * of the viewport where the map starts,
   * and where the horizontal ruler is placed.
   * This is used to leave room for UI elements
   * on the top of the map (Usually the main navigation).
   *
   * @memberof Config
   */
  readonly V_OFFSET = 48

  /**
   * The horizontal distance in pixels from the
   * left of the viewport where the map starts, and
   * where the vertical ruler is placed.
   * This is used in case some UI element needs to be
   * placed on the left of the map.
   *
   * @memberof Config
   */
  readonly H_OFFSET = 0

  /**
   * The inner distance from the edges to place
   * UI elements on the map. This is used
   * the place the minimap.
   *
   * @memberof Config
   */
  readonly SITE_INNERPADDING = 32

  /**
   * The width of the main viewport (HTML canvas)
   * in pixels.
   *
   * @memberof Config
   */
  readonly GAME_WIDTH = 1400

  /**
   * The height of the main viewport (HTML canvas)
   * in pixels.
   *
   * @memberof Config
   */
  readonly GAME_HEIGHT = 700

  readonly COLOR_GRAY_50 = 0xfafafa
  readonly COLOR_GRAY_100 = 0xf4f4f5
  readonly COLOR_GRAY_200 = 0xe4e4e7
  readonly COLOR_GRAY_300 = 0xd4d4d8
  readonly COLOR_GRAY_400 = 0xa1a1aa
  readonly COLOR_GRAY_500 = 0x71717a
  readonly COLOR_GRAY_600 = 0x52525b
  readonly COLOR_GRAY_700 = 0x3f3f46
  readonly COLOR_GRAY_800 = 0x27272a
  readonly COLOR_GRAY_900 = 0x18181b

  readonly COLOR_HINT_PRIMARY = 0x38a8dc
  readonly COLOR_HINT_SECONDARY = 0xe55f2a

  /**
   * The sequence of letters to be optionally
   * displayed in the rulers instead of numbers.
   *
   * @memberof Config
   */
  readonly LETTERS = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'AA',
    'BB',
    'CC',
    'DD',
    'EE',
    'FF',
    'GG',
    'HH',
    'II',
    'JJ',
    'KK',
    'LL',
    'MM',
    'NN',
    'OO',
    'PP',
    'QQ',
    'RR',
    'SS',
    'TT',
    'UU',
    'VV',
    'WW',
    'XX',
    'YY',
    'ZZ',
  ]

  // Derived values

  /**
   * The width and height (tiles are squares) of
   * a tile in pixels.
   *
   * This is derived from the scale of a tile and
   * the number of pixels in one real world meter.
   *
   * @memberof Config
   */
  readonly TILE_SIZE = this.TILE_SCALE * this.ONE_METER_PIXELS

  /**
   * The number of tiles across the width of the terrain.

   * Derived from the size of the terrain image and the scale
   * of the tile.
   *
   * @memberof Config
   */
  readonly NUM_TILES_WIDTH = this.terrain_image_width_pixels / this.TILE_SIZE

  /**
   * The number of tiles across the height of the terrain.

   * Derived from the size of the terrain image and the scale
   * of the tile.
   *
   * @memberof Config
   */
  readonly NUM_TILES_HEIGHT = this.terrain_image_height_pixels / this.TILE_SIZE

  /**
   * An object describing the full viewable terrain.
   *
   * @memberof Config
   */
  readonly WORLD = {
    origin: {
      x: this.H_OFFSET,
      y: this.V_OFFSET,
    },
    width: this.TILE_SIZE * this.NUM_TILES_WIDTH + this.H_OFFSET,
    height: this.TILE_SIZE * this.NUM_TILES_HEIGHT + this.V_OFFSET,
    innerPadding: this.SITE_INNERPADDING,
  }

  /**
   * An object describing the size of the on-screen-visible
   * part of the software. It's really the size of the Phaser game.
   *
   * It contains UI elements like the main navigation as well
   * as the visible part of the terrain.
   *
   * @memberof Config
   */
  readonly VIEWPORT = {
    width: this.GAME_WIDTH,
    height: this.GAME_HEIGHT,
  }

  /**
   * An object describing the Minimap
   * scale and dimensions.
   *
   * @memberof Config
   */
  readonly MINIMAP = {
    scale: this.MINIMAP_SCALE,
    width: this.WORLD.width * this.MINIMAP_SCALE,
    height: this.WORLD.height * this.MINIMAP_SCALE,
  }

  private constructor() {
    // no need to do anything, just make it private
    // so it cannot instantiate new instances from outside
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config()
    }
    return Config.instance
  }
}

export default Config.getInstance()
