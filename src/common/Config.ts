class Config {
  private static instance: Config

  readonly TILE_SCALE = 2
  readonly TILE_SIZE = 164 / this.TILE_SCALE
  readonly NUM_TILES_HEIGHT = 50
  readonly NUM_TILES_WIDTH = 50
  readonly MINIMAP_SCALE = 1 / 20
  readonly PLAYER_SPEED = 500
  readonly V_OFFSET = 48
  readonly H_OFFSET = 0
  readonly SITE_INNERPADDING = 32
  readonly GAME_WIDTH = 1400
  readonly GAME_HEIGHT = 700

  readonly COLOR_GRAY_DARK = 0x262626
  readonly COLOR_GRAY_MEDIUM = 0x454545
  readonly COLOR_GRAY_LIGHT = 0x696969
  readonly COLOR_GRAY_LIGHTER = 0xbababa
  readonly COLOR_HINT_PRIMARY = 0x38a8dc
  readonly COLOR_HINT_SECONDARY = 0xe55f2a

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
  readonly WORLD = {
    origin: {
      x: this.H_OFFSET,
      y: this.V_OFFSET,
    },
    width: this.TILE_SIZE * this.NUM_TILES_WIDTH + this.H_OFFSET,
    height: this.TILE_SIZE * this.NUM_TILES_HEIGHT + this.V_OFFSET,
    innerPadding: this.SITE_INNERPADDING,
  }

  readonly VIEWPORT = {
    width: this.GAME_WIDTH,
    height: this.GAME_HEIGHT,
  }

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
