import { IToggle } from '.'

export default class ATGrid extends Phaser.GameObjects.Grid implements IToggle {
  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    cellWidth: number,
    cellHeight: number,
    fillColor?: number,
    fillAlpha?: number,
    outlineFillColor?: number,
    outlineFillAlpha?: number
  ) {
    super(
      scene,
      0,
      0,
      width,
      height,
      cellWidth,
      cellHeight,
      fillColor,
      fillAlpha,
      outlineFillColor,
      outlineFillAlpha
    )

    this.scene.input.keyboard.on('keydown-G', this.toggle)
  }

  toggle = () => {
    this.visible = !this.visible
  }
}
