export type ContainerWithBgOptions = {
  scene: Phaser.Scene
  x: number
  y: number
  height: number
  width: number
  backgroundColor: number
  backgroundOpacity?: number
  backgroundOverColor?: number
  backgroundOverOpacity?: number
  clickHandler?: (scene?: Phaser.Scene) => void
  hoverHandler?: (isHover: boolean) => void
  scrollFactorX?: number
  scrollFactorY?: number
  data?: { quad?: object }
}

export default class ContainerWithBg extends Phaser.GameObjects.Container {
  public background: Phaser.GameObjects.Rectangle
  public clickHandler: ((scene?: Phaser.Scene) => void) | undefined

  public constructor(options: ContainerWithBgOptions) {
    const {
      scene,
      x,
      y,
      height,
      width,
      backgroundColor = 0x000000,
      backgroundOpacity = 1,
      backgroundOverColor,
      backgroundOverOpacity,
      clickHandler,
      hoverHandler,
      scrollFactorX = 0,
      scrollFactorY = 0,
    } = options

    super(scene, x, y)

    this.clickHandler = clickHandler

    this.background = new Phaser.GameObjects.Rectangle(
      this.scene,
      0,
      0,
      width,
      height,
      backgroundColor,
      backgroundOpacity
    )
    this.add(this.background)

    this.setScrollFactor(scrollFactorX, scrollFactorY)
    this.setSize(width, height)
    this.setPosition(x + width / 2, y + height / 2)

    if (this.clickHandler || backgroundOverColor) {
      this.setInteractive({
        hitArea: this.background,
        cursor: 'pointer',
      })
    }

    this.on('pointerdown', () => {
      if (this.clickHandler) {
        this.clickHandler(this.scene)
      }
    })

    this.on('pointerup', () => {
        const opacity = backgroundOverOpacity || backgroundOpacity
        this.background.setFillStyle(backgroundOverColor, opacity)
      }
    })

    this.on('pointerover', () => {
      if (backgroundOverColor) {
        const opacity = backgroundOverOpacity || backgroundOpacity
        this.background.setFillStyle(backgroundOverColor, opacity)
      }
      if (hoverHandler) {
        hoverHandler(true)
      }
    })

    this.on('pointerout', () => {
      if (backgroundOverColor) {
        this.background.setFillStyle(backgroundColor, backgroundOpacity)
      }
      if (hoverHandler) {
        hoverHandler(false)
      }
    })
  }
}
