import ContainerWithBg, { ContainerWithBgOptions } from './ContainerWithBg'
import { hexToString } from '~/common/utils'
import { navLink } from './MainNav'
import { WORLD } from '~/main'

export default class TextLink extends ContainerWithBg {
  public padding
  public constructor(
    options: ContainerWithBgOptions,
    link: navLink,
    padding: number = 10
  ) {
    const textColor = hexToString(link.linkColor) || 'white'
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

    const vPadding = (WORLD.origin.y - text.height) / 2
    text.setPosition(
      Math.floor(text.x - text.width / 2 - padding),
      Math.floor(text.y - text.height / 2 - vPadding)
    )

    if (!link.callback) options.backgroundHoverColor = undefined
    options.width = Math.ceil(text.width + 2 * padding)
    options.height = Math.ceil(text.height + 2 * vPadding)

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
