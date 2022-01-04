import { WORLD, MINIMAP_SCALE } from '../main'
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
      .setBounds(WORLD.origin.x, WORLD.origin.y, WORLD.width, WORLD.height)
      .setZoom(1 / MINIMAP_SCALE)
      .centerToBounds()
      .setName('mini')
      .setBackgroundColor(0xf0f0f0)

    scene.input.keyboard.on('keydown-M', this.toggle)
  }

  toggle = () => {
    this.visible = !this.visible
  }
}
