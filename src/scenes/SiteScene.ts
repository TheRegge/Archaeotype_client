import Auth from '../common/Auth'
import BaseScene from './BaseScene'

import MainNav from '../classes/MainNav'
import SiteQuad from '../classes/SiteQuad'

import Data from '../common/Data'
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

  async create(data: object) {
    this.data.set(data, {})

    if (!this.data.get('siteId')) {
      this.data.set('siteId', Auth.user?.site_id || 0)
    }

    this.transitionIn()

    const backgroundImage = this.add
      .image(
        config.VIEWPORT.width / 2 + 200,
        config.VIEWPORT.height / 2 + config.WORLD.innerPadding / 2,
        'site'
      )
      .setOrigin(0.5, 0.5)

    this.createMainNav()

    const site = await Data.getSiteQuads(this.data.get('siteId'))

    // Title
    this.add.text(config.H_OFFSET + config.WORLD.innerPadding, 130, site.name, {
      fontFamily: config.GOOGLE_FONT_FAMILY,
      fontSize: '24px',
      color: '#fff',
    })

    // Description
    const description = this.add.text(
      config.H_OFFSET + config.WORLD.innerPadding,
      200,
      site.description,
      {
        fontFamily: config.GOOGLE_FONT_FAMILY,
        fontSize: '16px',
        color: '#fff',
      }
    )
    description.setWordWrapWidth(400, true)
    description.setLineSpacing(18)

    const quads = site.quads
    quads.forEach((quad) => {
      let backgroundColor = config.COLOR_HINT_SECONDARY
      let backgroundOverColor = config.COLOR_HINT_PRIMARY

      if (Auth.user?.quad_id && Auth.user.quad_id !== quad.id) {
        backgroundColor = config.COLOR_HINT_PRIMARY
        backgroundOverColor = config.COLOR_HINT_PRIMARY
      }

      const squad = new SiteQuad({
        scene: this,
        x: backgroundImage.x + quad.x * 1,
        y: backgroundImage.y + quad.y * 1,
        width: 50 * config.SITE_PIXEL_TO_METER_SCALE,
        height: 50 * config.SITE_PIXEL_TO_METER_SCALE,
        backgroundColor,
        backgroundOpacity: 0.8,
        backgroundOverColor,
        backgroundOverOpacity: 0.8,
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
