import { IToggle } from "./IToggle"

type RulerUnitSettings = {
  type: 'vertical' | 'horizontal'
  x: number
  y: number
  lineStartX: number
  lineStartY: number
  lineEndX: number
  lineEndY: number
}

type RulerOptions = {
  scene: Phaser.Scene
  width: number
  height: number
  rulerScale: number
  unitsNum: number
  fontSize?: number
  textColor?: string
  strokeWidth?: number
  strokeColor?: number
  strokeAlpha?: number
  backgroundColor?: number
  backgroundAlpha?: number
  textSize?: number
  textColor?: string
}
export default class Ruler extends Phaser.GameObjects.Container implements IToggle {

  background: Phaser.GameObjects.Rectangle
  fontSize: number
  unitsNum: number
  rulerScale: number
  width: number
  height: number
  public constructor(scene: Phaser.Scene, width: number, height: number, rulerScale: number, unitsNum: number, fontSize = 13) {
  textColor: string
  strokeWidth: number
  strokeColor: number
  strokeAlpha: number
  backgroundColor: number
  backgroundAlpha: number

  public constructor(options: RulerOptions) {

    super(options.scene, options.width / 2, options.height / 2)

    this.width = options.width
    this.height = options.height
    this.rulerScale = options.rulerScale
    this.unitsNum = options.unitsNum
    this.fontSize = options.fontSize || 12
    this.scene = scene
    this.textColor = options.textColor || "#FFFFFF"
    this.strokeWidth = options.strokeWidth || 2
    this.strokeColor = options.strokeColor || 0xFFFFFF
    this.strokeAlpha = options.strokeAlpha || 1
    this.backgroundColor = options.backgroundColor || 0x000000
    this.backgroundAlpha = options.backgroundAlpha || 0.6
    this.scene.add.existing(this)

    this.background = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, width, height, 0x000000, 0.6)
    this.scene.input.keyboard.on('keydown-R', this.toggle)

    this.background = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, this.width, this.height, this.backgroundColor, this.backgroundAlpha)
    this.add(this.background)

    let rulerUnitSettings: RulerUnitSettings = {
      type: 'horizontal',
      x: 0,
      y: 0,
      lineStartX: 0,
      lineStartY: 0,
      lineEndX: 0,
      lineEndY: 0,
    }

    // Overide settings for horizontal & vertical
    if (this.width > this.height) {
      this.setScrollFactor(1, 0)
    } else if (this.height > this.width) {
      this.setScrollFactor(0, 1)
      rulerUnitSettings.type = 'vertical'
    }

    this.initRuler(rulerUnitSettings)

  }

  toggle = () => {
    this.visible = !this.visible
  }

  protected initRuler(settings: RulerUnitSettings): void {
    let { type, x, y, lineStartX, lineStartY, lineEndX, lineEndY } = settings

    for (let i = 1; i <= this.unitsNum; i++) {

      if (type === 'horizontal') {
        x = (i * this.rulerScale) - (this.width / 2)
        lineStartY = this.height * -1 / 2
        lineEndY = this.height / 5

      } else if (type === 'vertical') {
        y = (i * this.rulerScale) - (this.height / 2)
        lineStartX = this.width * -1 / 2
        lineEndX = this.width / 5
      }

      const coords = { x, y, lineStartX, lineStartY, lineEndX, lineEndY }

      const tick = new Phaser.GameObjects.Line(this.scene, coords.x, coords.y, coords.lineStartX, coords.lineStartY, coords.lineEndX, coords.lineEndY)
      tick.setStrokeStyle(this.strokeWidth, this.strokeColor, this.strokeAlpha)
      this.add(tick)

      const tickText = new Phaser.GameObjects.Text(this.scene, coords.x, coords.y, i + '', { fontFamily: 'Varela Round', fontSize: `${textSize}px`, color: `${textColor}` })

      if (type === 'horizontal') {
        // Center the text horizontally between the ticks
        tickText.setX(tickText.x - tickText.width / 2 - this.rulerScale / 2)
        tickText.setY(tickText.y - tickText.height / 2)
      } else if (type === 'vertical') {
        // Move text in a bit, so it fits in the width of the ruler
        tickText.setX(tickText.x - tickText.width / 2)
        // Center the text vertically between the ticks
        tickText.setY(tickText.y - tickText.height / 2 - this.rulerScale / 2)
      }
      this.add(tickText)
    }
  }
}