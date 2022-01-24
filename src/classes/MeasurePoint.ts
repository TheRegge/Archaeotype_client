import Config from '../common/Config'
import Utils from '../common/Utils'

export default class MeasurePoint extends Phaser.GameObjects.Ellipse {
  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    radius: number,
    fillColor: number,
    fillOpacity: number,
    strokeColor: number,
    strokeOpacity: number
  ) {
    super(scene, x, y, radius * 2, radius * 2, fillColor, fillOpacity)
    this.setStrokeStyle(1, strokeColor, strokeOpacity)
    this.setOrigin(0.5, 0.5)
    this.setScrollFactor(0, 0)
  }
}
