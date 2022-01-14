import Phaser from 'phaser'
import { PreloadScene, LoginScene } from './scenes'
import config from '~/common/Config'

const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-app',
  width: config.VIEWPORT.width,
  height: config.VIEWPORT.height,
  dom: {
    createContainer: true,
  },
  backgroundColor: config.COLOR_GRAY_700,
  scale: {
    mode: Phaser.Scale.NONE,
  },
  physics: {
    default: 'arcade',
  },
  scene: [PreloadScene, LoginScene],
}

export default new Phaser.Game(GameConfig)
