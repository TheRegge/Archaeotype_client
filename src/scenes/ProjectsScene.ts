import BaseScene from './BaseScene'
import Auth from '../common/Auth'
import Utils from '../common/Utils'

import axios from 'axios'

import config from '../common/Config'

export default class ProjectsScene extends BaseScene {
  public lineSpacing: number

  constructor() {
    super({ key: 'projects' })
    this.lineSpacing = 36
  }

  create() {
    this.transitionIn()

    this.add.text(100, 100, 'Archaeotype Projects', {
      fontSize: '36px',
      fontFamily: config.GOOGLE_FONT_FAMILY,
      color: Utils.hexToString(config.COLOR_HINT_SECONDARY),
    })
    axios
      .get(`${process.env.API_URL}/project`, {
        headers: {
          Authorization: `Bearer ${Auth.token}`,
        },
      })
      .then((res) => {
        let y = 100 + this.lineSpacing
        res.data.projects.map((project) => {
          y += this.lineSpacing
          const content = project.title + ' - ' + project.description

          this.add.text(100, y, content, {
            color: Utils.hexToString(config.COLOR_GRAY_100),
            fontFamily: config.GOOGLE_FONT_FAMILY,
            fontSize: '16px',
          })
          y += this.lineSpacing / 2
          project.sites.map((site) => {
            y += this.lineSpacing
            this.makeSiteLink(project.id, site, Math.ceil(y))
          })
        })
      })
  }

  makeSiteLink = (projectId: string, site: any, offset: number): void => {
    const text = this.add.text(100, offset, `* ${site.name}`, {
      color: Utils.hexToString(config.COLOR_HINT_PRIMARY),
      fontFamily: config.GOOGLE_FONT_FAMILY,
      fontSize: '14px',
    })

    text.setInteractive({
      useHandCursor: true,
    })

    text.on('pointerover', () => {
      const color = Utils.hexToString(config.COLOR_HINT_SECONDARY)
      if (color) text.setColor(color)
    })

    text.on('pointerout', () => {
      const color = Utils.hexToString(config.COLOR_HINT_PRIMARY)
      if (color) text.setColor(color)
    })

    text.addListener('pointerdown', () => {
      this.scene.start('site', { siteId: site.id, projectId: projectId })
    })
  }
}
