import Phaser from 'phaser'
import {
  PreloadScene,
  LoginScene,
  QuadScene,
  SiteScene,
  ProjectsScene,
} from './scenes'
import config from './common/Config'

if (process.env.NODE_ENV === 'development') {
  console.log(
    '%cARCHAEOTYPE IS IN DEV MODE',
    'color: #000000; background: orange; font-weight: 900;'
  )
}

const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-app',
  width: config.VIEWPORT.width,
  height: config.VIEWPORT.height,
  pixelArt: true,
  dom: {
    createContainer: true,
  },
  backgroundColor: config.COLOR_GRAY_800,
  scale: {
    mode: Phaser.Scale.NONE,
  },
  physics: {
    default: 'arcade',
  },
  scene: [PreloadScene, LoginScene, SiteScene, QuadScene, ProjectsScene],
}

export default new Phaser.Game(GameConfig)
