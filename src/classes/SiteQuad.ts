import BaseScene from '../scenes/BaseScene'
import config from '../common/Config'
import ContainerWithBg, { ContainerWithBgOptions } from './ContainerWithBg'
import Auth from '../common/Auth'

export default class SiteQuad extends ContainerWithBg {
  public backgroundColor: number

  constructor(options: ContainerWithBgOptions) {
    super(options)

    this.setData('quad', options?.data?.quad)
    this.backgroundColor = options.backgroundColor
    this.clickHandler = this.handleClick

    this.setStyle()
    this.setText()
  }

  setStyle() {
    let color = Phaser.Display.Color.IntegerToColor(this.backgroundColor)
    color = color.lighten(50)

    this.background.setStrokeStyle(
      1,
      Phaser.Display.Color.GetColor(color.red, color.green, color.blue),
      1
    )
  }

  setText = () => {
    let textString = this.getData('quad').name
    // if (Auth.isAdmin()) textString += ' - ' + this.getData('quad').description
    const text = new Phaser.GameObjects.Text(
      this.scene,
      0,
      Math.round(this.background.height + 5),
      textString,
      {
        fontFamily: config.GOOGLE_FONT_FAMILY,
        fontSize: '10px',
        color: 'black',
        backgroundColor: 'white',
        padding: { x: 3, y: 1 },
      }
    )
    text.setOrigin(0.5, 1)
    this.add(text)
  }

  handleClick() {
    const toScene = this.scene.scene.manager.getScene('quad')
    toScene.data.set('quad', this.getData('quad'))

    const scene = <BaseScene>this.scene
    scene.switchScene('quad')
  }
}
