/**
 * Contains all the configurations for the game.
 *
 * @class Config
 */
export class Config {
  private static instance: Config

  // Site bg image is scaled for 1px == 1m
  private site_bg_width_pixels = 1376
  private site_bg_height_pixels = 972
  /**
   * The width of the quad image in pixels.
   *x
   * @memberof Config
   */
  private quad_bg_width_pixels = 4100

  /**
   * The height of the quad image in pixels.
   *
   * @memberof Config
   */
  private quad_bg_height_pixels = 4100

  /**
   * The real-world width of a quad.
   *
   * This is only used to calculate the scale
   * of the map on screen, so the width
   * equivalent is not needed.
   *
   * @memberof Config
   */
  private quad_width_meters = 50

  readonly GOOGLE_FONT_FAMILY = 'Cousine'

  /**
   * The number of screen pixels representing 1 meter
   * in the real world.
   *
   * @memberof Config
   */
  readonly QUAD_ONE_METER_PIXELS =
    this.quad_bg_width_pixels / this.quad_width_meters

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
  readonly MINIMAP_SCALE = 1 / 5.235

  readonly SITE_PIXEL_TO_METER_SCALE = 1 / 2

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
  readonly GAME_WIDTH = 1414

  /**
   * The height of the main viewport (HTML canvas)
   * in pixels.
   *
   * @memberof Config
   */
  readonly GAME_HEIGHT = 872

  /**
   * color gray 50
   * <div style="background-color: #fafafa; width: 80px; height: 80px; border: 3px solid white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); margin: 1em;"></div>
   */
  readonly COLOR_GRAY_50 = 0xfafafa

  /**
   * color gray 100
   * <div style="background-color: #f4f4f5; width: 80px; height: 80px; border: 3px solid white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); margin: 1em;"></div>
   */
  readonly COLOR_GRAY_100 = 0xf4f4f5

  /**
   * color gray 200
   * <div style="background-color: #e4e4e7; width: 80px; height: 80px; border: 3px solid white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); margin: 1em;"></div>
   */
  readonly COLOR_GRAY_200 = 0xe4e4e7

  /**
   * color gray 300
   * <div style="background-color: #d4d4d8; width: 80px; height: 80px; border: 3px solid white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); margin: 1em;"></div>
   */
  readonly COLOR_GRAY_300 = 0xd4d4d8

  /**
   * color gray 400
   * <div style="background-color: #a1a1aa; width: 80px; height: 80px; border: 3px solid white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); margin: 1em;"></div>
   */
  readonly COLOR_GRAY_400 = 0xa1a1aa

  /**
   * color gray 500
   * <div style="background-color: #a1a1aa; width: 80px; height: 80px; border: 3px solid white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); margin: 1em;"></div>
   */
  readonly COLOR_GRAY_500 = 0xa1a1aa

  /**
   * color gray 600
   * <div style="background-color: #52525b; width: 80px; height: 80px; border: 3px solid white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); margin: 1em;"></div>
   */
  readonly COLOR_GRAY_600 = 0x52525b

  /**
   * color gray 700
   * <div style="background-color: #3f3f46; width: 80px; height: 80px; border: 3px solid white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); margin: 1em;"></div>
   */
  readonly COLOR_GRAY_700 = 0x3f3f46

  /**
   * color gray 800
   * <div style="background-color: #27272a; width: 80px; height: 80px; border: 3px solid white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); margin: 1em;"></div>
   */
  readonly COLOR_GRAY_800 = 0x27272a

  /**
   * color gray 900
   * <div style="background-color: #18181b; width: 80px; height: 80px; border: 3px solid white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); margin: 1em;"></div>
   */
  readonly COLOR_GRAY_900 = 0x18181b

  /**
   * Primary Hint Color
   * <div style="background-color: #60a5fa; width: 80px; height: 80px; border: 3px solid white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); margin: 1em;"></div>
   */
  readonly COLOR_HINT_PRIMARY = 0x60a5fa

  /**
   * Primary Hint Color <em>Strong</em>
   * <div style="background-color: #2563eb; width: 80px; height: 80px; border: 3px solid white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); margin: 1em;"></div>
   */
  readonly COLOR_HINT_PRIMARY_STRONG = 0x2563eb

  /**
   * Seconday Hint Color
   * <div style="background-color: #fbbf24; width: 80px; height: 80px; border: 3px solid white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); margin: 1em;"></div>
   */
  readonly COLOR_HINT_SECONDARY = 0xfbbf24

  /**
   * Seconday Hint Color <em>Strong</em>
   * <div style="background-color: #e55f2a; width: 80px; height: 80px; border: 3px solid white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); margin: 1em;"></div>
   */
  readonly COLOR_HINT_SECONDARY_STRONG = 0xe55f2a

  readonly SCENE_TRANSITION_TIME = 500

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

  private baseFontSize = 16
  private px = (n: number) => `${n}px`

  private baseText = {
    color: '#FFFFFF',
    fontSize: `${this.baseFontSize}px`,
    fontFamily: this.GOOGLE_FONT_FAMILY,
    padding: { x: 0, y: 0 },
  }

  /**
   * An object containing the base typography styles
   */
  readonly text = {
    h1: {
      ...this.baseText,
      fontSize: this.px(this.baseFontSize * 2.25),
    },
    h2: {
      ...this.baseText,
      fontSize: this.px(this.baseFontSize * 1.5),
    },
    h3: {
      ...this.baseText,
      fontSize: this.px(this.baseFontSize * 1.125),
    },
    h4: {
      ...this.baseText,
      fontSize: this.px(this.baseFontSize),
    },
    h5: {
      ...this.baseText,
      fontSize: this.px(this.baseFontSize),
    },
    h6: {
      ...this.baseText,
      fontSize: this.px(this.baseFontSize),
    },
    p: {
      ...this.baseText,
      fontSize: this.px(this.baseFontSize),
    },
    small: {
      ...this.baseText,
      fontSize: this.px(this.baseFontSize * 0.625),
    },
  }

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
  readonly TILE_SIZE = this.TILE_SCALE * this.QUAD_ONE_METER_PIXELS

  /**
   * The number of tiles across the width of the terrain.

   * Derived from the size of the quad image and the scale
   * of the tile.
   *
   * @memberof Config
   */
  readonly NUM_TILES_WIDTH = this.quad_bg_width_pixels / this.TILE_SIZE

  /**
   * The number of tiles across the height of the quad.

   * Derived from the size of the quad image and the scale
   * of the tile.
   *
   * @memberof Config
   */
  readonly NUM_TILES_HEIGHT = this.quad_bg_height_pixels / this.TILE_SIZE

  /**
   * An object describing the full viewable quad.
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
   * as the visible part of the quad.
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

  readonly LOCAL_STORAGE_API_TOKEN_NAME = 'archaeotype_api_token'

  readonly LOCAL_STORAGE_USER_NAME = 'archaeotype_user'

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
