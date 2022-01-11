import config from '~/common/Config'
import ContainerWithBg, { ContainerWithBgOptions } from './ContainerWithBg'
import TextLink from './TextLink'

export type navLink = {
  name: string
  linkColor?: number
  callback?: () => void
}

export default class MainNav extends ContainerWithBg {
  public padding: number

  public constructor(options: ContainerWithBgOptions, links: navLink[]) {
    super(options)
    this.padding = 10
    let xpos = this.padding
    links.forEach((link, index) => {
      const txtLink = new TextLink(
        {
          scene: this.scene,
          x: 0,
          y: 0,
          height: 0,
          width: 0,
          backgroundColor: config.COLOR_GRAY_MEDIUM,
          backgroundHoverColor: config.COLOR_GRAY_DARK,
          clickHandler: link.callback,
        },
        link,
        16
      )
      txtLink.setPosition(
        xpos - Math.floor(this.width / 2) + txtLink.fullWidth / 2,
        0
      )
      this.add(txtLink)

      xpos += txtLink.fullWidth + this.padding
    })
  }
}
