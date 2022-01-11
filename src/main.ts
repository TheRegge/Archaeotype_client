import Phaser from 'phaser'
import { LoadingScene } from './scenes'
import config from '~/common/Config'

const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-app',
  width: config.VIEWPORT.width,
  height: config.VIEWPORT.height,
  dom: {
    createContainer: true,
  },
  backgroundColor: config.COLOR_GRAY_LIGHTER,
  scale: {
    mode: Phaser.Scale.NONE,
  },
  physics: {
    default: 'arcade',
  },
  scene: [LoadingScene],
}

export default new Phaser.Game(GameConfig)
