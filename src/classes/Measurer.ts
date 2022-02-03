import { IToggle } from './IToggle'
import config from '../common/Config'
import Utils from '../common/Utils'
import MeasurePoint from './MeasurePoint'

export type MeasurerOptions = {
  scene: Phaser.Scene
}

/**
 * Tool to measure distances in meters.
 *
 * @export
 * @class Measurer
 * @extends {Phaser.GameObjects.Container}
 * @implements {IToggle}
 */
export default class Measurer
  extends Phaser.GameObjects.Container
  implements IToggle
{
  protected startPointA: Phaser.Geom.Point
  protected startPointB: Phaser.Geom.Point
  protected pointA: MeasurePoint
  protected pointB: MeasurePoint
  protected line: Phaser.GameObjects.Line
  protected textDisplay: Phaser.GameObjects.Text

  public constructor(options: MeasurerOptions) {
    super(options.scene, 0, 0)

    this.startPointA = new Phaser.Geom.Point(
      config.VIEWPORT.width / 4,
      config.VIEWPORT.height / 2
    )
    this.startPointB = new Phaser.Geom.Point(
      (config.VIEWPORT.width / 4) * 3,
      config.VIEWPORT.height / 2
    )
    this.width = config.VIEWPORT.width
    this.height = config.VIEWPORT.height

    this.visible = false

    this.scene.input.keyboard.on('keydown-Z', this.toggle)

    // CREATE POINTS
    this.pointA = new MeasurePoint(
      this.scene,
      config.VIEWPORT.width / 4,
      config.VIEWPORT.height / 2,
      15,
      0xffff00,
      0.2,
      0xffff00,
      1
    )
    this.pointA.setName('pointA')
    this.pointA.setInteractive()

    this.pointB = new MeasurePoint(
      this.scene,
      (config.VIEWPORT.width / 4) * 3,
      config.VIEWPORT.height / 2,
      15,
      0xffff00,
      0.2,
      0xffff00,
      1
    )
    this.pointB.setName('pointB')
    this.pointB.setInteractive()

    // CREATE LINE
    this.line = new Phaser.GameObjects.Line(
      this.scene,
      0,
      0,
      this.pointA.x,
      this.pointA.y,
      this.pointB.x,
      this.pointB.y,
      0xffff00,
      1
    )
    this.line.setOrigin(0)
    this.line.setScrollFactor(0, 0)

    // CREATE TEXT DISPLAY
    this.textDisplay = new Phaser.GameObjects.Text(
      this.scene,
      this.pointA.x - this.pointA.width / 2,
      this.pointA.y + this.pointA.height,
      '0m',
      {
        fontFamily: 'Cousine',
        fontSize: '16px',
        color: '#ffff00',
        backgroundColor: '#000000',
        padding: {
          x: 4,
          y: 4,
        },
        align: 'center',
      }
    )
    this.textDisplay.setScrollFactor(0, 0)

    // Add objects to the scene and setup
    this.add(this.pointA)
    this.scene.input.setDraggable(this.pointA)
    this.add(this.pointB)
    this.scene.input.setDraggable(this.pointB)
    this.add(this.line)
    this.add(this.textDisplay)

    this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX
      gameObject.y = dragY
      this.updateLine()
      this.updateTextDisplay()
    })
  }

  toggle = () => {
    this.visible = !this.visible
    this.reset()
    if (!this.visible) {
      this.setInteractive()
    } else {
      this.disableInteractive()
    }
  }

  /**
   * Resets the measurer to its original state.
   *
   * @memberof Measurer
   */
  reset = (): void => {
    this.pointA.setX(this.startPointA.x)
    this.pointA.setY(this.startPointA.y)
    this.pointB.setX(this.startPointB.x)
    this.pointB.setY(this.startPointB.y)
    this.updateLine()
    this.updateTextDisplay()
  }

  /**
   * Sets the position of the line relative to `this.pointA` and pointB
   *
   * @memberof Measurer
   */
  updateLine = () => {
    this.line.setTo(this.pointA.x, this.pointA.y, this.pointB.x, this.pointB.y)
  }

  /**
   * Updates the text content and the position of the TextDisplay element.
   *
   * The position of the text is relative to pointA
   *
   * @memberof Measurer
   */
  updateTextDisplay = () => {
    this.textDisplay.setText(`${this.getDistanceInMeters()}m`)
    this.textDisplay.setPosition(
      this.pointA.x - this.pointA.width / 2,
      this.pointA.y + this.pointA.height
    )
  }

  getDistanceInMeters = () => {
    const rect = {
      width: Math.abs(this.line.geom.x2 - this.line.geom.x1),
      height: Math.abs(this.line.geom.y2 - this.line.geom.y1),
    }
    const distanceInPixels = Math.sqrt(rect.width ** 2 + rect.height ** 2)
    return Math.round(Utils.pixelsToMeters(distanceInPixels) * 100) / 100
  }
}
