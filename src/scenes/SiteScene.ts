import Phaser from 'phaser'
import MainNav from '../classes/MainNav'
import config from '../common/Config'
// 83.06% is how much I reduced the original image from Paul
export default class SiteScene extends Phaser.Scene {
  private mainNav

  constructor() {
    super({ key: 'site' })
  }

  preload() {
    import(/* webpackChunkName: "QuadScene" */ './QuadScene').then(
      (QuadScene) => {
        this.game.scene.add('quad', QuadScene.default, false)
      }
    )
  }

  create() {
    this.add
      .image(
        config.VIEWPORT.width / 2,
        config.VIEWPORT.height - config.WORLD.innerPadding,
        'site'
      )
      .setOrigin(0.5, 1)

    this.createMainNav()

    this.input.on('pointerdown', () => {
      this.scene.start('quad')
    })
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
          console.log('Test in SiteScene Nav')
        },
      },
    ]

    this.mainNav = new MainNav(navOptions, navLinks)
  }
}
