import ContainerWithBg, { ContainerWithBgOptions } from './ContainerWithBg'
import utils from '../common/Utils'
import { navLink } from './MainNav'
import config from '../common/Config'

export default class TextLink extends ContainerWithBg {
  public padding

  public constructor(
    options: ContainerWithBgOptions,
    link: navLink,
    padding: number = 10
  ) {
    const textColor =
      utils.hexToString(link.linkColor) ||
      utils.hexToString(link.textColor) ||
      'white'
    const text = new Phaser.GameObjects.Text(
      options.scene,
      padding,
      padding,
      link.name.toUpperCase(),
      {
        fontFamily: 'Cousine',
        fontSize: '16px',
        color: textColor,
      }
    )

    const vPadding = (config.WORLD.origin.y - text.height) / 2
    text.setPosition(
      Math.floor(text.x - text.width / 2 - padding),
      Math.floor(text.y - text.height / 2 - vPadding)
    )

    if (!link.callback) options.backgroundHoverColor = undefined
    options.width = Math.ceil(text.width + 2 * padding)
    options.height = Math.ceil(text.height + 2 * vPadding)

    const hexLinkHoverColor = utils.hexToString(link.linkHoverColor)
    const hexLinkColor = utils.hexToString(link.linkColor)
    options.hoverHandler = (isHover: boolean) => {
      text.setStyle({
        color: isHover ? hexLinkHoverColor : hexLinkColor,
      })
    }
    super(options)

    this.padding = padding

    this.add(text)
  }

  get fullWidth() {
    return this.background.width
  }

  get fullHeight() {
    return this.background.height
  }
}
