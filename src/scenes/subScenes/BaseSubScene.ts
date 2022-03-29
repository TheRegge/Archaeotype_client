import BaseScene from '../BaseScene'

import config from '../../common/Config'

import { ContainerWithBg, ContainerWithBgOptions } from '../../classes'
import TextLink from '../../classes/TextLink'

export default class BaseSubScene extends BaseScene {
  public width: number
  public height: number
  public padding: number
  public margin: number
  public html
  public eventsCancellables: Element[]

  public local: {
    x: (val: number) => number
    y: (val: number) => number
    padded: {
      x: (val: number) => number
      y: (val: number) => number
    }
  }

  public origin: {
    x: number
    y: number
  }

  constructor(key: string) {
    const { H_OFFSET, V_OFFSET, VIEWPORT, WORLD } = config

    super({ key })

    this.padding = 20

    this.margin = 20

    this.width =
      VIEWPORT.width - WORLD.innerPadding * 2 - H_OFFSET - this.margin * 2

    this.height =
      VIEWPORT.height - WORLD.innerPadding * 2 - V_OFFSET - this.margin * 2

    this.origin = {
      x: (VIEWPORT.width - this.width + WORLD.innerPadding + H_OFFSET) / 2,
      y: (VIEWPORT.height - this.height + WORLD.innerPadding + V_OFFSET) / 2,
    }

    this.local = {
      x: (val: number) =>
        Phaser.Math.Clamp(
          val + this.origin.x,
          this.origin.x,
          this.origin.x + this.width
        ),
      y: (val: number) =>
        Phaser.Math.Clamp(
          val + this.origin.y,
          this.origin.y,
          this.origin.y + this.height
        ),
      padded: {
        x: (val: number) =>
          Phaser.Math.Clamp(
            val + this.origin.x + this.padding,
            this.origin.x + this.padding,
            this.origin.x + this.width - this.padding
          ),
        y: (val: number) =>
          Phaser.Math.Clamp(
            val + this.origin.y + this.padding,
            this.origin.y + this.padding,
            this.origin.y + this.height - this.padding
          ),
      },
    }

    this.eventsCancellables = []
  }

  init(): void {
    super.init()
    this.input.keyboard.on('keydown-ESC', this.close.bind(this))

    this.events.on('wake', (input, newData) => {
      this.data.set('fromScene', newData.fromScene)
      this.data.set('htmlData', newData.htmlData)
      this.initHTML()
    })
  }

  create(data: {
    fromScene: Phaser.Scene
    htmlTagName: string
    htmlData: any
  }) {
    this.data.set('fromScene', data.fromScene)
    this.data.set('htmlData', data.htmlData)

    const background = new ContainerWithBg({
      scene: this,
      x: this.origin.x,
      y: this.origin.y,
      height: this.height,
      width: this.width,
      backgroundColor: config.COLOR_GRAY_900,
      backgroundOpacity: 0.95,
      scrollFactorX: 0,
      scrollFactorY: 0,
    })

    this.add.existing(background)

    this.html = this.add
      .dom(this.local.padded.x(0), this.local.padded.y(0))
      .createFromCache(data.htmlTagName)

    this.html.setOrigin(0, 0)

    this.initHTML()

    // The close button
    const closeButtonBgOptions: ContainerWithBgOptions = {
      scene: this,
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      backgroundColor: config.COLOR_HINT_PRIMARY_STRONG,
      backgroundHoverColor: config.COLOR_HINT_SECONDARY_STRONG,
      clickHandler: () => this.close(),
    }
    const closeButton = new TextLink(
      closeButtonBgOptions,
      {
        name: 'x',
        callback: () => null,
      },
      5
    )
    closeButton.setPosition(
      this.local.padded.x(this.width) - closeButton.fullWidth / 4,
      this.local.padded.y(0) + closeButton.fullHeight / 4
    )

    this.add.existing(closeButton)
  }

  cleanup() {
    // Cancel HTML elements events
    this.eventsCancellables.forEach((el) => {
      el.replaceWith(el.cloneNode(true))
    })
  }

  close() {
    this.cleanup()

    // Switch scene
    const fromScene = this.data.get('fromScene')
    fromScene.scene.resume()
    this.scene.sleep()
  }

  initHTML() {}
}
