import BaseScene from './BaseScene'

import MainNav from '../classes/MainNav'
import SiteQuad from '../classes/SiteQuad'

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

    const backgroundImage = this.add
      .image(config.VIEWPORT.width / 2, config.VIEWPORT.height / 2, 'site')
      .setOrigin(0.5, 0.5)

    this.createMainNav()

    const quads = [
      {
        id: 1,
        name: 'Quad 1',
        x: 50,
        y: 165,
      },
      {
        id: 2,
        name: 'Quad 2',
        x: 64,
        y: -156,
      },
      {
        id: 3,
        name: 'Quad 3',
        x: -75,
        y: -62,
      },
      {
        id: 4,
        name: 'Quad 4',
        x: -75,
        y: 48,
      },
      {
        id: 5,
        name: 'Quad 5',
        x: -180,
        y: 136,
      },
    ]

    quads.forEach((quad) => {
      const squad = new SiteQuad({
        scene: this,
        x: backgroundImage.x + quad.x,
        y: backgroundImage.y + quad.y,
        width: 50 * config.SITE_PIXEL_TO_METER_SCALE,
        height: 50 * config.SITE_PIXEL_TO_METER_SCALE,
        backgroundColor: config.COLOR_HINT_SECONDARY,
        backgroundOpacity: 0.8,
        backgroundHoverColor: config.COLOR_HINT_PRIMARY,
        backgroundHoverOpacity: 0.8,
        data: { quad },
      })

      this.add.existing(squad)
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

    const navLinks = [
      { name: 'Archaeotype', textColor: config.COLOR_HINT_SECONDARY },
      { name: 'Choose Your Quad' },
    ]

    this.mainNav = new MainNav(navOptions, navLinks)
  }
}
