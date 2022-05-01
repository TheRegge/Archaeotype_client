import { IToggle } from '../common/Interfaces'
import ContainerWithBg, { ContainerWithBgOptions } from './ContainerWithBg'
import Config from '../common/Config'
import ArtifactsChooser from './ArtifactsChooser'
import { QuadScene } from '../scenes'

export default class AdminTools extends ContainerWithBg implements IToggle {
  public button1: ContainerWithBg
  public artifactsChooser: ArtifactsChooser | null = null
  public constructor(options: ContainerWithBgOptions) {
    super(options)

    this.button1 = new ContainerWithBg({
      scene: this.scene,
      x: 0 - this.width / 4,
      y: 0 - this.height / 2 + this.width / 4,
      width: this.width / 2,
      height: this.width / 2,
      backgroundColor: Config.COLOR_HINT_PRIMARY,
      backgroundOverColor: Config.COLOR_HINT_SECONDARY,
    })

    this.button1.setInteractive(true)
    // this.scene.input.setDraggable(this.button1)
    this.button1.on('pointerdown', () => {
      const quadScene = this.scene as QuadScene
      quadScene.artifactsChooser?.toggle()
    })
    this.add(this.button1)
  }

  toggle = () => {
    this.visible = !this.visible
  }
}
