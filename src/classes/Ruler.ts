import { IToggle } from "./IToggle"

export type RulerUnitSettings = {
  type: 'vertical' | 'horizontal'
  x: number
  y: number
  lineStartX: number
  lineStartY: number
  lineEndX: number
  lineEndY: number
}
/**
 * Type for Ruler constructor options
 */
export type RulerOptions = {
  /**
   * The Scene containing the Ruler
   */
  scene: Phaser.Scene

  /**
   * The width of the ruler
   */
  width: number

  /**
   * The height of the ruler
   */
  height: number

  /**
   * The size of one unit on the ruler
   */
  rulerScale: number

  /**
   * The number of units on the ruler
   */
  unitsNum: number

  /**
   * The font size for the text displaying the ruler units
   */
  fontSize?: number

  /**
   * The color of the text for the ruler units.
   * This is used as a CSS color format, like '#FF0000' for  red
   */
  textColor?: string

  /**
   * The width of each unit tick on the ruler
   */
  strokeWidth?: number

  /**
   * The color of each unit tick on the ruler
   */
  strokeColor?: number

  /**
   * The opacity of each unit tick on the ruler
   */
  strokeAlpha?: number

  /**
   * The background color of the ruler
   */
  backgroundColor?: number

  /**
   * The opacity of the background. Between 0 and 1
   */
  backgroundAlpha?: number

  /**
   * Use letter instead of numbers. From A to Z followed to AA to ZZ,
   * thus limiting the size of the ruler to 52 units
   */
  useLetters?: boolean
}

/**
 * Create a Ruler
 *
 * Rulers appear on the top and left side of the Site scene and
 * enable the students to describe the coordinates of an object 
 * on the site.
 *
 * __Note:__ A ruler can be either horizontal or vertical. This is
 * decided by the ratio of `width / height`
 */
export default class Ruler extends Phaser.GameObjects.Container implements IToggle {

  public width: number
  public height: number
  private background: Phaser.GameObjects.Rectangle
  private fontSize: number
  private unitsNum: number
  private rulerScale: number
  private useLetters: boolean
  private letters: string[]
  private textColor: string
  private strokeWidth: number
  private strokeColor: number
  private strokeAlpha: number
  private backgroundColor: number
  private backgroundAlpha: number

  public constructor(options: RulerOptions) {

    super(options.scene, options.width / 2, options.height / 2)

    this.width = options.width
    this.height = options.height
    this.rulerScale = options.rulerScale
    this.unitsNum = options.unitsNum
    this.fontSize = options.fontSize || 12
    this.useLetters = options.useLetters || false
    this.textColor = options.textColor || "#FFFFFF"
    this.strokeWidth = options.strokeWidth || 2
    this.strokeColor = options.strokeColor || 0xFFFFFF
    this.strokeAlpha = options.strokeAlpha || 1
    this.backgroundColor = options.backgroundColor || 0x000000
    this.backgroundAlpha = options.backgroundAlpha || 0.6
    this.scene.add.existing(this)

    this.letters = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      'AA', 'BB', 'CC', 'DD', 'EE', 'FF', 'GG', 'HH', 'II', 'JJ', 'KK', 'LL', 'MM', 'NN', 'OO', 'PP', 'QQ', 'RR', 'SS', 'TT', 'UU', 'VV', 'WW', 'XX', 'YY', 'ZZ'
    ]

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

      const txt = this.useLetters ? this.letters[i - 1] : i + ''
      const tickText = new Phaser.GameObjects.Text(this.scene, coords.x, coords.y, txt, { fontFamily: 'Varela Round', fontSize: `${this.fontSize}px`, color: `${this.textColor}` })

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