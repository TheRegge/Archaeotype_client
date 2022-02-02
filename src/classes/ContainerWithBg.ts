export type ContainerWithBgOptions = {
  scene: Phaser.Scene
  x: number
  y: number
  height: number
  width: number
  backgroundColor: number
  backgroundOpacity?: number
  backgroundHoverColor?: number
  backgroundHoverOpacity?: number
  clickHandler?: () => void
  hoverHandler?: (isHover: boolean) => void
  scrollFactorX?: number
  scrollFactorY?: number
}

export default class ContainerWithBg extends Phaser.GameObjects.Container {
  public background: Phaser.GameObjects.Rectangle

  public constructor(options: ContainerWithBgOptions) {
    const {
      scene,
      x,
      y,
      height,
      width,
      backgroundColor = 0x000000,
      backgroundOpacity = 1,
      backgroundHoverColor,
      backgroundHoverOpacity,
      clickHandler,
      hoverHandler,
      scrollFactorX = 0,
      scrollFactorY = 0,
    } = options

    super(scene, x, y)

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

    if (clickHandler || backgroundHoverColor) {
      this.setInteractive({
        hitArea: this.background,
        cursor: 'pointer',
      })
    }

    if (clickHandler) {
      this.on('pointerdown', () => {
        clickHandler()
      })
    }

    this.on('pointerup', () => {
      if (backgroundHoverColor) {
        const opacity = backgroundHoverOpacity || backgroundOpacity
        this.background.setFillStyle(backgroundHoverColor, opacity)
      }
    })

    this.on('pointerover', () => {
      if (backgroundHoverColor) {
        const opacity = backgroundHoverOpacity || backgroundOpacity
        this.background.setFillStyle(backgroundHoverColor, opacity)
      }
      if (hoverHandler) {
        hoverHandler(true)
      }
    })

    this.on('pointerout', () => {
      if (backgroundHoverColor) {
        this.background.setFillStyle(backgroundColor, backgroundOpacity)
      }
      if (hoverHandler) {
        hoverHandler(false)
      }
    })
  }
}
