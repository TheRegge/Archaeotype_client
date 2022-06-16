import ContainerWithBg, { ContainerWithBgOptions } from './ContainerWithBg'
import Config from '../common/Config'
import AdminTools from './AdminTools'

export default class ToolbarButton extends ContainerWithBg {
  public selected: boolean = false
  public pointerDown: () => void

  public constructor(
    toolbar: AdminTools,
    icon: any,
    index: number,
    pointerDown: () => void,
    toggleOnInit: boolean = false
  ) {
    const padding = toolbar.width / 4
    const topY = 0 - toolbar.height / 2 + toolbar.width / 4
    const buttonWidth = toolbar.width / 2
    const buttonHeight = toolbar.width / 2

    const clickHandler = () => {
      this.toggle()
      toolbar.selectTool(this)
      pointerDown()
    }

    const options = {
      scene: toolbar.scene,
      x: 0 - padding,
      y: topY + index * (buttonHeight + padding),
      width: buttonWidth,
      height: buttonHeight,
      backgroundColor: Config.COLOR_GRAY_700,
      // backgroundOverColor: Config.COLOR_GRAY_400,
      clickHandler,
    }

    super(options)

    this.pointerDown = pointerDown
    this.setData('index', index)

    const buttonText = new Phaser.GameObjects.Text(this.scene, 0, 0, icon, {
      fontSize: '1.5rem',
      color: '#fff',
      align: 'center',
    })
    buttonText.setOrigin(0.5, 0.5)
    this.add(buttonText)

    if (toggleOnInit) {
      this.toggle()
    }
  }

  public toggle() {
    this.selected = !this.selected
    this.background.setFillStyle(
      this.selected ? Config.COLOR_HINT_SECONDARY : Config.COLOR_GRAY_700
    )
  }
}
