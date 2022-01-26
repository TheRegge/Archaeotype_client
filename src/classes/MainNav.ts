import config from '../common/Config'
import ContainerWithBg, { ContainerWithBgOptions } from './ContainerWithBg'
import TextLink from './TextLink'

export type navLink = {
  name: string
  linkColor?: number
  linkHoverColor?: number
  backgroundColor?: number
  backgroundHoverColor?: number
  callback?: () => void
}

export default class MainNav extends ContainerWithBg {
  public padding: number

  public constructor(navOptions: ContainerWithBgOptions, navLinks: navLink[]) {
    super(navOptions)
    this.padding = 10
    let xpos = this.padding
    navLinks.forEach((link, index) => {
      const txtLink = new TextLink(
        {
          scene: this.scene,
          x: 0,
          y: 0,
          height: 0,
          width: 0,
          backgroundColor: link.backgroundColor || config.COLOR_GRAY_700,
          backgroundHoverColor:
            link.backgroundHoverColor || config.COLOR_GRAY_900,
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
    this.scene.add.existing(this)
  }
}
