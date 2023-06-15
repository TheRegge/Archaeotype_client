import BaseScene from '../BaseScene'

import config from '../../common/Config'

import { ContainerWithBg, ContainerWithBgOptions } from '../../classes'

export default class BaseToolsScene extends BaseScene {
  public parentScene: Phaser.Scene
  public width: number
  public height: number
  public x: number
  public y: number
  public padding: number
  public html: any
  public eventsCancellables: Element[]

  constructor(
    key: string,
    parentScene: Phaser.Scene,
    width: number,
    height: number,
    x: number,
    y: number
  ) {
    super({ key })

    this.parentScene = parentScene
    this.width = width
    this.height = height
    this.x = x
    this.y = y

    this.padding = 20

    this.eventsCancellables = []
  }

  init(): void {
    super.init(null)
  }

  create(): void {
    const background = new ContainerWithBg({
      scene: this,
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      backgroundColor: config.COLOR_GRAY_900,
      backgroundOpacity: 1,
      scrollFactorX: 0,
      scrollFactorY: 0,
    })

    const container = this.add.container(this.x, this.y, [background])

    container.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(0, 0, this.width, this.height),
      cursor: 'pointer',
    })
    this.parentScene.input.setDraggable(container)
  }
}
