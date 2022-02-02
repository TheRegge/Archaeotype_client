import BaseScene from '~/scenes/BaseScene'
import ContainerWithBg, { ContainerWithBgOptions } from './ContainerWithBg'

export default class SiteQuad extends ContainerWithBg {
  constructor(options: ContainerWithBgOptions) {
    super(options)

    this.clickHandler = () => {
      const toScene = this.scene.scene.manager.getScene('quad')
      toScene.data.set('quad', this.getData('quad'))

      const scene = <BaseScene>this.scene
      scene.switchScene('quad')
    }

    let color = Phaser.Display.Color.IntegerToColor(options.backgroundColor)
    color = color.lighten(50)

    this.background.setStrokeStyle(
      1,
      Phaser.Display.Color.GetColor(color.red, color.green, color.blue),
      1
    )
  }
}
