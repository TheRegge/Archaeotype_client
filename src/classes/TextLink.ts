import ContainerWithBg, { ContainerWithBgOptions } from './ContainerWithBg'
import utils from '../common/Utils'
import { navLink } from './MainNav'
import config from '../common/Config'

/**
 * Display text 'link' over an hover-able background.
 *
 * The TextLink component is passed a callback method
 * which will be called on click.
 *
 * @export
 * @class TextLink
 * @extends {ContainerWithBg}
 */
export default class TextLink extends ContainerWithBg {
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
        ...config.text.p,
        color: textColor,
      }
    )

    const vPadding = (config.WORLD.origin.y - text.height) / 2

    text.setPosition(
      Math.floor(text.x - text.width / 2 - padding),
      Math.floor(text.y - text.height / 2 - padding)
    )

    if (!link.callback) options.backgroundHoverColor = undefined
    options.width = Math.ceil(text.width + 2 * padding)
    // options.height = Math.ceil(text.height + 2 * vPadding)
    options.height = Math.ceil(text.height + 2 * padding)

    const hexLinkColor = link.linkColor
      ? utils.hexToString(link.linkColor)
      : textColor

    const hexLinkHoverColor = link.linkHoverColor
      ? utils.hexToString(link.linkHoverColor)
      : hexLinkColor

    options.hoverHandler = (isHover: boolean) => {
      text.setStyle({
        color: isHover ? hexLinkHoverColor : hexLinkColor,
      })
    }
    super(options)

    this.add(text)
  }

  /**
   * The full width of this component.
   *
   * @readonly
   * @memberof TextLink
   */
  get fullWidth() {
    return this.background.width
  }

  /**
   * The full height of this component.
   *
   * @readonly
   * @memberof TextLink
   */
  get fullHeight() {
    return this.background.height
  }
}
