import { COLOR_GRAY_DARK, COLOR_GRAY_MEDIUM } from '~/main'
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
          backgroundColor: COLOR_GRAY_MEDIUM,
          backgroundHoverColor: COLOR_GRAY_DARK,
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
      console.log(link.name, txtLink.fullWidth, 'xpos', xpos)

      xpos += txtLink.fullWidth + this.padding
    })
  }
}
