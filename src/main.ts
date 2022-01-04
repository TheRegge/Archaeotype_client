import Phaser from 'phaser'
import { LoadingScene } from './scenes'

export const TILE_SIZE = 164
export const NUM_TILES_HEIGHT = 25
export const NUM_TILES_WIDTH = 25
export const MINIMAP_SCALE = 20
export const PLAYER_SPEED = 500
export const HINT_COLOR = 0x27a0e7
export const V_OFFSET = 32

export const WORLD = {
  origin: { x: 0, y: V_OFFSET },
  width: TILE_SIZE * NUM_TILES_WIDTH,
  height: TILE_SIZE * NUM_TILES_HEIGHT,
  innerPadding: 32,
}

export enum VIEWPORT {
  width = 1400,
  height = 700,
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
  backgroundColor: 0x333333,
  scale: {
    mode: Phaser.Scale.NONE,
  },
  physics: {
    default: 'arcade',
  },
  scene: [LoadingScene],
}

export default new Phaser.Game(config)
