import { IToggle } from "./IToggle"

type RulerSettings = {
  type: 'vertical' | 'horizontal'
  x: number
  y: number
  x1: number
  y1: number
  x2: number
  y2: number
  unitsNumber: number
  strokeWidth?: number
  strokeColor?: number
  strokeAlpha?: number
  textSize?: number
  textColor?: string
}
export default class Ruler extends Phaser.GameObjects.Container implements IToggle {
  public scene: Phaser.Scene
  public background: Phaser.GameObjects.Rectangle
  public fontSize: number
  public unitsNum: number
  public rulerScale: number
  public width: number
  public height: number

  public constructor(scene: Phaser.Scene, width: number, height: number, rulerScale: number, unitsNum: number, fontSize = 13) {

    super(scene, width / 2, height / 2)

    this.width = width
    this.height = height
    this.unitsNum = unitsNum
    this.rulerScale = rulerScale
    this.fontSize = fontSize

    this.scene = scene
    this.scene.add.existing(this)
    scene.input.keyboard.on('keydown-R', this.toggle)

    this.background = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, width, height, 0x000000, 0.2)
    this.add(this.background)

    let rulerSettings: RulerSettings = {
      type: 'horizontal',
      x: 0,
      y: 0,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      unitsNumber: this.unitsNum,
      strokeWidth: 1,
      strokeColor: 0x000000,
      textSize: 13,
      textColor: "#333333"
    }

    // Overide settings for horizontal & vertical
    if (width > height) {
      this.setScrollFactor(1, 0)
    } else if (height > width) {
      this.setScrollFactor(0, 1)
      rulerSettings.type = 'vertical'
    }

    this.initRuler(rulerSettings)

  }

  toggle = () => {
    this.visible = !this.visible
  }

  protected initRuler(settings: RulerSettings): void {
    let { type, x, y, x1, y1, x2, y2, unitsNumber, strokeWidth = 1, strokeColor = 0x000000, strokeAlpha = 1, textSize = 13, textColor = '#0000000' } = settings

    for (let i = 1; i <= unitsNumber; i++) {

      if (type === 'horizontal') {
        x = (i * this.rulerScale) - (this.width / 2)
        y1 = this.height * -1 / 2
        y2 = this.height / 5
      } else if (type === 'vertical') {
        y = (i * this.rulerScale) - (this.height / 2)
        x1 = this.width * -1 / 2
        x2 = this.width / 5
      }
      const coords = { x, y, x1, y1, x2, y2 }

      const tick = new Phaser.GameObjects.Line(this.scene, coords.x, coords.y, coords.x1, coords.y1, coords.x2, coords.y2)
      tick.setStrokeStyle(strokeWidth, 0x000000, 0.5)
      this.add(tick)
      const tickText = new Phaser.GameObjects.Text(this.scene, coords.x, coords.y, i + '', { fontFamily: 'Varela Round', fontSize: `${textSize}px`, color: `${textColor}` })

      if (type === 'horizontal') {
        if (i === this.unitsNum) {
          tickText.setX(tickText.x - tickText.width - 2)
        } else {
          tickText.setX(tickText.x - tickText.width / 2)
        }
      } else if (type === 'vertical') {
        tickText.setX(tickText.x - 3)
        if (i === this.unitsNum) {
          tickText.setY(tickText.y - tickText.height - 2)
        } else {
          tickText.setY(tickText.y - tickText.height / 2)
        }
      }
      this.add(tickText)
    }
  }
}