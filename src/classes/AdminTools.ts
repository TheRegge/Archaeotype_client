import { IToggle } from '../common/Interfaces'
import ContainerWithBg, { ContainerWithBgOptions } from './ContainerWithBg'
import Config from '../common/Config'
import ArtifactsChooser from './ArtifactsChooser'
import { QuadScene } from '../scenes'

export default class AdminTools extends ContainerWithBg implements IToggle {
  public button1: ContainerWithBg
  public button2: ContainerWithBg
  public buttonWidth: number
  public buttonHeight: number
  public artifactsChooser: ArtifactsChooser | null = null
  public topY: number
  public padding: number
  public constructor(options: ContainerWithBgOptions) {
    super(options)

    this.topY = 0 - this.height / 2 + this.width / 4
    this.padding = this.width / 4
    this.buttonWidth = this.width / 2
    this.buttonHeight = this.width / 2

    this.button1 = new ContainerWithBg({
      scene: this.scene,
      x: 0 - this.padding,
      y: this.topY,
      width: this.buttonWidth,
      height: this.buttonHeight,
      backgroundColor: Config.COLOR_HINT_PRIMARY,
      backgroundOverColor: Config.COLOR_HINT_SECONDARY,
    })

    this.button1.setInteractive(true)
    this.button1.on('pointerdown', () => {
      const quadScene = this.scene as QuadScene
      quadScene.artifactsChooser?.toggle()
      quadScene.setPointerState(
        quadScene.pointerState === 'add' ? 'edit' : 'add'
      )
    })
    this.add(this.button1)

    this.button2 = new ContainerWithBg({
      scene: this.scene,
      x: 0 - this.width / 4,
      y: this.topY + this.buttonHeight + this.padding,
      width: this.buttonWidth,
      height: this.buttonHeight,
      backgroundColor: Config.COLOR_HINT_SECONDARY,
      backgroundOverColor: Config.COLOR_HINT_SECONDARY_STRONG,
    })

    this.button2.setInteractive(true)
    this.button2.on('pointerdown', () => {
      const quadScene = this.scene as QuadScene
      quadScene.setPointerState(
        quadScene.pointerState === 'delete' ? 'edit' : 'delete'
      )
    })
    this.add(this.button2)
  }

  toggle = () => {
    this.visible = !this.visible
  }
}
