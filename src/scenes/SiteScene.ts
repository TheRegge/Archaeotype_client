import Phaser from 'phaser'
import BaseScene from './BaseScene'
import MainNav from '../classes/MainNav'
import config from '../common/Config'

// 83.06% is how much I reduced the original image from Paul
export default class SiteScene extends BaseScene {
  private mainNav

  constructor() {
    super({ key: 'site' })
  }

  // preload() {
  //  Assets preloaded in  PreloadScene
  // }

  create() {
    this.transitionIn()

    this.add
      .image(
        config.VIEWPORT.width / 2,
        config.VIEWPORT.height - config.WORLD.innerPadding,
        'site'
      )
      .setOrigin(0.5, 1)

    this.createMainNav()
  }

  createMainNav = () => {
    const navOptions = {
      scene: this,
      x: 0,
      y: 0,
      height: Math.floor(config.WORLD.origin.y),
      width: config.VIEWPORT.width,
      backgroundColor: config.COLOR_GRAY_700,
    }

    const baseLinkOptions = {
      linkColor: config.COLOR_HINT_PRIMARY,
      linkHoverColor: 0xffffff,
      backgroundColor: config.COLOR_GRAY_700,
      backgroundHoverColor: config.COLOR_HINT_PRIMARY,
    }

    const navLinks = [
      { name: 'Archaeotype' },
      { name: 'Choose Quad' },
      {
        ...baseLinkOptions,
        name: 'Test',
        callback: () => {
          this.switchScene('quad')
        },
      },
    ]

    this.mainNav = new MainNav(navOptions, navLinks)
  }
}
