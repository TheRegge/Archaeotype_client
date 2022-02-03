import { IToggle } from './IToggle'
import config from '../common/Config'
import Utils from '../common/Utils'

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
   * The color for the less visible text. Used for fractional ruler units.
   * This is used as a CSS color format, like '#FF0000' for  red
   */
  textColorQuiet?: string

  /**
   * The width of each unit tick on the ruler
   */
  strokeWidth?: number

  /**
   * The color of each unit tick on the ruler
   */
  tickColor?: number

  /**
   * The opacity of each unit tick on the ruler
   */
  tickAlpha?: number

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
 * Rulers appear on the top and left side of the Quad scene and
 * enable the students to describe the coordinates of an object
 * on the quad.
 *
 * __Note:__ A ruler can be either horizontal or vertical. This is
 * decided by the ratio of `width / height`
 */
export default class Ruler
  extends Phaser.GameObjects.Container
  implements IToggle
{
  public width: number
  public height: number
  private background: Phaser.GameObjects.Rectangle
  private fontSize: number
  private unitsNum: number
  private rulerScale: number
  private useLetters: boolean
  private textColor: string
  private textColorQuiet: string
  private strokeWidth: number
  private tickColor: number
  private tickAlpha: number
  private backgroundColor: number
  private backgroundAlpha: number

  public constructor(options: RulerOptions) {
    super(options.scene, 0, 0)

    this.width = options.width
    this.height = options.height
    this.rulerScale = options.rulerScale
    this.unitsNum = options.unitsNum
    this.fontSize = options.fontSize || 14
    this.useLetters = options.useLetters || false
    this.textColor = options.textColor || '#FFFFFF'
    this.textColorQuiet = options.textColorQuiet || '#aaaaaa'
    this.strokeWidth = options.strokeWidth || 2
    this.tickColor = options.tickColor || 0xffffff
    this.tickAlpha = options.tickAlpha || 1
    this.backgroundColor = options.backgroundColor || 0x000000
    this.backgroundAlpha = options.backgroundAlpha || 0.6

    this.scene.input.keyboard.on('keydown-R', this.toggle)

    this.background = new Phaser.GameObjects.Rectangle(
      this.scene,
      0,
      0,
      this.width,
      this.height,
      this.backgroundColor,
      this.backgroundAlpha
    )
    this.background.setOrigin(0)
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
        x = i * this.rulerScale
        lineStartY = 0
        lineEndY = this.height / 3
      } else if (type === 'vertical') {
        this.background.setY(config.WORLD.innerPadding)
        y = i * this.rulerScale + this.width
        lineStartX = 0
        lineEndX = this.width / 3
      }

      const coords = { x, y, lineStartX, lineStartY, lineEndX, lineEndY }

      const tick = new Phaser.GameObjects.Line(
        this.scene,
        coords.x,
        coords.y,
        coords.lineStartX,
        coords.lineStartY,
        coords.lineEndX,
        coords.lineEndY
      )
      tick
        .setStrokeStyle(this.strokeWidth, this.tickColor, this.tickAlpha)
        .setOrigin(0)
      this.add(tick)

      // const tileNumber = i * config.TILE_SCALE
      const tileNumber = i
      const rulerNumber = i * config.TILE_SCALE
      const tileNumberTxt = this.useLetters
        ? config.LETTERS[i - 1]
        : '' + tileNumber

      const tileTextObj = new Phaser.GameObjects.Text(
        this.scene,
        coords.x,
        coords.y,
        tileNumberTxt,
        {
          fontFamily: 'Cousine',
          fontSize: `${this.fontSize}px`,
          color:
            (tileNumber * 2) % 2 > 0 && !this.useLetters
              ? `${this.textColorQuiet}`
              : `${this.textColor}`,
        }
      )

      const tickTextObj = new Phaser.GameObjects.Text(
        this.scene,
        coords.x,
        coords.y,
        rulerNumber + 'm',
        {
          fontFamily: 'Cousine',
          fontSize: `${Math.floor(this.fontSize * (4 / 5))}px`,
          color: `${Utils.hexToString(this.tickColor)}`,
        }
      )

      if (type === 'horizontal') {
        // Center the text horizontally between the ticks
        tileTextObj.setX(
          Math.floor(
            tileTextObj.x - tileTextObj.width / 2 - this.rulerScale / 2
          )
        )
        tileTextObj.setY(Math.floor(tileTextObj.y + tileTextObj.height / 2))

        tickTextObj.setX(Math.floor(tickTextObj.x - tickTextObj.width / 2))

        // Move the last one a bit more to the left so we can read it
        if (i === this.unitsNum) {
          tickTextObj.setX(Math.floor(tickTextObj.x - tickTextObj.width / 2))
        }
        tickTextObj.setY(Math.floor(tickTextObj.y + this.height / 2))
      } else if (type === 'vertical') {
        // Move text in a bit, so it fits in the width of the ruler
        tileTextObj.setX(
          Math.floor(tileTextObj.x - tileTextObj.width / 2 + this.width / 2)
        )
        // Center the text vertically between the ticks
        tileTextObj.setY(
          Math.floor(
            tileTextObj.y - tileTextObj.height / 2 - this.rulerScale / 2
          )
        )

        // Adjust the tick text
        tickTextObj.setX(Math.floor(tickTextObj.x + this.width / 2))
        tickTextObj.setRotation(Utils.degreesToRandian(270))
        tickTextObj.setY(Math.floor(tickTextObj.y + tickTextObj.width / 2))
        if (i === this.unitsNum) {
          tickTextObj.setY(Math.floor(tickTextObj.y - tickTextObj.width / 2))
        }
      }

      this.add(tickTextObj)
      this.add(tileTextObj)
    }
  }
}
