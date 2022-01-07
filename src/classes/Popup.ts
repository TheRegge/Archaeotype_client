import { hexToString } from '~/common/utils'
import { COLOR_HINT_PRIMARY } from '~/main'
import { IToggle } from '.'
import ContainerWithBg, { ContainerWithBgOptions } from './ContainerWithBg'

export type PopupOptions = {
  title: string
  body: string[]
}
export class Popup extends ContainerWithBg implements IToggle {
  private padding
  public titleText
  public bodyText
  private lineSpacing

  public constructor(options: ContainerWithBgOptions) {
    super(options)

    this.visible = false
    this.padding = 20
    this.lineSpacing = 8

    this.titleText = new Phaser.GameObjects.Text(
      options.scene,
      Math.floor(this.padding - this.width / 2),
      Math.floor(this.padding - this.height / 2),
      '',
      {
        fontFamily: 'Cousine',
        fontSize: '24px',
        color: hexToString(COLOR_HINT_PRIMARY),
      }
    )
    this.add(this.titleText)

    const closeText = new Phaser.GameObjects.Text(
      options.scene,
      0,
      Math.floor(this.padding - this.height / 2),
      'Close X',
      {
        fontFamily: 'Cousine',
        fontSize: '12px',
        color: 'white',
      }
    )
    closeText.setPosition(
      Math.floor(this.width / 2 - this.padding - closeText.width),
      Math.floor(this.padding - this.height / 2)
    )
    this.add(closeText)

    this.bodyText = new Phaser.GameObjects.Text(
      options.scene,
      Math.floor(this.padding - this.width / 2),
      Math.floor(this.padding - this.height / 2),
      '',
      {
        fontFamily: 'Cousine',
        fontSize: '14px',
        color: '#eeeeee',
        padding: {
          top: 60,
        },
      }
    )
    this.bodyText
      .setLineSpacing(this.lineSpacing)
      .setWordWrapWidth(this.width - this.padding * 2)

    this.add(this.bodyText)
  }

  public toggle = () => {
    this.visible = !this.visible
  }

  public show = () => {
    this.visible = true
  }

  public hide = () => {
    this.visible = false
  }

  public setContent = (content: PopupOptions) => {
    this.titleText.setText(content.title.toUpperCase())
    this.bodyText.setText(content.body)
  }

  public showWithContent = (content: PopupOptions) => {
    this.setContent(content)
    this.show()
  }
}
