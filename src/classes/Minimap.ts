import config from '../common/Config'
import { IToggle } from './IToggle'

export default class Minimap
  extends Phaser.Cameras.Scene2D.Camera
  implements IToggle
{
  public constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    scene: Phaser.Scene
  ) {
    super(x, y, width, height)

    this.setRoundPixels(true)
      .setBounds(
        config.WORLD.origin.x,
        config.WORLD.origin.y,
        config.WORLD.width,
        config.WORLD.height
      )
      .setZoom(config.MINIMAP.scale)
      .centerToBounds()
      .setBackgroundColor(config.COLOR_GRAY_50)

    scene.input.keyboard.on('keydown-M', this.toggle)
  }

  toggle = () => {
    this.visible = !this.visible
  }
}
