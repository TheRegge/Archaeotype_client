import { WORLD, MINIMAP_SCALE } from '../main'

export default class Minimap extends Phaser.Cameras.Scene2D.Camera {

  public constructor(x: number, y: number, width: number, height: number, scene: Phaser.Scene) {

    super(x, y, width, height)

    this.setRoundPixels(true)
      .setBounds(0, 0, WORLD.width, WORLD.height)
      .setZoom(1 / MINIMAP_SCALE)
      .centerToBounds()
      .setName('mini')
      .setBackgroundColor(0xF0F0F0)

    scene.input.keyboard.on('keydown-M', this.toggle)

  }

  toggle = () => {
    this.visible = !this.visible
  }
}