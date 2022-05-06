import axios from 'axios'

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

  async create() {
    // TODO: Implement this
    this.data.set('siteId', 1)

    this.transitionIn()

    const backgroundImage = this.add
      .image(config.VIEWPORT.width / 2, config.VIEWPORT.height / 2, 'site')
      .setOrigin(0.5, 0.5)

    this.createMainNav()

    const site = await Data.getSiteQuads(this.data.get('siteId'))
    const quads = site.quads

    quads.forEach((quad) => {
      const squad = new SiteQuad({
        scene: this,
        x: backgroundImage.x + quad.x * 1,
        y: backgroundImage.y + quad.y * 1,
        width: 50 * config.SITE_PIXEL_TO_METER_SCALE,
        height: 50 * config.SITE_PIXEL_TO_METER_SCALE,
        backgroundColor: config.COLOR_HINT_SECONDARY,
        backgroundOpacity: 0.8,
        backgroundOverColor: config.COLOR_HINT_PRIMARY,
        backgroundOverOpacity: 0.8,
        data: { quad },
      })
      console.log('squad', squad)
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
