import BaseScene from './BaseScene'
import Auth from '../common/Auth'
import Utils from '../common/Utils'

import axios from 'axios'

import config from '../common/Config'

export default class ProjectsScene extends BaseScene {
  public lineSpacing: number

  constructor() {
    super({ key: 'projects' })
    this.lineSpacing = 40
  }

  create() {
    this.transitionIn()

    this.add.text(100, 100, 'Projects')
    axios
      .get(`${config.API_URL}/project`, {
        headers: {
          Authorization: `Bearer ${Auth.token}`,
        },
      })
      .then((res) => {
        let y = 100 + this.lineSpacing
        res.data.projects.map((project) => {
          const content = project.title + ' - ' + project.description
          const text = this.add.text(100, y, content, {
            color: Utils.hexToString(config.COLOR_HINT_PRIMARY),
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
            this.scene.start('site', { siteId: project.id })
          })
          y += this.lineSpacing
        })
      })
  }
}