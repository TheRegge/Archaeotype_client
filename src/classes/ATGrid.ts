

export default class ATGrid extends Phaser.GameObjects.Grid {

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
      x,
      y,
      width,
      height,
      cellWidth,
      cellHeight,
      fillColor,
      fillAlpha,
      outlineFillColor,
      outlineFillAlpha)

    this.setDisplayOrigin(0, 0)

    this.scene.input.keyboard.on('keydown-G', this.toggle)
  }

  toggle = () => {
    this.visible = !this.visible
  }

}