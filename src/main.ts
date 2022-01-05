import Phaser from 'phaser'
import { LoadingScene } from './scenes'

export const TILE_SIZE = 164
export const NUM_TILES_HEIGHT = 25
export const NUM_TILES_WIDTH = 25
export const MINIMAP_SCALE = 20
export const PLAYER_SPEED = 500
export const V_OFFSET = 32
export const H_OFFSET = 0
export const SITE_INNERPADDING = 32
export const GAME_WIDTH = 1400
export const GAME_HEIGHT = 700

export const COLOR_GRAY_DARK = 0x262626
export const COLOR_GRAY_MEDIUM = 0x454545
export const COLOR_GRAY_LIGHT = 0x696969
export const COLOR_GRAY_LIGHTER = 0xbababa
export const COLOR_HINT_PRIMARY = 0x38a8dc
export const COLOR_HINT_SECONDARY: number = 0xe55f2a

export const WORLD = {
  origin: { x: H_OFFSET, y: V_OFFSET },
  width: TILE_SIZE * NUM_TILES_WIDTH,
  height: TILE_SIZE * NUM_TILES_HEIGHT,
  innerPadding: SITE_INNERPADDING,
}

export enum VIEWPORT {
  width = GAME_WIDTH,
  height = GAME_HEIGHT,
}

export enum MINIMAP {
  scale = MINIMAP_SCALE,
  width = WORLD.width / MINIMAP_SCALE,
  height = WORLD.height / MINIMAP_SCALE,
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-app',
  width: VIEWPORT.width,
  height: VIEWPORT.height + V_OFFSET,
  dom: {
    createContainer: true,
  },
  backgroundColor: COLOR_GRAY_DARK,
  scale: {
    mode: Phaser.Scale.NONE,
  },
  physics: {
    default: 'arcade',
  },
  scene: [LoadingScene],
}

export default new Phaser.Game(config)
