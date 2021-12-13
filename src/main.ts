import Phaser from 'phaser'
import SiteScene from './scenes/SiteScene'

export const TILE_SIZE = 164
export const NUM_TILES_HEIGHT = 25
export const NUM_TILES_WIDTH = 25
export const MINIMAP_SCALE = 20
export const PLAYER_SPEED = 500

export enum WORLD {
	width = TILE_SIZE * NUM_TILES_WIDTH,
	height = TILE_SIZE * NUM_TILES_HEIGHT,
	innerPadding = 32
}

export enum VIEWPORT {
	width = 1400,
	height = 700
}

export enum MINIMAP {
	scale = MINIMAP_SCALE,
	width = WORLD.width / MINIMAP_SCALE,
	height = WORLD.height / MINIMAP_SCALE
}

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'phaser-app',
	width: 1400,
	height: 700,
	backgroundColor: '#f5f5f5',
	scale: {
		mode: Phaser.Scale.NONE
	},
	physics: {
		default: 'arcade',
	},
	scene: [SiteScene]
}

export default new Phaser.Game(config)
